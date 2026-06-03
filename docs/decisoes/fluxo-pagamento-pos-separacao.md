# Decisão — Fluxo de Pagamento Pós-Separação

**Projeto:** novob2b (Levee)
**Autor:** Orion (AIOS Master) — facilitação; decisões: Fernando Gleisson
**Data:** 2026-05-15
**Status:** Aprovado — pronto para handoff (UX + DEV)
**Tarefas relacionadas:**
- **LV-133** — UX: wireframes (Uma)
- DEV (a definir) — schema migration + admin separation modal + customer payment route + email
- **QA** — validação end-to-end do novo fluxo

> Este doc é a **fonte da verdade** para o fluxo de pagamento pós-separação. UX (`docs/ux-specs/LV-133-*`) e Dev derivam dele. Qualquer mudança aqui invalida wireframes/código downstream — abrir nova rodada de decisão antes.

---

## 1. Motivação

O modelo atual de checkout é **pagamento upfront**: cliente paga antes da loja preparar. Isso não funciona para B2B sacolão (Levee Hortiplus) porque:

- **Peso variável:** produtos kg (banana, manga, alface) têm peso real diferente do pedido (cliente pede 1kg, loja separa 1.2kg do pacote inteiro)
- **Estoque dinâmico:** o que está na arara muda ao longo do dia — loja pode não ter o item exato quando vai separar
- **Substituições:** lojista B2B aceita substituições ("não tem manga rosa, tem palmer — leva?")
- **Confiança B2B:** lojista quer ver o valor final antes de pagar; não quer "estorno" se loja entregar menos

A solução é **inverter a ordem**: cliente faz pedido sem pagar, loja separa fisicamente, sistema notifica cliente com valor final ajustado, cliente paga.

## 2. Decisões aprovadas (resumo executivo)

| # | Decisão | Valor |
|---|---|---|
| 1 | OrderStatus enum | **Manter `approved`** + adicionar `separating`, `awaiting_payment`. `approved` ganha semântica "pago e aprovado para preparo". |
| 2 | Edição na separação | Admin pode: ajustar qty/peso (±), remover item, adicionar item novo (substituição), adicionar anotação livre. Tudo audit-logado. |
| 3 | Pagamento — método | **Mercado Pago Checkout Pro** (PIX + Boleto + Cartão online) **OU** "pagar na entrega" (máquina de cartão presencial). Cliente escolhe APÓS separação, na tela de pagamento. |
| 4 | Prazo de pagamento | **Sem prazo automático.** Pedido fica `awaiting_payment` indefinidamente. Loja cancela manualmente quando perceber que cliente desistiu. |
| 5 | Snapshot de preço | Preço usado na fatura final = **preço do momento do pedido** (`order_items.unit_price` já salvo no checkout). Se preço mudar entre pedido e separação, cliente paga o que viu. |
| 6 | Notificação cliente | **Email transacional** (canal principal) + **badge in-app** (visual). Push web fica para v2. WhatsApp não considerado (Evolution API deprecated). |
| 7 | Email — infraestrutura | **Tarefa separada** (provider, edge function, env vars). Este doc define só o **conteúdo/escopo** do email; a infra é responsabilidade de outra story. |
| 8 | "Pagar na entrega" — fluxo | Cliente escolhe na tela `/pedido/:id/pagamento`. Se entrega, status vira `approved` direto; loja confirma o pagamento presencial marcando manualmente como `paid` ao receber. |

## 3. Visão geral do fluxo

### 3.1 Diagrama de estados

```
pending
   │
   │ (loja inicia separação no admin)
   ▼
separating ──────────────► cancelled
   │                         ▲
   │ (loja finaliza separação)
   ▼                         │
awaiting_payment ────────────┤
   │                         │
   ├──► (cliente paga online via MP)
   │                         │
   │                         │
   ├──► (cliente escolhe pagar na entrega)
   │                         │
   ▼                         │
approved ────────────────────┤
   │
   │ (loja confirma pagamento — automatico via webhook MP, ou manual no admin se foi na entrega)
   ▼
preparing ────────────────► rejected
   │
   │ (loja despacha)
   ▼
shipped
   │
   │ (entrega ao cliente; loja marca como entregue + confirma pagamento presencial se aplicavel)
   ▼
delivered
```

> **Nota:** `rejected` permanece para o caso da loja recusar o pedido por outros motivos (cliente bloqueado, fraude detectada, etc.). `cancelled` é estado terminal acionado por cliente OU loja em qualquer ponto antes de `shipped`.

### 3.2 Sequence diagram (caso feliz — pagamento online)

