# Arquitetura: Integracao Mercado Pago — novob2b

**Data:** 2026-03-18
**Autor:** @architect
**Task:** T6.1
**Status:** Decisao tecnica final

---

## 1. Decisao: Modelo de Integracao

### Opcoes Avaliadas

| Opcao | Descricao | Pros | Contras |
|-------|-----------|------|---------|
| **Checkout Pro (redirect)** | Redireciona para MP, retorna ao app | Simples, PCI-free, PIX+cartao+boleto incluidos | UX quebrada (sai do app), sem controle visual |
| **Checkout Bricks (inline)** | Componentes MP embutidos na pagina | Boa UX, PCI-compliant, customizavel | SDK JS pesado (~200KB), depende de CDN MP |
| **API direta + Custom UI** | Tokeniza cartao via SDK, chama API MP | Controle total de UX | Mais complexo, precisa PCI-DSS para cartao |

### Decisao: **Checkout Pro para PIX/Boleto + "Pagar na Entrega"**

**Justificativa:**
1. O B2B do sacolao opera com **PIX e Boleto** — nao precisa de cartao de credito (maioria dos clientes paga na entrega ou via PIX)
2. O Checkout Pro gera o **QR Code PIX** e o **boleto** automaticamente, com webhook de confirmacao
3. "Pagar na Entrega" nao passa pelo MP — e um status interno do pedido
4. Menor complexidade = menor risco no MVP
5. Se no futuro precisar de cartao inline, migrar para Bricks sem reescrever o backend

**Fluxo escolhido:**
```
Cliente → Checkout → Escolhe metodo:
  ├─ PIX/Boleto → Cria preferencia MP → Redirect MP → Paga → Webhook confirma → Pedido aprovado
  └─ Pagar na Entrega → Pedido criado como "aguardando_entrega" → Admin marca como pago
```

---

## 2. Arquitetura de Split (Marketplace)

### Modelo: Application Fee (taxa por transacao)

O Mercado Pago suporta **marketplace** onde:
- O **sacolao** (seller) recebe o pagamento principal
- A **Jubileu** (marketplace owner) recebe uma **application_fee** por transacao

```
Fluxo do dinheiro:
  Cliente paga R$100
  ├─ Sacolao recebe: R$100 - R$X (fee MP) - R$Y (application_fee)
  └─ Jubileu recebe: R$Y (application_fee)
```

### Configuracao necessaria:
1. **Conta MP do Sacolao** — seller (collector)
2. **Aplicacao MP da Jubileu** — marketplace (application owner)
3. O sacolao precisa **autorizar** a aplicacao da Jubileu via OAuth
4. `application_fee` configuravel no admin (T5.6 delivery_config ou novo campo)

### Credenciais:
```env
# .env (servidor)
MP_ACCESS_TOKEN=APP_USR-...          # Access token da aplicacao Jubileu (marketplace)
MP_PUBLIC_KEY=APP_USR-...            # Public key (para SDK frontend se necessario)
MP_COLLECTOR_ID=123456789            # ID do sacolao (seller) que recebe pagamentos
MP_APPLICATION_FEE_PCT=3             # % de comissao Jubileu (configuravel)
MP_WEBHOOK_SECRET=whsec_...          # Secret para validar webhooks
```

---

## 3. Backend: Express API Routes (nao Edge Functions)

### Decisao: Express (server.js) ao inves de Supabase Edge Functions

**Justificativa:**
- Ja existe `server.js` Express 5 em producao
- Edge Functions do Supabase free tier tem cold start (~2s) e limite de execucao
- Webhook do MP precisa de resposta rapida (< 500ms) — Express e mais confiavel
- Secrets MP ficam no servidor, nao expostos ao cliente

### Novos endpoints:

```
POST /api/mp/create-preference     → Cria preferencia MP para um pedido
POST /api/mp/webhook               → Recebe notificacoes do MP (IPN/Webhooks v2)
GET  /api/mp/status/:order_id      → Consulta status do pagamento
```

### Estrutura de arquivos (backend):

