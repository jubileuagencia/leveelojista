# Plano de Execução — Fluxo de Pagamento Pós-Separação

**Projeto:** novob2b (Levee)
**Autor:** Orion (@aios-master)
**Data:** 2026-06-03
**Épico:** LV-133 a LV-148 — pagamento invertido (cliente pede → loja separa → cliente paga)
**Fonte de verdade:** `docs/decisoes/fluxo-pagamento-pos-separacao.md`

---

## Mapa de dependências

```
LV-133 ✅   LV-148 ✅
  (UX)       (DOC)
     │
     ▼
LV-141 ──────────────────────────────────────┐
(DATA: Schema)                                │
     │                                        │
     ├──────────────┐                         │
     ▼              ▼                         ▼
LV-147          LV-146                    LV-134
(DEV/UX: Badges) (DEV: Checkout refactor) (ARCH: ADR MP)
     │              │                         │
     └──────┬────────┘                        │
            ▼                                 │
         LV-137                               │
   (DEV: Modal separação)                     │
                                              │
            ┌─────────────────────────────────┘
            ▼
         LV-135
  (DEV: MP preference + tela pagamento)
            │
     ┌──────┴──────┐
     ▼             ▼
  LV-136        LV-138
(Webhook MP)  (Email Resend)
     │             │
     └──────┬───────┘
            ▼
         LV-140
       (QA: E2E)
```

---

## Execução por fase

### ✅ Fase 0 — Concluído

| Task | Dono | Entregável |
|---|---|---|
| LV-133 | @ux-design-expert | Wireframes completos do fluxo pós-separação (gate resolvido 2026-06-03) |
| LV-148 | @aios-master | Doc de decisão + gate LV-133-gate-payment-method.md |

---

### Fase 1 — Foundation (paralelo, sem dependências entre si)

**Pode começar agora. Desbloqueiam todas as fases seguintes.**

| # | Task | Dono | O que fazer | Bloqueia |
|---|---|---|---|---|
| 1a | **LV-141** | @data-engineer | Migration 020: novos campos em `orders` e `order_items`, tabela `order_separation_audit`, enums `OrderStatus` e `PaymentMethod` | tudo |
| 1b | **LV-134** | @architect | ADR: escolher abordagem de integração MP (SDK server-side vs API REST direta), definir onde roda (`create-preference` + webhook), variáveis de ambiente necessárias | LV-135, LV-136 |

**Critério de saída da Fase 1:**
- Migration 020 aplicada em dev + types atualizados em `src/types/database.ts`
- ADR aprovado por Fernando

---

### Fase 2 — UI Base (paralelo, requer LV-141)

**Pequeno e visual. Libera as telas grandes da Fase 3 e 4.**

| # | Task | Dono | O que fazer | Bloqueia |
|---|---|---|---|---|
| 2a | **LV-147** | @dev + @ux-design-expert | Adicionar `separating` e `awaiting_payment` nos dois `OrderStatusBadge` (cliente + admin), unificar paleta, adicionar pílula `✓ Pago`. Ver §4 do UX spec. | LV-137, LV-135 |
| 2b | **LV-146** | @dev | Remover `StepPayment` do checkout (ou simplificar para informativo). Submit cria order com `status=pending`, `payment_method=null`. Ver §5.1 do doc de decisões. | LV-135 |

**Critério de saída da Fase 2:**
- Badges visuais corretos em ambos os componentes
- Checkout não pede mais método de pagamento

---

### Fase 3 — Admin Separation (requer LV-141 + LV-147)

| # | Task | Dono | O que fazer | Bloqueia |
|---|---|---|---|---|
| 3 | **LV-137** | @dev | Criar `OrderSeparationModal.tsx`: lista de itens editáveis (stepper fracionário, remoção com confirmação, adição/substituição), painel de audit, footer com diff de totais, botão "Marcar como separado". Ver §2 do UX spec e §5.3 do doc de decisões. | LV-140 (QA) |

