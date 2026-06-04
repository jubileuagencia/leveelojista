# ADR: Integração MercadoPago — Arquitetura do Fluxo de Pagamento

**Número:** ADR-001
**Task:** LV-134
**Agente:** Aria (@architect)
**Data:** 2026-06-03
**Status:** Proposto — aguardando aprovação de Fernando Gleisson
**Contexto:** Épico de pagamento pós-separação (LV-133 a LV-148)
**Fonte de verdade upstream:** `docs/decisoes/fluxo-pagamento-pos-separacao.md`

---

## Contexto

O fluxo de pagamento pós-separação (LV-133) requer dois endpoints de API:

1. **`POST /api/payments/create-preference`** — cria uma preference no MercadoPago Checkout Pro e retorna o `init_point` para redirecionar o cliente.
2. **`POST /api/payments/webhook`** — recebe notificações de pagamento do MP, valida assinatura HMAC e atualiza o status do pedido no banco.

O app atual é uma **SPA React + Express estático** containerizada em Docker:

```
Dockerfile  →  build Vite → dist/
               server.js  → Express serve dist/, porta 3000
```

O `server.js` atual não possui rotas de API — serve apenas arquivos estáticos. Todo acesso ao banco passa pelo cliente Supabase no browser.

Não existem Supabase Edge Functions no projeto (`supabase/` contém apenas `migrations/` e `seed/`).

---

## Opções avaliadas

### Opção A — Rotas Express no `server.js` (recomendada)

Adicionar as rotas `/api/payments/*` diretamente no Express já existente.

**Stack:** Node.js 22 + MP SDK oficial (`mercadopago` npm) + `express.json()` middleware.

```
┌─────────────────────────────────────────────┐
│  Container Docker (Node 22)                 │
│                                             │
│  server.js (Express)                        │
│  ├── GET /*           → dist/ (SPA)         │
│  ├── POST /api/payments/create-preference   │
│  └── POST /api/payments/webhook             │
└─────────────────────────────────────────────┘
         ▲                   ▲
   Browser (SPA)     MercadoPago servers
```

**Vantagens:**
- Nenhuma infraestrutura nova — o container já existe e está em produção
- Node.js nativo: MP SDK funciona sem adaptações
- Mesma URL-base do frontend — sem CORS (same-origin)
- Env vars já gerenciadas no ambiente Docker/deploy
- Um único repo, um único build, um único deploy
- Webhook URL = `https://<domínio>/api/payments/webhook` — URL estável, mesmo domínio

**Desvantagens:**
- `server.js` passa a ter lógica de negócio (baixo impacto — arquivo pequeno e isolado)
- Precisa de `express.json()` e tratamento de erros de rota

---

### Opção B — Supabase Edge Functions (Deno)

Criar edge functions Supabase:
- `supabase/functions/create-preference/index.ts`
- `supabase/functions/mp-webhook/index.ts`

**Vantagens:**
- Acesso direto ao banco com service role (sem round-trip extra)
- Gerenciamento nativo de secrets (`supabase secrets set`)

**Desvantagens:**
- Deno runtime: o pacote `mercadopago` npm requer adaptação (`npm:mercadopago` ou REST direto)
- Novo paradigma no stack — equipe não usa Deno ainda
- Deployment separado: `supabase functions deploy` além do Docker
- Free tier Supabase tem limite de invocações de funções
- Cold starts adicionam latência ao `create-preference` (visível para o cliente)
- Webhook URL = `https://<project>.supabase.co/functions/v1/mp-webhook` — URL diferente do app

---

### Opção C — MP SDK vs REST API puro

Independente de onde rodam as rotas, a integração com MP pode ser feita via:

| | MP SDK (`mercadopago` npm) | REST API puro (`fetch`) |
|---|---|---|
| Autenticação | Automática via `MercadoPagoConfig` | Manual (header `Authorization: Bearer`) |
| `create-preference` | `new Preference(client).create({body})` | `POST https://api.mercadopago.com/checkout/preferences` |
| Tipos TypeScript | Incluídos no SDK | Manual |
| Erros | Classe `MPError` com detalhes | HTTP status + parse manual |
| Dependência | +1 package | zero |
| Compatibilidade | Node.js pleno | Universal (funciona em Deno/Edge também) |

Com a Opção A (Express/Node), o SDK é a escolha natural.

---

## Decisão