```
Cliente            App                Supabase           Admin (loja)        Mercado Pago        Email Provider
   │                │                    │                    │                   │                   │
   │── faz pedido ──▶                    │                    │                   │                   │
   │                │── INSERT order ────▶                    │                   │                   │
   │                │   status=pending   │                    │                   │                   │
   │                ◀── ok ──────────────│                    │                   │                   │
   │◀── confirmacao ─                    │                    │                   │                   │
   │                                     │                    │                   │                   │
   │                                     │   (loja entra no admin)               │                   │
   │                                     │                    │── GET /admin/pedidos                  │
   │                                     ◀────────────────────│                   │                   │
   │                                     │── lista pending ──▶│                   │                   │
   │                                     │                    │                   │                   │
   │                                     │                    │── abre modal de separacao            │
   │                                     │                    │                   │                   │
   │                                     │                    │── ajusta qty/peso, marca separado    │
   │                                     │                    │── INSERT audit logs                  │
   │                                     ◀────────────────────│                   │                   │
   │                                     │── UPDATE order ───▶                    │                   │
   │                                     │   status=awaiting_payment              │                   │
   │                                     │   total ajustado   │                   │                   │
   │                                     │                    │                   │                   │
   │                                     │── trigger email ───────────────────────────────────────────▶
   │                                     │                    │                   │                   │── envia email ─▶ cliente
   │                                     │                                                            │
   │◀── recebe email "Pedido #N separado, R$ X" ──                                                    │
   │                                     │                                                            │
   │── clica link /pedido/:id/pagamento                                                               │
   │                │                    │                    │                   │                   │
   │                │── GET order ───────▶                    │                   │                   │
   │                ◀── breakdown ───────│                    │                   │                   │
   │◀── ve breakdown + 2 botoes (MP / entrega) ──             │                   │                   │
   │                                                                              │                   │
   │── clica "Pagar agora (MP)" ─▶                                                │                   │
   │                │── POST /api/payments/create-preference ─▶                   │                   │
   │                │                    │── chama MP SDK ────────────────────────▶                   │
   │                │                    ◀── preference_id, init_point ──────────│                   │
   │                ◀── redirect_url ────│                                        │                   │
   │◀── redirect para MP Checkout Pro ──                                          │                   │
   │                                                                              │                   │
   │── paga (PIX/boleto/cartao) ──────────────────────────────────────────────────▶                   │
   │                                     ◀── webhook payment.approved ───────────│                   │
   │                                     │── UPDATE order ───▶                    │                   │
   │                                     │   status=approved, mp_payment_id=X,    │                   │
   │                                     │   paid_at=now()    │                   │                   │
   │◀── redirect back to /pedido/:id (com toast success)                          │                   │
   │                                                                              │                   │
   │                                     │   (loja prepara, despacha, entrega)   │                   │
   │                                     │── UPDATE order ───◀── admin actions ──│                   │
   │                                     │   preparing -> shipped -> delivered    │                   │
```

### 3.3 Sequence diagram (caso pagar-na-entrega)

```
Cliente            App                Supabase           Admin (loja)
   │                │                    │                    │
   │ ... pedido, separacao, email (igual ao caso online) ... │
   │                                                          │
   │── clica "Pagar na entrega" ─▶                            │
   │                │── UPDATE order ────▶                    │
   │                │   status=approved  │                    │
   │                │   payment_method=cartao_entrega         │
   │                ◀── ok ──────────────│                    │
   │◀── confirmacao "Pedido aprovado para preparo" ──         │
   │                                                          │
   │                                     │   (loja prepara e despacha)
   │                                     │                    │── status: approved -> preparing -> shipped
   │                                     │                    │
   │                                     │   (entregador chega na loja do cliente)
   │── paga presencialmente (maquina cartao) ─▶ (ENTREGADOR)  │
   │                                     │                    │
   │                                     │   (entregador volta, marca recebido)
   │                                     │                    │── marca: shipped -> delivered
   │                                     │                    │              + paid_at=now()
```

## 4. Modelo de dados — mudanças necessárias

### 4.1 Tabela `orders` — campos novos

```sql
-- Migration 020_payment_after_separation.sql (proposta)

ALTER TABLE orders ADD COLUMN separated_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN separated_by UUID REFERENCES auth.users(id);
ALTER TABLE orders ADD COLUMN paid_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN mp_payment_id TEXT;       -- id do pagamento no Mercado Pago (quando online)
ALTER TABLE orders ADD COLUMN mp_preference_id TEXT;    -- preference_id do MP Checkout Pro
ALTER TABLE orders ADD COLUMN original_subtotal NUMERIC; -- snapshot do subtotal antes da separacao
ALTER TABLE orders ADD COLUMN original_total NUMERIC;    -- snapshot do total antes da separacao
ALTER TABLE orders ADD COLUMN separation_notes TEXT;     -- nota geral da loja sobre a separacao (opcional)
ALTER TABLE orders ADD COLUMN delivery_change_for NUMERIC(12,2) NULL;
  -- troco solicitado pelo cliente; preenchido apenas quando payment_method='dinheiro_entrega' + cliente pediu troco
  -- null = pagamento exato ou nao-dinheiro
  -- CONSTRAINT enforced no app: delivery_change_for > total

-- payment_method passa a aceitar: 'pix' | 'boleto' | 'cartao_online' | 'cartao_entrega' | 'dinheiro_entrega' | null
-- Adicionar valores ao enum payment_method
```