```
server.js                           ← Adicionar rotas /api/mp/*
src/server/
├── mp-routes.js                    ← Router Express com 3 endpoints
├── mp-service.js                   ← Logica de negocio (criar preferencia, processar webhook)
└── mp-webhook-validator.js         ← Validacao de assinatura do webhook
```

---

## 4. Fluxo Detalhado: PIX via Mercado Pago

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────→│ Express  │────→│ MP API   │────→│ Supabase │
│ React    │     │ server.js│     │          │     │ Postgres │
└─────────┘     └──────────┘     └──────────┘     └──────────┘

1. Cliente finaliza pedido no checkout
   └─ Frontend chama RPC create_order_validated() → cria pedido status='pending_payment'

2. Frontend chama POST /api/mp/create-preference
   └─ Body: { order_id }
   └─ Express:
      a. Busca pedido no Supabase (valida que pertence ao user)
      b. Monta preference MP:
         {
           items: [{ title, quantity, unit_price }],
           payer: { email },
           payment_methods: { excluded_types: [{ id: "credit_card" }] },  // so PIX/boleto
           back_urls: { success, failure, pending },
           notification_url: "https://app.levee.com.br/api/mp/webhook",
           external_reference: order_id,
           marketplace_fee: total * fee_pct
         }
      c. Chama MP API → POST /checkout/preferences
      d. Salva mp_preference_id no pedido
      e. Retorna { init_point: "https://www.mercadopago.com.br/checkout/v1/..." }

3. Frontend redireciona para init_point (Checkout Pro do MP)
   └─ Cliente paga via PIX ou Boleto na tela do MP

4. MP envia webhook para POST /api/mp/webhook
   └─ Express:
      a. Valida assinatura do webhook (x-signature header)
      b. Consulta MP API para detalhes do pagamento
      c. Atualiza pedido:
         - approved → status='approved', payment_status='paid'
         - pending  → mantem status='pending_payment'
         - rejected → status='rejected', payment_status='failed'
      d. Insere registro em payment_transactions
      e. Responde 200 OK

5. Cliente retorna ao app (back_url)
   └─ Frontend consulta GET /api/mp/status/:order_id
   └─ Exibe status atualizado (sucesso ou aguardando)
```

---

## 5. Fluxo: "Pagar na Entrega"

```
1. Cliente escolhe "Pagar na Entrega" no checkout
2. Frontend chama RPC create_order_validated() com payment_method='entrega'
3. Pedido criado com status='pending_delivery_payment'
4. Admin ve pedido na lista com badge "Pagar na Entrega"
5. Entregador recebe pagamento (dinheiro/maquininha)
6. Admin marca pedido como "Pago" manualmente → status='approved'
```

**Nao passa pelo Mercado Pago** — e controle interno.

---

## 6. Mudancas no Schema

### 6.1 Novos valores de enum

```sql
-- Expandir payment_method enum
ALTER TYPE payment_method ADD VALUE IF NOT EXISTS 'mercado_pago';
ALTER TYPE payment_method ADD VALUE IF NOT EXISTS 'entrega';

-- Expandir order_status enum
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'pending_payment';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'pending_delivery_payment';
```

### 6.2 Nova tabela: payment_transactions

```sql
CREATE TABLE payment_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  gateway         TEXT NOT NULL DEFAULT 'mercado_pago',
  external_id     TEXT,                          -- MP payment ID
  preference_id   TEXT,                          -- MP preference ID
  status          TEXT NOT NULL DEFAULT 'pending', -- pending|approved|rejected|cancelled|refunded
  amount          NUMERIC NOT NULL DEFAULT 0,
  fee_amount      NUMERIC DEFAULT 0,             -- application_fee cobrada
  payment_type    TEXT,                           -- pix|boleto|credit_card|debit_card
  payer_email     TEXT,
  webhook_data    JSONB,                         -- payload completo do webhook
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_transactions_order ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_external ON payment_transactions(external_id);
```

### 6.3 Colunas adicionais em orders

```sql
ALTER TABLE orders ADD COLUMN mp_preference_id TEXT;
ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'none';
-- payment_status: 'none' | 'pending' | 'paid' | 'failed' | 'refunded'
```

### 6.4 Atualizar RPC create_order_validated

- Aceitar novos valores de `payment_method`: `'mercado_pago'`, `'entrega'`
- Se `payment_method = 'entrega'` → status = `'pending_delivery_payment'`
- Se `payment_method = 'mercado_pago'` → status = `'pending_payment'`
- Se `payment_method = 'pix'` ou `'boleto'` (legado) → manter `'pending'`

---

## 7. Modelagem de Status do Pedido (Atualizada)

### Fluxo normal (PIX/Boleto via MP):
```
pending_payment → approved → preparing → shipped → delivered
                → rejected (pagamento falhou)
                → cancelled (cliente cancelou antes de pagar)