**Critério de saída da Fase 3:**
- Admin consegue iniciar separação (`pending → separating`) e finalizar (`separating → awaiting_payment`)
- Audit registra todas as mudanças

---

### Fase 4 — Tela de Pagamento do Cliente (requer LV-134 + LV-141 + LV-147 + LV-146)

| # | Task | Dono | O que fazer | Bloqueia |
|---|---|---|---|---|
| 4 | **LV-135** | @dev | Rota `/pedido/:id/pagamento` (`PaymentPage`), breakdown item-a-item original vs separado, botão "Pagar agora" → MP Checkout Pro, sub-fluxo "Pagar na entrega" (Cartão/Dinheiro + troco). Ver §3 completo do UX spec e §5.6/§5.7/§5.8 do doc de decisões. | LV-136, LV-140 |

**Critério de saída da Fase 4:**
- Cliente vê breakdown correto em `awaiting_payment`
- "Pagar na entrega" persiste `cartao_entrega` ou `dinheiro_entrega` + `delivery_change_for`
- Redirect correto para MP em sandbox

---

### Fase 5 — Webhook + Email (paralelo, requer LV-135)

| # | Task | Dono | O que fazer | Bloqueia |
|---|---|---|---|---|
| 5a | **LV-136** | @dev | Endpoint `/api/payments/webhook`: validação HMAC, idempotência por `mp_payment_id`, atualiza `status=approved` + `paid_at`. Ver §5.7 do doc de decisões. | LV-140 |
| 5b | **LV-138** | @dev + @devops | Setup Resend, edge function `send_separation_email`, trigger Supabase ao `awaiting_payment`, template HTML do email. Ver §5 do UX spec e §7 do doc de decisões. | LV-140 |

**Critério de saída da Fase 5:**
- Webhook MP recebe e processa pagamento em sandbox
- Email disparado ao `awaiting_payment` com breakdown correto

---

### Fase 6 — QA E2E (requer Fases 3, 4 e 5 completas)

| # | Task | Dono | O que fazer |
|---|---|---|---|
| 6 | **LV-140** | @qa | E2E dos 3 fluxos: (1) pagamento online MP, (2) pagar na entrega com troco, (3) cancelamento em cada estado. Verificar audit completo, email em Gmail/Outlook, idempotência webhook. Ver checklist §6 do UX spec. |

---

## Calendário sugerido (1 dev)

| Semana | Fases ativas |
|---|---|
| S1 | Fase 1 (DATA + ARCH em paralelo) |
| S2 | Fase 2 (Badges + Checkout refactor) |
| S3 | Fase 3 (Modal separação admin) |
| S4 | Fase 4 (Tela pagamento cliente) |
| S5 | Fase 5 (Webhook + Email em paralelo) |
| S6 | Fase 6 (QA E2E) |

> Com 2 devs em paralelo nas Fases 2–5, estimativa cai para ~3–4 semanas.

---

## Regras de gate entre fases

1. **LV-141 não mergeado = nada pode avançar** — é o chão de tudo.
2. **LV-134 precisa ser aprovado antes de LV-135 começar** — o ADR define a arquitetura do MP.
3. **LV-147 (badges) antes de LV-137 e LV-135** — as telas usam os novos badges; evita retrabalho visual.
4. **LV-135 antes de LV-136** — o webhook precisa do `mp_preference_id` que LV-135 cria.
5. **LV-140 (QA) só começa quando Fases 3, 4 e 5 estiverem em revisão/concluídas** — testa o fluxo completo ponta a ponta.

---

## Referências

- UX Spec: `docs/ux-specs/LV-133-fluxo-pagamento-pos-separacao.md`
- Doc de decisões: `docs/decisoes/fluxo-pagamento-pos-separacao.md`
- Gate resolvido: `docs/decisoes/LV-133-gate-payment-method.md`
- Plane projeto Levee: `http://76.13.164.45:8088` (ID `1b1eed0b-f206-421b-8a70-eaea2242a7a5`)