> **Migration de pedidos legados:** todos os pedidos com `status='approved'` recebem `paid_at = created_at` (assumindo pagamento upfront foi feito no momento do pedido). Pedidos `status='pending'` ficam como estão.

### 4.2 Tabela `order_items` — campos novos

```sql
ALTER TABLE order_items ADD COLUMN original_quantity NUMERIC;        -- qty pedida pelo cliente
ALTER TABLE order_items ADD COLUMN original_total_price NUMERIC;     -- total da linha pre-separacao
ALTER TABLE order_items ADD COLUMN separation_status TEXT DEFAULT 'pending';
  -- valores: 'pending' | 'separated' | 'removed' | 'added' | 'substituted'
ALTER TABLE order_items ADD COLUMN separation_note TEXT;             -- nota livre do separador para este item
ALTER TABLE order_items ADD COLUMN substituted_from_item_id UUID REFERENCES order_items(id);
  -- se este item foi adicionado como substituicao de outro, aponta para o original
```

### 4.3 Nova tabela `order_separation_audit`

```sql
CREATE TABLE order_separation_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE, -- null para audit no nivel do pedido
  action TEXT NOT NULL,
    -- valores: 'separation_started' | 'qty_changed' | 'item_removed' | 'item_added'
    --        | 'item_substituted' | 'note_added' | 'separation_completed'
    --        | 'separation_reverted' (caso loja queira desfazer)
  user_id UUID NOT NULL REFERENCES auth.users(id),
  payload JSONB NOT NULL, -- {before: {...}, after: {...}, reason: '...'}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_separation_audit_order ON order_separation_audit(order_id);
CREATE INDEX idx_separation_audit_user ON order_separation_audit(user_id);
```

### 4.4 OrderStatus enum (atualização)

```typescript
// Antes (src/types/database.ts:4)
export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'rejected'
  | 'cancelled'

// Depois — adicionar 2 valores
export type OrderStatus =
  | 'pending'            // pedido criado, loja ainda não recebeu
  | 'separating'         // ← NOVO — loja está separando agora
  | 'awaiting_payment'   // ← NOVO — separado, aguardando cliente pagar
  | 'approved'           // pago e aprovado para preparo (online ou na-entrega-confirmado-pela-loja)
  | 'preparing'          // preparando para envio
  | 'shipped'            // despachado
  | 'delivered'          // entregue
  | 'rejected'           // recusado pela loja
  | 'cancelled'          // cancelado (cliente ou loja)
```

### 4.5 PaymentMethod enum (atualização)

```typescript
// Antes
export type PaymentMethod = 'pix' | 'boleto'

// Depois
export type PaymentMethod =
  | 'pix'
  | 'boleto'
  | 'cartao_online'      // cartao via MP Checkout Pro
  | 'cartao_entrega'     // maquina de cartao presencial (debito ou credito — cliente escolhe na maquina)
  | 'dinheiro_entrega'   // dinheiro na entrega (com ou sem troco)
  | null                 // ainda nao escolhido (status=pending|separating|awaiting_payment)
```

> **Decisão 2026-06-03 (rodada 2):** `cartao_entrega` permanece único (sem separar débito/crédito no sistema — distinção fica no POS físico). `dinheiro_entrega` é separado porque impacta logística (troco). Ver campo `delivery_change_for` em §4.1.

## 5. Fluxo detalhado por etapa

### 5.1 Etapa 1 — Cliente faz pedido (sem pagamento)

**Mudança no checkout atual:**
- Tela `StepReview` (`src/features/checkout/components/StepReview.tsx`) **NÃO** pede método de pagamento mais.
- `StepPayment` (`src/features/checkout/components/StepPayment.tsx`) é **removido do fluxo** ou simplificado para apenas informativo ("Você pagará após a separação dos itens").
- `submitOrder` cria order com `status='pending'`, `payment_method=null`.

**Aceitação:**
- [ ] Checkout não solicita PIX/boleto antes do submit
- [ ] Cliente é avisado que pagará depois (mensagem clara na confirmação)
- [ ] Toast/tela de sucesso explica próximo passo: "Aguarde a loja separar seu pedido"

### 5.2 Etapa 2 — Loja recebe (Admin: lista de pedidos)

**Mudança em `OrdersPage` (admin):**
- Aba "Aguardando separação" (filtro `status='pending'`) em destaque
- Aba "Em separação" (`status='separating'`)
- Aba "Aguardando pagamento" (`status='awaiting_payment'`) — aqui a loja pode cancelar manualmente se cliente desistir