```

### Fluxo "Pagar na Entrega":
```
pending_delivery_payment → approved (admin marca pago) → preparing → shipped → delivered
                         → cancelled
```

### Fluxo legado (sem MP — atual):
```
pending → approved → preparing → shipped → delivered
        → rejected
        → cancelled
```

### Mapa visual:
```
                    ┌─ rejected
                    │
pending_payment ────┼─ approved ──→ preparing ──→ shipped ──→ delivered
                    │
                    └─ cancelled

                    ┌─ approved ──→ preparing ──→ shipped ──→ delivered
pending_delivery    │
_payment ───────────┤
                    └─ cancelled
```

---

## 8. Mudancas no Frontend

### 8.1 StepPayment — 3 opcoes

```
┌─────────────────────────────────┐
│ ○ PIX / Boleto (via Mercado Pago)│
│   Pagamento online seguro        │
│   (redirecionado para Mercado    │
│    Pago — aceita PIX e Boleto)   │
├─────────────────────────────────┤
│ ○ Pagar na Entrega              │
│   Dinheiro ou maquininha na      │
│   hora da entrega                │
└─────────────────────────────────┘
```

### 8.2 StepReview — condicional

- Se **MP**: botao "Ir para Pagamento" (redireciona para MP)
- Se **Entrega**: botao "Confirmar Pedido" (cria pedido direto)

### 8.3 Nova pagina: Retorno do MP

```
/checkout/retorno?status=approved&external_reference=ORDER_ID
```

- Consulta status do pedido
- Se approved → tela de sucesso (como StepSuccess atual)
- Se pending → tela "Aguardando confirmacao do pagamento"
- Se failure → tela "Pagamento nao aprovado" com botao de tentar novamente

### 8.4 OrderTimeline — novos status

- `pending_payment`: icone CreditCard + "Aguardando pagamento"
- `pending_delivery_payment`: icone Truck + "Pagamento na entrega"

### 8.5 OrderStatusBadge — novos status

```typescript
pending_payment:          { label: 'Aguardando Pagamento', color: 'yellow' }
pending_delivery_payment: { label: 'Pagar na Entrega',     color: 'orange' }
```

---

## 9. Seguranca

### 9.1 Validacao de Webhook
```javascript
// MP envia header: x-signature com formato ts=TIMESTAMP,v1=HASH
// HASH = HMAC-SHA256(secret, "id:[data.id];request-id:[x-request-id];ts:[timestamp];")
function validateWebhookSignature(headers, body, secret) {
  const xSignature = headers['x-signature']
  const xRequestId = headers['x-request-id']
  // parse ts e v1 do header
  // recalcular HMAC e comparar
}
```

### 9.2 Idempotencia
- Webhook do MP pode chegar duplicado
- Usar `external_id` (MP payment ID) como chave unica
- Se ja processado → retornar 200 sem reprocessar

### 9.3 Validacao de Valor
- Ao receber webhook, comparar `payment.transaction_amount` com `order.total`
- Se divergir → marcar como suspeito, nao aprovar automaticamente

### 9.4 RLS em payment_transactions
```sql
-- Usuarios so veem transacoes dos proprios pedidos
CREATE POLICY "Users can view own payment transactions"
  ON payment_transactions FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Apenas service_role insere (via Express backend)