**Adotar a Opção A: rotas Express no `server.js` + MP SDK oficial.**

### Justificativa

1. **Zero infra nova.** O container Docker já existe. Adicionar 2 rotas ao Express é uma mudança cirúrgica de ~80 linhas.

2. **Node.js nativo.** O MP SDK funciona sem adaptações. Deno exigiria validação de compatibilidade e possivelmente fallback para REST puro — complexidade sem benefício real no contexto atual.

3. **Mesmo domínio.** `create-preference` é chamado pelo browser SPA via `fetch('/api/payments/create-preference')` — same-origin, sem CORS. O webhook MP chega na mesma URL do app.

4. **Secrets simples.** `MP_ACCESS_TOKEN` e `MP_WEBHOOK_SECRET` ficam como variáveis de ambiente do container — mesmo mecanismo que `SUPABASE_SERVICE_ROLE_KEY`.

5. **Supabase Edge Functions** ficariam isoladas num deployment separado sem ganho real: a única vantagem (acesso direto ao DB) é anulada pelo fato de que a rota Express pode usar o Supabase client com service role key da mesma forma.

---

## Arquitetura detalhada

### Fluxo `create-preference`

```
Browser (PaymentPage)
  │
  │  POST /api/payments/create-preference
  │  body: { orderId: string }
  │  header: Authorization: Bearer <supabase_jwt>
  │
  ▼
Express route (server.js)
  │
  ├── 1. Valida JWT (Supabase Auth)
  ├── 2. Busca order no DB (Supabase service role)
  │      Verifica: order.user_id === jwt.sub
  │      Verifica: order.status === 'awaiting_payment'
  ├── 3. Monta items[] a partir de order_items
  ├── 4. Chama MP SDK: new Preference(mpClient).create({body: { items, back_urls, notification_url }})
  ├── 5. Salva mp_preference_id em orders
  └── 6. Retorna { init_point }

Browser
  └── window.location.href = init_point  (redirect para MP Checkout Pro)
```

### Fluxo `webhook`

```
MercadoPago servers
  │
  │  POST /api/payments/webhook
  │  header: x-signature: ts=...,v1=...
  │  body: { action: "payment.updated", data: { id: "..." } }
  │
  ▼
Express route (server.js)
  │
  ├── 1. Valida HMAC (x-signature) com MP_WEBHOOK_SECRET
  │      → 401 se inválido
  ├── 2. Ignora eventos que não sejam payment.approved / payment.authorized
  ├── 3. Busca payment no MP: GET https://api.mercadopago.com/v1/payments/{id}
  ├── 4. Extrai mp_payment_id, external_reference (= orderId)
  ├── 5. Check idempotência: SELECT 1 FROM orders WHERE mp_payment_id = $1
  │      → 200 (no-op) se já processado
  ├── 6. UPDATE orders SET status='approved', mp_payment_id=$1, paid_at=NOW()
  │      WHERE id=$2 AND status='awaiting_payment'
  └── 7. Retorna 200 OK

MercadoPago → retry automático se não receber 2xx em 5s
```

### Diagrama de estados impactado

```
awaiting_payment
    │
    ├── POST /api/payments/webhook (payment.approved)
    │         └── status = approved, mp_payment_id = X, paid_at = now()
    │
    └── PATCH /pedido/:id (pagar na entrega — sem MP)
              └── status = approved, payment_method = cartao_entrega|dinheiro_entrega
```

---

## Mudanças em `server.js`

O arquivo recebe as seguintes adições (sem alterar o comportamento estático atual):

```javascript
// Dependências novas (npm install mercadopago)
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

// Middleware
app.use('/api', express.json())

// MP client (singleton)
const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })

// Supabase service role (para validar JWT + atualizar DB)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Rotas
app.post('/api/payments/create-preference', createPreferenceHandler)
app.post('/api/payments/webhook', webhookHandler)
```

Implementações completas de `createPreferenceHandler` e `webhookHandler` serão produzidas em **LV-135** e **LV-136** respectivamente.

---

## Variáveis de ambiente

### Server-side (container Docker / secrets do deploy)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `MP_ACCESS_TOKEN` | ✅ | Token de acesso MP (sandbox: `TEST-...`; prod: `APP_USR-...`) |
| `MP_WEBHOOK_SECRET` | ✅ | Secret para validação HMAC da assinatura do webhook |
| `SUPABASE_URL` | ✅ | URL do projeto Supabase (já existe no container?) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key — acesso admin ao DB |