**Aceitação:**
- [ ] Pedidos `pending` aparecem em destaque (badge ou ordenação)
- [ ] Filtros por status aplicam corretamente
- [ ] Click no pedido abre modal de separação (próxima etapa)

### 5.3 Etapa 3 — Loja separa (Modal de separação no admin)

**Componente novo:** `src/features/admin/components/OrderSeparationModal.tsx`

**Funcionalidades obrigatórias:**

1. **Header:** número do pedido + cliente + endereço de entrega
2. **Lista de itens:** cada item exibe:
   - Foto + nome + variante
   - Qty pedida (read-only, riscada se modificada)
   - Stepper de **qty separada** (editável; passo 0.1 para kg, 1 para inteiros)
   - Preço unitário (read-only — snapshot do pedido)
   - Total da linha (calculado: `qty_separada × unit_price`)
   - Botão "Remover" (vermelho, com confirmação)
   - Campo "Anotação" (opcional, texto livre)
3. **Botão "Adicionar item":** abre seletor de produto (busca + variantes) para inserir item novo na separação (caso de substituição)
4. **Painel de audit (lateral ou collapse):** lista cronológica de mudanças desta separação ("Qty de banana de 1kg para 1.2kg por loja@user às 14:32")
5. **Footer:**
   - Subtotal original vs ajustado (mostrar diff em verde/vermelho)
   - Botão "Marcar como separado" → muda status para `awaiting_payment`, persiste `separated_at`, dispara email/notificação
   - Botão "Salvar rascunho" → mantém `status='separating'`, persiste mudanças sem finalizar

**Comportamento:**
- Ao abrir modal pela primeira vez: status `pending` → `separating`, registra audit `separation_started`
- Cada mudança (qty, remoção, adição, nota) → registra audit
- Ao "Marcar como separado": status `separating` → `awaiting_payment`, recalcula `total` e `subtotal`, mantém `original_subtotal`/`original_total`, dispara webhook/trigger de email

**Aceitação:**
- [ ] Stepper respeita step 0.1 para fracionários (usar `FRACTIONAL_STEP` do `use-cart-item-controller`)
- [ ] Audit registra TODAS as mudanças com timestamp + user
- [ ] Não é possível "Marcar como separado" se algum item ainda está `separation_status='pending'` (todos devem ser confirmados ou removidos)
- [ ] Total recalculado em tempo real (otimista)
- [ ] Modal fechado sem finalizar mantém rascunho (`status='separating'`)

### 5.4 Etapa 4 — Loja finaliza separação (trigger)

Quando admin clica "Marcar como separado":

1. **Backend (RPC ou edge function `finalize_separation`):**
   - Valida que todos os itens têm `separation_status != 'pending'`
   - Calcula `original_subtotal` e `original_total` se ainda não preenchidos (snapshot)
   - Recalcula `subtotal` e `total` com base nos itens atuais
   - Atualiza `orders.status = 'awaiting_payment'`, `separated_at = NOW()`, `separated_by = auth.uid()`
   - Insere audit `separation_completed`
   - **Dispara email** (via trigger de DB OU chamada explícita para edge function — ver §7)
   - Retorna a order atualizada

**Aceitação:**
- [ ] Operação atômica (transaction)
- [ ] Se email falhar, NÃO reverte status (email é fire-and-forget; pode reenviar)
- [ ] Idempotente: chamar 2x na mesma order = mesmo resultado

### 5.5 Etapa 5 — Cliente recebe notificação

Ver §7 (Email) e §8 (Badge in-app).

### 5.6 Etapa 6 — Cliente acessa pagamento

**Rota nova:** `/pedido/:id/pagamento`

**Acesso:**
- Cliente precisa estar autenticado (`auth.user.id === order.user_id`)
- Order deve estar em `status='awaiting_payment'`
- Outros status: redirect para `/pedido/:id` (detalhe) com toast informativo

**Conteúdo da tela:**

1. **Header:** "Pedido #N — Pronto para pagamento"
2. **Breakdown item por item:**
   - Cada item: foto + nome + variante
   - Qty original (riscada se diferente) → qty separada (em destaque)
   - Anotação da loja (se houver)
   - Preço unitário + total da linha
3. **Resumo financeiro:**
   - Subtotal original (riscado se ajustado)
   - Subtotal ajustado
   - Desconto (se houver)
   - **Total a pagar** (em destaque)
4. **2 opções de pagamento:**
   - **Botão "Pagar agora (PIX, Boleto ou Cartão)"** → redireciona para MP Checkout Pro
   - **Botão "Pagar na entrega (máquina de cartão)"** → modal de confirmação, depois atualiza `status='approved'`, `payment_method='cartao_entrega'`
5. **Link "Cancelar pedido"** (terciário, com confirmação) → `status='cancelled'`