-- Sem INSERT/UPDATE/DELETE policy para anon/authenticated
```

### 9.5 CSP — atualizar server.js
```javascript
// Adicionar ao connectSrc:
'https://api.mercadopago.com',
'https://www.mercadopago.com.br',

// Adicionar ao frameSrc (se usar Bricks no futuro):
'https://www.mercadopago.com.br',
```

---

## 10. Variaveis de Ambiente

### Servidor (Express / Vercel)
```env
MP_ACCESS_TOKEN=APP_USR-...               # Token da aplicacao marketplace (Jubileu)
MP_PUBLIC_KEY=APP_USR-...                  # Public key (para SDK frontend)
MP_COLLECTOR_ID=123456789                  # Seller ID do sacolao
MP_APPLICATION_FEE_PCT=3                   # Comissao Jubileu (%)
MP_WEBHOOK_SECRET=whsec_...               # Secret para validar webhooks
MP_ENVIRONMENT=production                  # production | sandbox
```

### Cliente (.env / Vite)
```env
VITE_MP_PUBLIC_KEY=APP_USR-...            # Apenas a public key (exposta)
```

---

## 11. Dependencias NPM

```bash
# Backend (server.js)
npm install mercadopago@2                  # SDK oficial MP v2

# Frontend (opcional — so se usar Bricks no futuro)
# npm install @mercadopago/sdk-react       # SDK React (nao necessario com Checkout Pro)
```

---

## 12. Plano de Implementacao (Tasks T6.2, T6.3, T6.4)

### T6.2 — Backend (~4h)
1. `npm install mercadopago` no servidor
2. Criar `src/server/mp-routes.js` com 3 endpoints
3. Criar `src/server/mp-service.js` com logica de negocio
4. Criar `src/server/mp-webhook-validator.js`
5. Migration: enum expansion + `payment_transactions` + colunas orders
6. Atualizar `create_order_validated` para novos payment_methods
7. Atualizar `server.js` para montar rotas `/api/mp/*`
8. Testar com sandbox MP

### T6.3 — Frontend Checkout (~3h)
1. Atualizar `StepPayment` com 3 opcoes
2. Atualizar `StepReview` com botoes condicionais
3. Criar pagina `/checkout/retorno` para callback do MP
4. Atualizar `checkout-store` com fluxo MP
5. Atualizar `OrderTimeline` e `OrderStatusBadge` com novos status
6. Atualizar tipos em `database.ts`

### T6.4 — Admin Filtros (~2h)
1. Adicionar filtro por `payment_status` na OrdersPage
2. Badges visuais para `payment_status`
3. Acao manual: marcar "pagar na entrega" como pago
4. Exibir detalhes de transacao MP no modal de pedido

---

## 13. Riscos e Mitigacoes

| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| Webhook nao chega (rede/timeout) | Pedido fica como pending_payment | Polling de fallback: consultar MP API a cada 5min para pedidos pending >30min |
| Cliente paga mas webhook falha | Cliente ve "aguardando" eternamente | Botao "Verificar pagamento" que consulta MP API diretamente |
| Split rejeitado pelo MP | Jubileu nao recebe comissao | Validar configuracao de marketplace antes de produzir; testar com sandbox |
| Valor divergente no webhook | Fraude ou bug | Comparar valores, bloquear pedido se divergir >1% |
| Sandbox vs Producao | Credenciais trocadas | Variavel `MP_ENVIRONMENT` controla; validar na inicializacao |

---

## 14. Perguntas Pendentes para o Gestor

| # | Pergunta | Impacto |
|---|----------|---------|
| P6.1 | Qual a % de comissao da Jubileu por transacao? | `MP_APPLICATION_FEE_PCT` |
| P6.2 | O sacolao ja tem conta Mercado Pago? | Precisa criar antes de T6.2 |
| P6.3 | Aceitar cartao de credito/debito ou apenas PIX+Boleto? | Muda configuracao de `excluded_payment_types` |
| P6.4 | Timeout do PIX (quanto tempo o QR fica valido)? | Default MP: 24h. Customizavel para 30min/1h |
| P6.5 | "Pagar na Entrega" e obrigatorio no MVP? | Adiciona complexidade no admin |
