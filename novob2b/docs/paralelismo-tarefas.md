# Mapa de Paralelismo — Tarefas novob2b (Sacolao B2B)

**Data:** 2026-03-18
**Base:** `docs/tarefas-sacolao-b2b.md` + ClickUp list "Dev (App B2B/B2C)"
**Gerado por:** @aios-master

---

## Visao Geral — Status Atual (ClickUp)

| Status | Tasks |
|--------|-------|
| Pendente | T5.0, T5.1, T5.2, T5.3, T5.4, T5.5, T5.6, T6.1, T6.2, T6.3, T6.4, T7.1, T8.1, T8.2, T10.1, T10.2, T11.1 |
| Dependencia (bloqueado) | T7.2 (falta P11), T9.1 (falta P13), T9.2 (falta P14/P15) |

Todas atribuidas a **Diego Dias** no ClickUp.

---

## Prioridade 1 — Podem comecar AGORA (paralelo total)

Tocam tabelas, arquivos e contextos 100% diferentes.

| Lane | Task | Descricao | Agente | Arquivos tocados |
|------|------|-----------|--------|-----------------|
| 1 | **T5.1** | Migration: Schema Variantes | @data-engineer | `supabase/migrations/` (cria `product_variants`, altera `products`) |
| 2 | **T5.2** | Migration: Cadastro PF + Tiers | @data-engineer | `supabase/migrations/` (altera `profiles`, enum tiers) |
| 3 | **T5.6** | Admin: Config Dinamica Expandida | @dev | `ConfigPage.tsx`, `services/config.ts`, `hooks/useConfig.ts`, migration `app_config` |
| 4 | **T6.1** | Arquitetura Pagamentos MP | @architect | `docs/architecture/mercadopago-integration.md` (somente docs) |

```
Lane 1: T5.1 (schema variantes)     ██████████  @data-engineer
Lane 2: T5.2 (schema PF/Tiers)      ██████████  @data-engineer
Lane 3: T5.6 (config dinamica)      ██████████  @dev
Lane 4: T6.1 (arquitetura MP)       ██████████  @architect
```

---

## Prioridade 2 — Apos Prioridade 1 (paralelo entre si)

| Lane | Task | Descricao | Agente | Depende de | Arquivos tocados |
|------|------|-----------|--------|------------|-----------------|
| 5 | **T5.0** | Importacao 1014 produtos Bubble | @data-engineer | T5.1 | `scripts/import-products-bubble.ts` (novo) |
| 6 | **T5.3** | Form Cadastro PF/PJ | @dev | T5.2 | `RegisterForm.tsx`, tipos TS |
| 7 | **T8.2** | Renomear Tiers visual | @dev | T5.2 | `TierBadge.tsx`, `ClientDetailsModal`, `ConfigPage` (labels) |

```
Lane 5: T5.0 (importacao produtos)  ██████████  @data-engineer  [depende T5.1]
Lane 6: T5.3 (form cadastro PF/PJ) ██████████  @dev            [depende T5.2]
Lane 7: T8.2 (rename Tiers visual)  ██████████  @dev            [depende T5.2]
```

> **Nota:** T5.3 e T8.2 podem rodar em paralelo — T5.3 toca RegisterForm, T8.2 toca TierBadge/labels. Overlap minimo em ConfigPage (campos diferentes).

---

## Prioridade 3 — Apos Importacao (paralelo com cuidado)

| Lane | Task | Descricao | Agente | Depende de | Arquivos tocados |
|------|------|-----------|--------|------------|-----------------|
| 8 | **T5.4** | Card Produto com Variantes | @dev | T5.0 | `ProductCard.tsx`, `Cart`, `Checkout`, `services/products.ts` |
| 9 | **T5.5** | Admin CRUD Variantes | @dev | T5.0 | `ProductFormModal.tsx`, `services/products.ts`, `hooks/useProducts.ts` |

```
Lane 8: T5.4 (card variantes)       ██████████  @dev  ← customer side
Lane 9: T5.5 (admin variantes)      ██████████  @dev  ← admin side
```