**Aceitação:**
- [ ] Cliente que não é dono do pedido recebe 403/404
- [ ] Status diferente de `awaiting_payment` redireciona
- [ ] Breakdown mostra qty original vs separada para itens modificados
- [ ] Mercado Pago retorna para `/pedido/:id` após pagamento (sucesso ou falha)

### 5.7 Etapa 7a — Pagamento online (Mercado Pago)

**Implementação:**
- API route `/api/payments/create-preference` (provavelmente edge function Supabase ou rota custom no `server.js` Express)
- Cria `preference` no MP com items e callback URLs
- Cliente é redirecionado para `init_point` do MP
- MP webhook em `/api/payments/webhook` recebe notificações e atualiza `orders.status='approved'`, `mp_payment_id`, `paid_at`

**Variáveis de ambiente necessárias (a configurar):**
- `MP_ACCESS_TOKEN`
- `MP_WEBHOOK_SECRET`
- `MP_PUBLIC_KEY` (frontend)

**Aceitação:**
- [ ] Webhook valida assinatura HMAC
- [ ] Idempotente (mesmo `mp_payment_id` processado 2x = no-op)
- [ ] Falha de pagamento mantém `status='awaiting_payment'` (não cancela)

### 5.8 Etapa 7b — "Pagar na entrega"

Cliente clica "Pagar na entrega" → abre modal/sheet com 2 steps:

**Step 1 — Escolher forma:**
- Opção A: Cartão (débito ou crédito — cliente escolhe na maquininha)
- Opção B: Dinheiro
- RadioGroup sem default; botão "Continuar" desabilitado até seleção

**Step 2 — Troco (só se Dinheiro):**
- Pergunta: "Vai precisar de troco?"
- Checkbox/toggle Sim / Não (sem default)
- Se Sim → input de valor aparece: "Troco para quanto?" (mask moeda BR)
  - Validação: valor informado deve ser **maior que o total do pedido**
  - Erro inline se valor ≤ total: "O valor deve ser maior que R$ {total}"
  - Botão "Confirmar" desabilitado até valor válido
- Se Não → confirma direto sem campo adicional
- Se Cartão (Step 1A) → pula Step 2, confirma direto

**Confirma → UPDATE order:**
- `status='approved'`
- `payment_method='cartao_entrega'` ou `'dinheiro_entrega'`
- `delivery_change_for = valor_informado` (só se dinheiro + pediu troco; caso contrário `null`)

Cliente vê toast: "Pedido aprovado! Pagamento na entrega." + redirect para `/pedido/:id`.

Loja prepara/despacha normalmente. Quando admin marca `delivered`, a UI pergunta "Pagamento foi recebido?" — se sim, registra `paid_at=NOW()`.

**Aceitação:**
- [ ] `cartao_entrega` e `dinheiro_entrega` não chamam MP
- [ ] Status fica `approved` sem `paid_at` (será preenchido em `delivered`)
- [ ] Input de troco valida `> total` com erro inline claro
- [ ] `delivery_change_for` persistido quando dinheiro + pediu troco
- [ ] Admin tem indicador visual de pedidos "pagar na entrega" pendentes de confirmação

## 6. Regras de negócio

### 6.1 Edição de itens na separação

| Ação | Permitida | Audit |
|---|---|---|
| Reduzir qty | ✅ | `qty_changed` (before/after) |
| Aumentar qty | ✅ | `qty_changed` (before/after) |
| Remover item completo | ✅ | `item_removed` (snapshot do item) |
| Adicionar item novo (substituição) | ✅ | `item_added` (novo item + opcional `substituted_from_item_id`) |
| Editar `unit_price` | ❌ (snapshot do pedido é imutável) | — |
| Adicionar anotação livre | ✅ | `note_added` |

### 6.2 Snapshot de preço

`order_items.unit_price` é **imutável** após o pedido. Loja não pode alterar preço. Se preço do produto mudou entre pedido e separação, cliente paga o preço antigo.

**Exceção (futuro, não escopo v1):** loja pode "renegociar" preço em casos excepcionais com nota obrigatória de motivo. Audit registra. Por enquanto, não permitir.

### 6.3 Total mínimo / pedido vazio

Se loja remover todos os itens durante a separação (caso de loja sem estoque do único item pedido):
- Loja **pode** finalizar a separação mesmo com pedido vazio OU pode cancelar o pedido manualmente (acessando `OrdersPage` admin → "Cancelar com motivo")
- Sistema **não força** bloqueio — é decisão operacional da loja
- Audit registra `item_removed` para cada item; se cancelada, adiciona evento `order_cancelled` com motivo
- Cliente vê o breakdown completo (com indicação de itens removidos) e pode cancelar do lado dele também

### 6.4 Cancelamento