> **Atenção:** `MP_ACCESS_TOKEN` e `SUPABASE_SERVICE_ROLE_KEY` são secrets de alto privilégio. NUNCA expor em `VITE_*` ou em logs.

### Frontend (prefixo `VITE_`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_MP_PUBLIC_KEY` | ⬜ Opcional | MP Public Key — necessária apenas se usar MP SDK no browser (Brick de cartão). Para Checkout Pro (redirect), não é necessário no frontend. |

> **Decisão:** LV-135 usa **MP Checkout Pro** (redirect completo para página MP). Não é necessária integração do SDK no browser para v1. `VITE_MP_PUBLIC_KEY` fica reservado para uma futura integração de Brick de cartão sem redirect.

### Configuração de callback URLs no MP

Ao criar a preference (`create-preference`), as `back_urls` e `notification_url` devem usar a URL base do app:

```javascript
back_urls: {
  success: `${process.env.APP_BASE_URL}/pedido/${orderId}?payment=success`,
  failure: `${process.env.APP_BASE_URL}/pedido/${orderId}?payment=failure`,
  pending: `${process.env.APP_BASE_URL}/pedido/${orderId}?payment=pending`,
},
notification_url: `${process.env.APP_BASE_URL}/api/payments/webhook`,
auto_return: 'approved',
```

| Variável | Descrição |
|---|---|
| `APP_BASE_URL` | URL pública do app (ex: `https://app.leveehortiplus.com.br`) |

---

## Testes e sandbox

- Usar credenciais MP de **sandbox** (`TEST-...`) em dev e staging
- Testar webhook localmente via [ngrok](https://ngrok.com/) ou [smee.io](https://smee.io/)
  - Exemplo: `ngrok http 3000` → usar `https://xxxx.ngrok.io/api/payments/webhook` como `notification_url`
- Validar idempotência: disparar o mesmo `payment_id` duas vezes → segunda chamada deve retornar 200 sem update
- Validar HMAC: enviar webhook com assinatura inválida → deve retornar 401

---

## Checklist de aceitação (LV-134)

- [x] Decisão documentada: **rotas Express + MP SDK**
- [x] Arquitetura de `create-preference` documentada (inputs, validações, outputs)
- [x] Arquitetura de `webhook` documentada (validação HMAC, idempotência, update)
- [x] Impacto em `server.js` mapeado (mudanças mínimas identificadas)
- [x] Variáveis de ambiente listadas (server-side vs frontend)
- [x] Decisão sobre `VITE_MP_PUBLIC_KEY` (desnecessária em v1)
- [x] Estratégia de sandbox/teste documentada
- [ ] Aprovação de Fernando Gleisson

---

## Consequências e riscos

| Risco | Mitigação |
|---|---|
| `server.js` acumula lógica de negócio ao longo do tempo | Manter rotas `/api/**` em arquivos separados (`routes/payments.js`) importados no `server.js` — separação clara desde LV-135 |
| MP_ACCESS_TOKEN vazado em log | Garantir que handlers MP nunca loguem o config object completo |
| Webhook MP recebendo requests de terceiros | Validação HMAC obrigatória — rejeitar todo request sem assinatura válida |
| Downtime do Express = downtime do webhook | Tolerável no estágio atual (v1); se tornar crítico, mover webhook para edge function futuramente |
| Supabase service role key no container | Já é prática do projeto (cliente Supabase server-side); risco existente, não novo |

---

## Próximos passos (pós-aprovação)

| Task | Dono | O que fazer |
|---|---|---|
| **LV-135** | @dev | Implementar `create-preference` handler + `PaymentPage` frontend + integração MP Checkout Pro |
| **LV-136** | @dev | Implementar `webhook` handler com validação HMAC + idempotência + update de status |

---

## Referências

- [MercadoPago Checkout Pro — Docs](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing)
- [MP Webhooks — Validação de assinatura](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
- `docs/decisoes/fluxo-pagamento-pos-separacao.md` §5.7 — spec do endpoint create-preference
- `docs/plano-execucao-fluxo-pagamento-pos-separacao.md` — mapa de dependências
- `server.js` — Express atual (só estático)
- `package.json` — dependências atuais (sem `mercadopago` ainda)