> **Risco leve:** Ambas tocam `services/products.ts` — um lado leitura (customer), outro CRUD (admin). Merge cuidadoso necessario.

---

## Prioridade 4 — Fase 6 Pagamentos (sequencial)

| Ordem | Task | Descricao | Depende de |
|-------|------|-----------|------------|
| 1o | **T6.2** | Backend Mercado Pago | T6.1 |
| 2o | **T6.3** | Frontend Checkout MP | T6.2 |
| 2o | **T6.4** | Admin Filtros Pagamento | T6.2 |

> T6.3 e T6.4 podem rodar em paralelo apos T6.2 — um toca checkout (customer), outro toca OrdersPage (admin).

---

## Prioridade 5 — Apos Config Dinamica

| Lane | Task | Descricao | Depende de |
|------|------|-----------|------------|
| A | **T7.1** | Logica Data Entrega | T5.6 |
| B | **T8.1** | Preco PIX Cards/Carrinho/Checkout | T5.6 |

> **T7.1 e T8.1 podem rodar em paralelo** — T7.1 toca calculo de datas, T8.1 toca pricing. Sem overlap de arquivos.

---

## NAO PARALELO — Conflito Direto de Arquivos

| Task A | Task B | Motivo | Solucao |
|--------|--------|--------|---------|
| T5.4 | T8.1 | Ambas alteram `ProductCard`, `Cart`, `Checkout` | Fazer T5.4 ANTES, T8.1 por cima |
| T6.3 | T8.1 | Ambas alteram `Checkout` | Fazer T6.3 ANTES, T8.1 integra desconto PIX |
| T6.2 | T6.3 | Backend precisa existir antes do frontend | Sequencial obrigatorio |

---

## BLOQUEADAS — Aguardando Respostas do Gestor

| Task | Bloqueador | Pergunta pendente |
|------|-----------|-------------------|
| **T7.2** — Frete por Distancia | P11 | Qual o valor do frete abaixo de R$300? |
| **T9.1** — Tier Automatico | P13 | Thresholds de cada Tier (Ouro/Platina/Diamante)? |
| **T9.2** — Campanhas | P14, P15 | Detalhes de campanhas e regras de desconto? |

> Perguntas pendentes em `docs/pendencias-sacolao.md`

---

## POS-MVP

| Task | Descricao | Notas |
|------|-----------|-------|
| **T10.1** | Arquitetura Bling (NF) | Pode ser pesquisado em paralelo como research |
| **T10.2** | Sync Pedido → Bling | Depende T10.1 + T6.2 |
| **T11.1** | Email Confirmacao Pedido | Depende T6.2 |

---

## Ordem de Execucao Recomendada (Timeline)

```
SPRINT 1 (paralelo total):
  T5.1 + T5.2 + T5.6 + T6.1
       |
SPRINT 2 (paralelo total):
  T5.0 + T5.3 + T8.2
       |
SPRINT 3 (paralelo com cuidado):
  T5.4 + T5.5
       |
SPRINT 4 (sequencial + paralelo):
  T6.2 → (T6.3 + T6.4)
       |
SPRINT 5 (paralelo):
  T7.1 + T8.1
       |
SPRINT 6 (quando desbloqueadas):
  T7.2 + T9.1 + T9.2
       |
POS-MVP:
  T10.1 → T10.2 + T11.1
```

---

## Agentes por Sprint

| Sprint | Agentes ativos |
|--------|---------------|
| 1 | @data-engineer (T5.1, T5.2), @dev (T5.6), @architect (T6.1) |
| 2 | @data-engineer (T5.0), @dev (T5.3, T8.2) |
| 3 | @dev (T5.4, T5.5) |
| 4 | @dev (T6.2, T6.3, T6.4) |
| 5 | @dev (T7.1, T8.1) |
| 6 | @data-engineer + @dev (T9.1, T9.2, T7.2) |
| Pos-MVP | @architect (T10.1), @dev (T10.2, T11.1) |

---

*Documento gerado por @aios-master — AIOS v2.0*
*Referencia: `docs/tarefas-sacolao-b2b.md` | ClickUp: list 901326298240*