| Quem | Quando | Estado final |
|---|---|---|
| Cliente | Em `pending` ou `awaiting_payment` | `cancelled` |
| Cliente | Em `separating` | **Bloqueado** — exibe "Loja já está separando, fale com a loja para cancelar" |
| Cliente | Após `approved` | **Bloqueado** — pedido em preparo |
| Loja | Qualquer momento antes de `shipped` | `cancelled` ou `rejected` (com motivo) |

### 6.5 Recálculo de descontos

Se cliente tinha desconto por volume (tier B2B) e a separação reduziu o subtotal abaixo do tier:
- **v1:** mantém o desconto original (lojista já tinha o "direito")
- **v2 (futuro):** recalcular tier com base no subtotal final

### 6.6 Recálculo de frete

- Frete (se houver) é calculado no checkout e fica imutável
- Se a separação remover itens e o pedido ficar abaixo do mínimo de frete grátis, **mantém** a condição original
- Frete não é alterado durante a separação

## 7. Email transacional — escopo de conteúdo

> **Importante:** este doc define **o conteúdo** do email (assunto, layout, variáveis). A **infraestrutura de envio** (provider, edge function, env vars, retry, deliverability) é **escopo de outra story**, ainda a definir.

### 7.1 Assunto

```
✅ Pedido #{order_number} separado — R$ {total} para finalizar
```

**Exemplo:**
```
✅ Pedido #1042 separado — R$ 87,30 para finalizar
```

### 7.2 Pré-header (preview text)

```
Sua loja separou os itens. Confira o ajuste de peso/quantidade e finalize o pagamento online ou na entrega.
```

### 7.3 Layout HTML (estrutura)

```
┌──────────────────────────────────────────────────────┐
│  [Logo Levee]                                        │
│                                                      │
│  Olá, {customer_name}! 👋                            │
│                                                      │
│  Sua loja separou o pedido #{order_number}.          │
│  Pronto para finalizar o pagamento.                  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ {item_image}  Banana Prata 1kg                 │  │
│  │               Pedido: 1kg → Separado: 1,2kg    │  │
│  │               R$ 4,99/kg × 1,2 = R$ 5,99       │  │
│  │               [Anotação se houver]             │  │
│  ├────────────────────────────────────────────────┤  │
│  │ {item_image}  Manga Palmer 500g                │  │
│  │               Pedido: 500g → Separado: 500g    │  │
│  │               R$ 8,00/kg × 0,5 = R$ 4,00       │  │
│  ├────────────────────────────────────────────────┤  │
│  │ ⚠ Tomate Cereja — REMOVIDO                    │  │
│  │   Motivo: "Sem estoque no momento"             │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Subtotal original:  R$ 92,30                        │
│  Subtotal ajustado:  R$ 87,30                        │
│  Diferença:          -R$ 5,00 (em seu favor)         │
│  ─────────────────────────────                       │
│  Total a pagar:      R$ 87,30                        │
│                                                      │
│           [ 💳 Finalizar pagamento ]                 │
│                                                      │
│  Você pode escolher pagar online (PIX, boleto,       │
│  cartão) ou pagar na entrega com a máquina.          │
│                                                      │
│  Dúvidas? Responda este email ou ligue {phone}.      │
│                                                      │
│  ──────────────────────────────────                  │
│  Levee Hortiplus                                     │
│  {address}                                           │
└──────────────────────────────────────────────────────┘
```

### 7.4 Variáveis dinâmicas

```
{customer_name}        — Profile.full_name ou email
{order_number}         — Order.order_number
{items}                — array de OrderItem com:
  - product_image_url
  - product_name + variant_label
  - original_quantity + unit
  - quantity (final) + unit
  - separation_status (separated|removed|added)
  - separation_note
  - unit_price
  - total_price (final)
{original_subtotal}    — Order.original_subtotal
{subtotal}             — Order.subtotal (ajustado)
{discount}             — Order.discount
{total}                — Order.total (final)
{difference}           — original_subtotal - subtotal (positivo = cliente paga menos)
{payment_url}          — /pedido/{id}/pagamento (com base URL)
{store_phone}          — Config.store_phone
{store_address}        — Config.store_address
```

### 7.5 CTA principal

Botão único e claro: **"Finalizar pagamento"** → link para `/pedido/{id}/pagamento`

NÃO incluir botões separados para "Pagar online" vs "Pagar na entrega" no email (escolha fica na tela). Mantém o email simples.

### 7.6 Responsividade

- Mobile-first (B2B usa muito celular durante rota)
- Largura máxima 600px
- Imagens com fallback (broken image gracioso)
- Texto preto/escuro sobre fundo claro (evita filtros de spam)
- Sem JavaScript / sem fontes custom (compat com Gmail/Outlook)

### 7.7 Quando NÃO enviar email

- Pedido foi cancelado durante separação (status terminou em `cancelled`)
- Email do cliente está bouncing (registrar mas não tentar de novo)
- Pedido já foi pago (re-finalização — não deveria acontecer, mas guard)

## 8. Notificação in-app (badge)

**Componente:** badge vermelho no ícone "Pedidos" da `BottomNav` / `Header`

**Lógica:**
- Conta pedidos com `status='awaiting_payment'` para o user logado
- Badge aparece se count > 0
- Click leva para `OrdersPage` filtrada por `awaiting_payment`
- Cada pedido na lista tem CTA "Pagar" em destaque

**Aceitação:**
- [ ] Count atualiza em tempo real ao ouvir mudanças do cart-store / orders subscription (Supabase realtime)
- [ ] Badge some quando todos os pedidos foram pagos ou expiraram
- [ ] Acessível: `aria-label="{N} pedidos aguardando pagamento"`

## 9. Telas/Componentes — handoff para UX (Uma) e Dev (Dex)

**Para Uma (LV-133):**

| # | Tela/Componente | Local | Notas |
|---|---|---|---|
| 1 | Modal de separação (admin) | `src/features/admin/components/OrderSeparationModal.tsx` | Item-por-item, audit lateral, "Marcar separado". §5.3 |
| 2 | Tela de pagamento (cliente) | `/pedido/:id/pagamento` | Breakdown + 2 opções pagamento. §5.6 |
| 3 | Status badges atualizados | `src/features/orders/components/OrderStatusBadge.tsx` | Adicionar `separating` (laranja escuro), `awaiting_payment` (amarelo destaque). §4.4 |
| 4 | Email template | docs/ux-specs/LV-133 + futuro HTML real | Layout per §7.3 |
| 5 | Badge in-app | `BottomNav`/`Header` | §8 |

**Para Dev (futuro):**

| # | Arquivo | Ação |
|---|---|---|
| 1 | `supabase/migrations/020_payment_after_separation.sql` | Schema changes per §4 |
| 2 | `src/types/database.ts` | Atualizar enums per §4.4 e §4.5 |
| 3 | `src/features/checkout/components/StepReview.tsx` | Remover seleção de pagamento per §5.1 |
| 4 | `src/features/admin/components/OrderSeparationModal.tsx` | Componente novo per §5.3 |
| 5 | `src/features/orders/pages/PaymentPage.tsx` | Rota nova per §5.6 |
| 6 | `src/features/orders/components/OrderStatusBadge.tsx` | Adicionar configs novos |
| 7 | Server endpoint `/api/payments/create-preference` | MP integration per §5.7 |
| 8 | Server endpoint `/api/payments/webhook` | MP webhook handler |
| 9 | Email infrastructure (story separada) | Provider, edge function, env vars |
| 10 | Badge in-app | per §8 |

## 10. Edge cases

| # | Cenário | Tratamento |
|---|---|---|
| 1 | Loja inicia separação e abandona modal | Status fica `separating` indefinidamente. Loja pode retomar a qualquer momento. Audit mostra última atividade. |
| 2 | Cliente acessa `/pedido/:id/pagamento` antes da separação | Redirect para `/pedido/:id` (detalhe) com toast "Pedido ainda não separado" |
| 3 | Cliente paga online mas webhook MP falha | UI mostra "Aguardando confirmação" + email "Pagamento detectado, confirmando" + retry do webhook por MP. Suporte manual se persistir. |
| 4 | Cliente paga 2x acidentalmente | Webhook idempotente (mesmo `mp_payment_id` = no-op). Se 2 `mp_payment_id` distintos chegarem, registrar para reembolso manual. |
| 5 | Loja remove todos os itens na separação | Loja decide: finaliza separação vazia OU cancela manualmente. Sem bloqueio do sistema. §6.3 |
| 6 | Cliente cancela pedido durante `separating` | Bloqueado — exibir "Fale com a loja". §6.4 |
| 7 | Loja não consegue receber `cartao_entrega` no momento | Loja registra como `cancelled` manualmente OU mantém `delivered` sem `paid_at` + abre issue manual (escopo separado) |
| 8 | Email de notificação falha (provider down) | Email é fire-and-forget. Pedido fica `awaiting_payment`. Cliente pode acessar via badge in-app. UI do admin tem botão "Reenviar email" se necessário. |
| 9 | Pedido legado (`status='approved'` antes da migration) | Migration backfill: `paid_at = created_at`, mantém como está. UI trata `approved` retroativo igual ao novo. |
| 10 | Cliente troca de senha/dispositivo | Não afeta — link `/pedido/:id/pagamento` exige auth, sem token-baseado. |

## 11. Plano de implementação sugerido

> Esta seção é orientativa. O PM/SM (`@pm`/`@sm`) é responsável por quebrar em stories e priorizar.

### Fase 1 — Backend foundation (DEV + DATA-ENGINEER)

- [ ] **Migration 020** — schema changes (orders, order_items, audit table, enums)
- [ ] Backfill de pedidos legados
- [ ] Atualizar types/database.ts
- [ ] RPC `start_separation(order_id)` — `pending → separating` + audit
- [ ] RPC `finalize_separation(order_id)` — recalc totais + `separating → awaiting_payment`
- [ ] RPC `cancel_separation(order_id, reason)` — `separating → cancelled`
- [ ] RPCs para edição de itens (add/remove/update qty/add note)

### Fase 2 — Admin separation UI (DEV + UX)

- [ ] Atualizar `OrderStatusBadge` com novos status
- [ ] Refatorar `OrdersPage` (admin) — filtros novos
- [ ] Criar `OrderSeparationModal`
- [ ] Subcomponentes: lista de itens editáveis, painel de audit, seletor para adicionar item
- [ ] Confirmações destrutivas (remover item, cancelar separação)

### Fase 3 — Customer payment page (DEV + UX)

- [ ] Refatorar `StepReview` — remover seleção de pagamento
- [ ] Atualizar toast/tela de sucesso pós-checkout
- [ ] Criar rota `/pedido/:id/pagamento` (`PaymentPage`)
- [ ] Breakdown de itens (original × separado)
- [ ] Botão MP + Botão pagar-na-entrega + Cancelar

### Fase 4 — Payment integration (DEV)

- [ ] Server endpoint `create-preference` (MP)
- [ ] Server endpoint `webhook` (MP) + validação HMAC + idempotência
- [ ] Variáveis de ambiente (Vercel + local)
- [ ] Testes E2E do fluxo MP em sandbox

### Fase 5 — Notification (DEV + INFRA)

- [ ] **Story separada** — provider de email + edge function `send_separation_email`
- [ ] Trigger no Supabase: ao `status → awaiting_payment`, chama edge function
- [ ] Template HTML do email (per §7.3)
- [ ] Badge in-app (§8) — listener realtime ou polling leve

### Fase 6 — QA (`@qa`)

- [ ] E2E: pedido → separação completa → pagamento online (sandbox MP)
- [ ] E2E: pedido → separação com remoção/adição → pagar na entrega
- [ ] E2E: cancelamento em cada estado
- [ ] Verificar audit completo
- [ ] Verificar email enviado e renderizado corretamente em Gmail/Outlook/Apple Mail
- [ ] Testes de idempotência do webhook

### Estimativa grosso modo
- Fase 1: 2–3 dias (1 dev + 0.5 data-eng)
- Fase 2: 3–4 dias (1 dev + UX async)
- Fase 3: 2–3 dias (1 dev)
- Fase 4: 2–3 dias (1 dev, MP é familiar mas webhook precisa cuidado)
- Fase 5: 2 dias se provider já existe; +1 dia se precisa configurar do zero
- Fase 6: 2–3 dias QA

**Total:** ~2 semanas para 1 dev + UX async + QA no final.

## 12. Open questions / TODOs

- [ ] **Email provider:** decidir entre Resend / SendGrid / outro existente. Story separada a abrir no Plane.
- [ ] **Push web:** definir v2. Stack PWA + service worker já considerada? (não escopo deste doc)
- [ ] **WhatsApp:** Evolution deprecated. Avaliar Z-API ou WhatsApp Cloud API quando WA voltar a ser prioridade.
- [ ] **Recálculo de tier:** §6.5 v2 — quando implementar? Depende de feedback dos lojistas após v1.
- [ ] **Loja perde acesso à máquina de cartão:** §10 cenário 7 — política de cancelamento + comunicação com cliente precisa ser definida com a loja (não tem como o sistema resolver sozinho).
- [ ] **Notificação para a loja:** quando cliente paga online, loja precisa ser notificada? (Email para `store_email`? Badge no admin? Notification realtime?)

## 13. Changelog

| Data | Mudança | Autor |
|---|---|---|
| 2026-05-15 | Criação inicial — 8 decisões aprovadas | Orion (facilitação) + Fernando Gleisson (decisão) |
| 2026-06-03 | Rodada 2 — gate §3.3 B: `payment_method` enum passa a ter `cartao_entrega \| dinheiro_entrega`; campo `delivery_change_for NUMERIC(12,2) NULL` adicionado em §4.1; §5.8 reescrito com sub-fluxo 2 steps; sem email extra pós-entrega | Orion (facilitação) + Fernando Gleisson (decisão) |

---

**Fontes consultadas:**
- `docs/ux-specs/cart-feedback-on-product-card.md` (convenção de UX specs)
- `src/types/database.ts` (schemas atuais)
- `supabase/migrations/013_cart_order_variants.sql` (estrutura order_items)
- `src/features/orders/components/OrderStatusBadge.tsx` (status atuais)
- Conversa com Fernando Gleisson, 2026-05-15
