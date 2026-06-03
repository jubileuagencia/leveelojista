# LV-133 — Wireframes: Fluxo de Pagamento Pós-Separação

**Autor:** Uma (UX/UI)
**Data:** 2026-05-27 · **Última atualização:** 2026-06-03
**Contexto:** novob2b (Levee) — inversão do checkout: cliente pede → loja separa → cliente paga
**Fonte da verdade:** [`docs/decisoes/fluxo-pagamento-pos-separacao.md`](../decisoes/fluxo-pagamento-pos-separacao.md)
**Status:** Wireframes para aprovação (handoff p/ @dev após aprovação humana)

> Este doc deriva diretamente do doc de decisões. Não inventa regras de negócio — apenas traduz as decisões §5.3, §5.6, §4.4 e §7 em wireframes acionáveis. Qualquer conflito vence o doc de decisões.

### Changelog

- **2026-06-03 — Uma:** §3.3 B "Pagar na entrega" passa de confirmação simples para sub-fluxo de 3 steps (método → troco se dinheiro → confirmação). Reflete decisão nova do cliente. ⚠ **Divergência com doc de decisões §4.5 (enum `payment_method`) e §4.1 (campos da tabela `orders`)** — ver §7.6 (handoff). Wireframes §3.1/§3.2, checklist §6 e handoff §7 atualizados em cascata.
- **2026-06-03 — Uma (gate resolvido):** Step 1 reduzido de 3 para 2 opções: **Cartão / Dinheiro** (débito/crédito não é distinção do sistema — fica no POS físico). `payment_method` enum: `cartao_entrega | dinheiro_entrega`. Campo `delivery_change_for` confirmado. Progresso do container agora dinâmico: 2/2 (Cartão) ou 3/3 (Dinheiro). Divergência com doc de decisões **resolvida** — fonte da verdade atualizada em `docs/decisoes/fluxo-pagamento-pos-separacao.md`.

---

## 0. Índice de entregáveis

| # | Entregável | Seção | Local de implementação |
|---|---|---|---|
| 1 | Modal de separação (admin) | §2 | `src/features/admin/components/OrderSeparationModal.tsx` |
| 2 | Tela de pagamento (cliente) | §3 | `src/features/orders/pages/PaymentPage.tsx` (`/pedido/:id/pagamento`) |
| 3 | Status badges atualizados | §4 | `OrderStatusBadge.tsx` (admin + orders) |
| 4 | Email template | §5 | spec aqui + HTML real em story de infra |

---

## 1. Princípios de UX que guiam estes wireframes

1. **Transparência radical (confiança B2B):** o lojista que recebe o pedido precisa ver o que mudou (qty pedida → separada, itens removidos, substituições) sem esforço. Diff sempre visível, nunca escondido.
2. **Mobile-first:** loja separa com celular na mão dentro do galpão; cliente recebe e paga em rota, no celular. Ambas as telas são desenhadas mobile-first, depois expandidas para desktop.
3. **Estados financeiros sempre claros:** "quanto era" vs "quanto é agora" vs "quanto pagar" — três números distintos, hierarquia visual forte no total final.
4. **Ações destrutivas com fricção proporcional:** remover item / cancelar pedido sempre confirmam; ajustar peso não confirma (é o fluxo principal).
5. **Reaproveitar o que já existe:** stepper fracionário (`FRACTIONAL_STEP` do `use-cart-item-controller`), padrão de modal Sheet-no-mobile/Dialog-no-desktop, `Badge` shadcn. Zero componente novo onde um existente serve.

---

## 2. Entregável 1 — Modal de Separação (Admin)

**Componente:** `OrderSeparationModal.tsx` · **Decisão de origem:** §5.3
**Padrão de container:** seguir convenção existente do admin — `Sheet` (bottom) no mobile, `Dialog` largo no desktop, via `useIsMobile()`. Para este modal, recomendo **Sheet side="right" full-height** mesmo no desktop, porque o conteúdo é uma lista longa + painel de audit (precisa de altura, não largura).

### 2.1 Desktop (≥ 1024px) — layout 2 colunas

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Separação · Pedido #1042                                            [ ✕ ] │
│ Mercado do João · Rua das Flores 230 · (11) 99999-0000                     │
│ ─────────────────────────────────────────────────────────────────────────│
│  ITENS (3)                                          │  HISTÓRICO (audit)   │
│ ┌─────────────────────────────────────────────────┐│ ┌──────────────────┐ │
│ │ [img] Banana Prata          ✓ separado          ││ │ 14:32 separação  │ │
│ │       Pedido: 1 kg                               ││ │   iniciada       │ │
│ │       Separado: [ − ] 1,2 kg [ + ]   (passo 0,1) ││ │   por João       │ │
│ │       R$ 4,99/kg × 1,2  =  R$ 5,99               ││ │                  │ │
│ │       ✎ Anotação: "pacote fechado 1,2kg"         ││ │ 14:33 Banana     │ │
│ │       [ 🗑 Remover ]                              ││ │   1kg → 1,2kg    │ │
│ ├─────────────────────────────────────────────────┤│ │                  │ │
│ │ [img] Manga Palmer          ✓ separado          ││ │ 14:35 Tomate     │ │
│ │       Pedido: 0,5 kg                             ││ │   Cereja         │ │
│ │       Separado: [ − ] 0,5 kg [ + ]               ││ │   removido       │ │
│ │       R$ 8,00/kg × 0,5  =  R$ 4,00               ││ │   "sem estoque"  │ │
│ │       [ + Anotação ]   [ 🗑 Remover ]            ││ │                  │ │
│ ├─────────────────────────────────────────────────┤│ │ 14:36 Maçã Fuji  │ │
│ │ [img] Tomate Cereja    ⚠ REMOVIDO (riscado)     ││ │   adicionada     │ │
│ │       Motivo: "Sem estoque no momento"           ││ │   (subst. tomate)│ │
│ │       [ ↩ Desfazer remoção ]                     ││ │                  │ │
│ ├─────────────────────────────────────────────────┤│ │                  │ │
│ │ [img] Maçã Fuji        ➕ ADICIONADO            ││ │                  │ │
│ │       Substitui: Tomate Cereja                   ││ │                  │ │
│ │       Separado: [ − ] 1 kg [ + ]                 ││ │                  │ │
│ │       R$ 6,50/kg × 1  =  R$ 6,50                 ││ │                  │ │
│ └─────────────────────────────────────────────────┘│ └──────────────────┘ │
│                                                                            │
│  [ + Adicionar item ]                                                      │
│ ─────────────────────────────────────────────────────────────────────────│
│  Subtotal original:  R̶$̶ ̶9̶2̶,̶3̶0̶      Subtotal ajustado:  R$ 87,30          │
│  Diferença:  − R$ 5,00  (a favor do cliente) 🟢                            │
│                                                                            │
│         [ Salvar rascunho ]            [ ✓ Marcar como separado ]          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Mobile (< 768px) — Sheet bottom, scroll vertical

```
┌────────────────────────────────┐
│ Separação · #1042         [ ✕ ] │
│ Mercado do João                 │
│ Rua das Flores 230              │
│ ──────────────────────────────  │
│  [ Itens (4) ] [ Histórico ]    │ ← tabs (audit vira aba no mobile)
│ ──────────────────────────────  │
│ ┌────────────────────────────┐  │
│ │ [img] Banana Prata    ✓    │  │
│ │ Pedido: 1 kg               │  │
│ │ Separado:                  │  │
│ │   [ − ]  1,2 kg  [ + ]     │  │ ← stepper grande, touch ≥44px
│ │ R$ 4,99/kg × 1,2 = R$ 5,99 │  │
│ │ ✎ "pacote fechado 1,2kg"   │  │
│ │ [ 🗑 Remover ]             │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ [img] Manga Palmer    ✓    │  │
│ │ ...                        │  │
│ └────────────────────────────┘  │
│                                  │
│ [ + Adicionar item ]            │
│ ──────────────────────────────  │
│  Original:  R̶$̶ ̶9̶2̶,̶3̶0̶            │
│  Ajustado:  R$ 87,30            │
│  Diferença: −R$ 5,00 🟢         │
│ ┌────────────────────────────┐  │
│ │ [ ✓ Marcar como separado ] │  │ ← sticky footer
│ │ [ Salvar rascunho ]        │  │
│ └────────────────────────────┘  │
└────────────────────────────────┘
```

### 2.3 Estados de cada item (separation_status)

| Estado | Visual | Editável? |
|---|---|---|
| `pending` | borda âmbar tracejada + tag "a separar" | qty editável, ainda não confirmado |
| `separated` | ✓ verde, borda neutra | qty editável, marcado ok |
| `removed` | conteúdo riscado, fundo vermelho-claro, motivo visível, botão "↩ Desfazer" | não |
| `added` | ➕ badge, fundo verde-claro, "Substitui: X" se aplicável | qty editável |
| `substituted` | (o item original vira `removed` + um novo item `added` aponta pra ele) | — |

### 2.4 Micro-interações e regras de UI (derivadas de §5.3 + §6.1)

- **Stepper de peso:** passo `0,1` para itens com unidade kg/g, passo `1` para unidade `un`. Reusar `FRACTIONAL_STEP` de `use-cart-item-controller`. Long-press acelera (nice-to-have).
- **Preço unitário é read-only** (§6.2 — snapshot imutável). Exibir sempre, nunca como input.
- **Total da linha recalcula otimista** a cada tap no stepper (sem esperar request).
- **Footer "Diferença":** verde quando cliente paga menos (`−`), vermelho/laranja quando paga mais (`+`, ex: peso real maior). Texto contextual: "a favor do cliente" / "ajuste para mais".
- **Gate do botão "Marcar como separado"** (§5.3 aceitação): desabilitado enquanto existir item com `separation_status='pending'`. Tooltip no hover/tap: "Confirme ou remova todos os itens antes de finalizar". Ao desabilitar, mostrar contador: "2 itens ainda não confirmados".
- **"Adicionar item":** abre seletor com busca (reusar busca de produtos existente) + escolha de variante; ao adicionar, perguntar opcionalmente "Substitui algum item?" (liga `substituted_from_item_id`).
- **Remover item:** `AlertDialog` de confirmação com campo de motivo (vira `separation_note` + audit `item_removed`). Padrão de confirmação destrutiva já usado no admin.
- **Fechar sem finalizar:** mantém `status='separating'` (rascunho). Sem dialog de "descartar" — tudo é auto-persistido como rascunho (§5.3).
- **Audit:** read-only, ordem cronológica decrescente (mais recente no topo no mobile, no desktop pode ser crescente em coluna). Cada entrada: `HH:MM · ação · item · autor`.

---

## 3. Entregável 2 — Tela de Pagamento (Cliente)

**Rota:** `/pedido/:id/pagamento` · **Componente:** `PaymentPage.tsx` · **Decisão de origem:** §5.6
**Mobile-first** (cliente paga em rota). Guard de acesso: só dono + só `status='awaiting_payment'`, senão redirect p/ `/pedido/:id` com toast (§5.6 aceitação).

### 3.1 Mobile (estado principal)

```
┌────────────────────────────────┐
│ ←  Pedido #1042                 │
│                                  │
│  🟡 Pronto para pagamento        │ ← badge awaiting_payment
│  Sua loja separou os itens.      │
│  Confira e finalize.             │
│ ──────────────────────────────  │
│  O QUE VOCÊ VAI RECEBER          │
│ ┌────────────────────────────┐  │
│ │ [img] Banana Prata         │  │
│ │  Pedido 1 kg → Separado    │  │
│ │  1,2 kg                    │  │ ← qty original riscada, separada em destaque
│ │  R$ 4,99/kg     R$ 5,99    │  │
│ │  💬 "pacote fechado 1,2kg" │  │ ← anotação da loja (se houver)
│ ├────────────────────────────┤  │
│ │ [img] Manga Palmer         │  │
│ │  Pedido 0,5 kg → 0,5 kg    │  │ ← sem mudança: discreto
│ │  R$ 8,00/kg     R$ 4,00    │  │
│ ├────────────────────────────┤  │
│ │ [img] T̶o̶m̶a̶t̶e̶ ̶C̶e̶r̶e̶j̶a̶        │  │
│ │  ⚠ Removido pela loja      │  │ ← cinza, riscado
│ │  "Sem estoque no momento"  │  │
│ ├────────────────────────────┤  │
│ │ [img] Maçã Fuji      ➕    │  │
│ │  Adicionado (no lugar do   │  │
│ │  tomate) · 1 kg            │  │
│ │  R$ 6,50/kg     R$ 6,50    │  │
│ └────────────────────────────┘  │
│ ──────────────────────────────  │
│  Subtotal original   R̶$̶ ̶9̶2̶,̶3̶0̶    │
│  Subtotal ajustado   R$ 87,30   │
│  Desconto            − R$ 0,00  │
│  Você economizou     R$ 5,00 🟢 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  TOTAL A PAGAR       R$ 87,30   │ ← maior, bold, alto contraste
│ ──────────────────────────────  │
│ ┌────────────────────────────┐  │
│ │ 💳 Pagar agora              │  │ ← primário, full-width
│ │    PIX, boleto ou cartão    │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ 🚚 Pagar na entrega         │  │ ← secundário (outline)
│ │    Cartão ou dinheiro       │  │ ← abre sub-fluxo §3.3 B
│ └────────────────────────────┘  │
│                                  │
│        Cancelar pedido           │ ← terciário, texto, cinza
└────────────────────────────────┘
```

### 3.2 Desktop (≥ 1024px) — 2 colunas (itens | resumo sticky)

```
┌──────────────────────────────────────────────────────────────┐
│ ←  Pedido #1042 · 🟡 Pronto para pagamento                     │
│ ──────────────────────────────────────────────────────────────│
│  O QUE VOCÊ VAI RECEBER                  │  RESUMO            │
│ ┌──────────────────────────────────────┐│ ┌────────────────┐ │
│ │ [img] Banana Prata                   ││ │ Original R̶$̶9̶2̶,̶3̶0̶│ │
│ │ Pedido 1kg → 1,2kg   R$4,99  R$5,99  ││ │ Ajustado R$87,30│ │
│ │ 💬 "pacote fechado 1,2kg"            ││ │ Desconto −R$0,00│ │
│ ├──────────────────────────────────────┤│ │ Economia R$5,00 │ │
│ │ [img] Manga Palmer  ...              ││ │ ━━━━━━━━━━━━━━━ │ │
│ ├──────────────────────────────────────┤│ │ TOTAL  R$ 87,30 │ │
│ │ [img] Tomate Cereja  ⚠ Removido     ││ │                 │ │
│ ├──────────────────────────────────────┤│ │ [💳 Pagar agora]│ │
│ │ [img] Maçã Fuji  ➕ Adicionado      ││ │ [🚚 Na entrega] │ │ ← abre §3.3 B
│ └──────────────────────────────────────┘│ │  Cancelar       │ │
│                                          │ └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Fluxos a partir dos botões

**A) "Pagar agora" (online — §5.7):**
```
[Pagar agora] → loading "Gerando pagamento seguro..."
             → redirect MP Checkout Pro (PIX/boleto/cartão)
             → cliente paga
             → MP retorna p/ /pedido/:id  (toast verde "Pagamento confirmado!")
             → status = approved
   (falha/abandono no MP → volta p/ /pedido/:id/pagamento, status segue awaiting_payment, §5.7)
```

**B) "Pagar na entrega" (§5.8 — fluxo expandido):**

A loja precisa saber **como** o cliente vai pagar para se preparar (levar máquina ou ter troco). Sub-fluxo em até 3 steps dentro de **um único container** (Sheet bottom no mobile, Dialog no desktop) — transições suaves entre steps, sem navegação de página. Header do container mostra progresso (`1 de 2` ou `1 de 3` conforme caminho).

> **Decisão 2026-06-03 (gate):** `cartao_entrega` permanece único — débito/crédito é distinção do POS físico, não do sistema. Sub-fluxo passa a ter 2 opções no Step 1: **Cartão** e **Dinheiro**.

#### B.1 — Step 1: Escolher forma de pagamento

```
┌──────────────────────────────────────┐
│ Pagar na entrega           (1 de 2)  │  ← 1 de 2 se Cartão; 1 de 3 se Dinheiro
│                                       │
│ Como vai pagar R$ 87,30 quando o      │
│ pedido chegar?                        │
│                                       │
│  ┌────────────────────────────────┐   │
│  │ ( ) 💳 Cartão                   │   │ ← RadioGroup card-style
│  ├────────────────────────────────┤   │   touch target ≥ 48px
│  │ ( ) 💵 Dinheiro                 │   │
│  └────────────────────────────────┘   │
│                                       │
│ A loja levará máquina de cartão se    │ ← helper text contextual
│ você escolher cartão.                 │   muda conforme seleção:
│                                       │   Dinheiro → "Você poderá informar
│                                       │   se vai precisar de troco."
│      [ Voltar ]   [ Continuar ]       │ ← Continuar disabled até selecionar
└──────────────────────────────────────┘
```

- RadioGroup **sem default selecionado** (força escolha consciente).
- "Continuar" `disabled` enquanto nenhum método for marcado.
- "Voltar" fecha o container sem mudar status (pedido segue `awaiting_payment`).
- Helper text muda conforme seleção: Cartão → "A loja levará máquina de cartão"; Dinheiro → "Você poderá informar se vai precisar de troco."

#### B.2 — Step 2a: Cartão → pula direto p/ Step de confirmação

Sem perguntas adicionais. Transição suave para o Step de confirmação (progresso: `2 de 2`).

#### B.3 — Step 2b: Dinheiro → tela de troco (progresso: `2 de 3`)

```
┌──────────────────────────────────────┐
│ ← Pagar na entrega         (2 de 3)  │  ← "← Voltar" retorna ao Step 1
│                                       │
│ Você vai precisar de troco?           │
│                                       │
│  ┌────────────────────────────────┐   │
│  │ ( ) Sim, pago com nota maior   │   │
│  ├────────────────────────────────┤   │
│  │ ( ) Não, pago o valor exato    │   │
│  └────────────────────────────────┘   │
│                                       │
│ ┌────────────────────────────────┐    │
│ │ Troco para quanto?              │    │ ← collapse: aparece só se "Sim"
│ │ ┌────────────────────────────┐  │    │
│ │ │ R$ [   100,00            ] │  │    │ ← input numérico R$ mask
│ │ └────────────────────────────┘  │    │
│ │ Valor mínimo: R$ 87,40           │    │ ← total + R$ 0,10 (regra)
│ └────────────────────────────────┘    │
│                                       │
│      [ Voltar ]   [ Continuar ]       │
└──────────────────────────────────────┘
```

**Regras de validação:**
- RadioGroup obrigatório (sem default).
- Se "Sim" → input de troco aparece com **collapse animation** (motion-safe; sem motion em `prefers-reduced-motion`).
- Input usa mask de moeda BR (`R$ 99,99`), `inputMode="decimal"`, `pattern` numérico.
- **Valor mínimo aceito = total + R$ 0,10** (não faz sentido troco igual ou menor que o total — UX confirma "valor exato" nesse caso).
- Erro inline (não-bloqueante) se valor < mínimo: "Troco precisa ser maior que R$ 87,30. Se vai pagar o valor exato, escolha a opção acima."
- "Continuar" `disabled` até: ("Não" selecionado) **OU** ("Sim" + input válido ≥ mínimo).
- "← Voltar" no header retorna ao Step 1 mantendo método "Dinheiro" pré-selecionado.

#### B.4 — Step de confirmação

```
┌──────────────────────────────────────┐
│ ← Confirmar        (2 de 2 ou 3 de 3)│  ← 2/2 se Cartão; 3/3 se Dinheiro
│                                       │
│ Revisar pagamento na entrega          │
│                                       │
│ Pedido:           #1042               │
│ Total a pagar:    R$ 87,30            │
│ Método:           💵 Dinheiro          │ ← ou 💳 Cartão
│ Troco para:       R$ 100,00           │ ← linha só se dinheiro+troco
│ Loja levará:      R$ 12,70 de troco   │ ← cálculo automático
│                                       │
│  ┌──────────────────────────────┐     │
│  │ ℹ Ao confirmar, seu pedido    │     │
│  │   é aprovado e a loja prepara │     │
│  │   para entrega. O pagamento   │     │
│  │   acontece na hora da entrega.│     │
│  └──────────────────────────────┘     │
│                                       │
│      [ Voltar ]   [ Confirmar ]       │ ← Confirmar = primary
└──────────────────────────────────────┘
```

**Conteúdo dinâmico:**
- Cartão → resumo de 3 linhas (Pedido, Total, Método: 💳 Cartão).
- Dinheiro sem troco → 3 linhas + 1 linha "Troco: Valor exato".
- Dinheiro com troco → 5 linhas incluindo "Troco para" e "Loja levará" (calculado: `troco - total`).

**Submit:**
```
[Confirmar] → loading "Aprovando pedido..."
   → mutation atualiza: status='approved',
       payment_method ∈ {cartao_entrega, dinheiro_entrega},
       delivery_change_for=valor (só se dinheiro+troco; senão null)
   → toast verde: "Pedido aprovado! 🎉 Pagamento na entrega: {método label}"
   → redirect /pedido/:id
   (erro de rede → mantém step de confirmação + erro inline "Não foi possível aprovar. Tente novamente.")
```

#### B.5 — Resumo de estados (state machine do sub-fluxo)

| De | Ação | Para |
|---|---|---|
| Step 1 | seleciona Cartão + Continuar | Confirmação (2/2) |
| Step 1 | seleciona Dinheiro + Continuar | Step troco (2/3) |
| Step 1 | Voltar / fechar container | sai (sem mudar status) |
| Step troco | Não precisa troco + Continuar | Confirmação (3/3) |
| Step troco | Sim + valor válido + Continuar | Confirmação (3/3) |
| Step troco | ← (header) | Step 1 (mantém Dinheiro marcado) |
| Confirmação | Confirmar | `status=approved` + redirect |
| Confirmação | ← (header) | Step 1 (se Cartão) ou Step troco (se Dinheiro) |

**C) "Cancelar pedido" (§6.4):**
```
[Cancelar pedido] → AlertDialog destrutivo (motivo opcional)
   → status = cancelled
   → redirect /pedido/:id  (toast "Pedido cancelado")
```

### 3.4 Estados de borda (empty / erro / acesso)

| Cenário | Tela |
|---|---|
| Pedido não está `awaiting_payment` | redirect `/pedido/:id` + toast "Pedido ainda não está pronto para pagamento" (§10 cenário 2) |
| Não é o dono | 404 (§5.6 aceitação) |
| Separação esvaziou o pedido (todos removidos, §6.3) | breakdown mostra todos riscados, Total R$ 0,00, esconde "Pagar", mostra só "Cancelar pedido" + aviso "A loja não tinha estoque dos itens. Você pode cancelar." |
| Loading da preference MP | botão vira spinner + disabled (evita duplo-tap → §10 cenário 4) |

---

## 4. Entregável 3 — Status Badges Atualizados

**Decisão de origem:** §4.4 · **Componentes:** `orders/components/OrderStatusBadge.tsx` + `admin/components/OrderStatusBadge.tsx`

### 4.1 ⚠ Divergência encontrada (corrigir no handoff)

Hoje existem **dois** `OrderStatusBadge` com cores **diferentes** para o mesmo status:

| Status | Badge cliente (`orders/`) | Badge admin (`admin/`) |
|---|---|---|
| preparing | orange | **purple** |
| shipped | purple | **cyan** |

Recomendação: **unificar a paleta** (uma fonte de cor compartilhada) ao adicionar os novos status, para o cliente e a loja verem a mesma cor para o mesmo estado. Mínimo: alinhar os dois mapas manualmente nesta task.

### 4.2 Paleta completa proposta (9 status)

Ordem do ciclo de vida + cor semântica. `paid` **não é status do enum** — é o fato de `paid_at` estar preenchido; renderizar como badge auxiliar/pílula ao lado do status quando relevante.

```
 pending           ▢ Pendente            cinza-âmbar   (neutro: aguardando loja)
 separating        ▢ Em separação        laranja-escuro (loja trabalhando) ← NOVO
 awaiting_payment  ▢ Aguardando pagamento amarelo-destaque (AÇÃO do cliente) ← NOVO
 approved          ▢ Aprovado            azul          (pago/aprovado)
 preparing         ▢ Preparando          roxo          (unificar)
 shipped           ▢ Enviado             ciano         (unificar)
 delivered         ▢ Entregue            verde-esmeralda
 rejected          ▢ Rejeitado           vermelho
 cancelled         ▢ Cancelado           cinza

 + auxiliar:  ✓ Pago   verde   (pílula extra quando paid_at != null)
```

### 4.3 Classes Tailwind sugeridas (seguindo o padrão existente)

```
separating:
  bg-orange-100 text-orange-900 border-orange-300
  dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-900
  label: "Em separação"

awaiting_payment:   ← mais saliente: é a ação que destrava o pedido
  bg-amber-200 text-amber-900 border-amber-400 font-semibold
  dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-700
  label: "Aguardando pagamento"

paid (pílula auxiliar):
  bg-emerald-100 text-emerald-800 border-emerald-200
  label: "✓ Pago"
```

### 4.4 Onde cada badge aparece

| Local | Status relevantes em destaque |
|---|---|
| `OrdersPage` admin (abas/filtros) | `pending` (destaque), `separating`, `awaiting_payment` |
| Lista de pedidos do cliente (`OrderCard`) | `awaiting_payment` com CTA "Pagar" embutido |
| `OrderDetailsPage` (cliente) | status atual + pílula `✓ Pago` quando aplicável |
| Badge in-app na nav (§8 do doc) | contador de `awaiting_payment` |

---

## 5. Entregável 4 — Email Template (wireframe)

**Decisão de origem:** §7 · **Escopo:** conteúdo/layout apenas (infra de envio = story separada, §7 nota).
**Restrições técnicas (§7.6):** mobile-first, máx 600px, sem JS, sem fonte custom, texto escuro sobre fundo claro, imagens com fallback.

### 5.1 Assunto e pré-header

```
Assunto:    ✅ Pedido #{order_number} separado — R$ {total} para finalizar
Pré-header: Sua loja separou os itens. Confira o ajuste de peso/quantidade e
            finalize o pagamento online ou na entrega.
```

### 5.2 Layout (renderização mobile, ≤600px)

```
┌──────────────────────────────────────────────┐
│                                                │
│              🍉  LEVEE HORTIPLUS               │ ← logo (img + alt fallback)
│                                                │
│  Olá, {customer_name}! 👋                      │
│                                                │
│  Sua loja separou o pedido #{order_number}.    │
│  Está tudo pronto para você finalizar o        │
│  pagamento.                                    │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ [img]  Banana Prata                       │ │
│  │        Pedido: 1 kg  →  Separado: 1,2 kg  │ │ ← diff explícito
│  │        R$ 4,99/kg × 1,2  =  R$ 5,99       │ │
│  │        💬 "pacote fechado 1,2kg"          │ │
│  ├──────────────────────────────────────────┤ │
│  │ [img]  Manga Palmer                       │ │
│  │        Pedido: 0,5 kg → Separado: 0,5 kg  │ │
│  │        R$ 8,00/kg × 0,5  =  R$ 4,00       │ │
│  ├──────────────────────────────────────────┤ │
│  │ ⚠  Tomate Cereja — REMOVIDO              │ │ ← linha de alerta
│  │     Motivo: "Sem estoque no momento"      │ │
│  ├──────────────────────────────────────────┤ │
│  │ ➕  Maçã Fuji — ADICIONADO               │ │
│  │     No lugar do tomate · 1 kg             │ │
│  │     R$ 6,50/kg × 1  =  R$ 6,50            │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  Subtotal original:   R$ 92,30                 │
│  Subtotal ajustado:   R$ 87,30                 │
│  Diferença:           − R$ 5,00 (a seu favor)  │
│  ──────────────────────────────                │
│  Total a pagar:       R$ 87,30                 │ ← bold, maior
│                                                │
│      ┌────────────────────────────────┐        │
│      │     💳  Finalizar pagamento     │        │ ← CTA único, ≥44px, cor marca
│      └────────────────────────────────┘        │
│                                                │
│  Você escolhe na próxima tela: pagar online    │
│  (PIX, boleto, cartão) ou na entrega.          │
│                                                │
│  Dúvidas? Responda este email ou ligue         │
│  {store_phone}.                                │
│                                                │
│  ──────────────────────────────────            │
│  Levee Hortiplus                               │
│  {store_address}                               │
│                                                │
│  Você recebeu este email porque fez um pedido  │
│  na Levee Hortiplus.                           │
└──────────────────────────────────────────────┘
```

### 5.3 Regras de conteúdo (de §7.4, §7.5, §7.7)

- **CTA único** "Finalizar pagamento" → `{payment_url}` = `/pedido/{id}/pagamento`. **Não** colocar "online" vs "entrega" no email (§7.5 — escolha fica na tela).
- **Itens sem mudança:** mostrar "Pedido X → Separado X" igual, mas sem destaque (não alarmar à toa).
- **Itens removidos/adicionados:** linhas visualmente distintas (⚠ / ➕) com motivo.
- **Diferença a favor do cliente:** texto positivo "(a seu favor)". A maior: "(ajuste de peso)".
- **Não enviar** (§7.7): pedido cancelado na separação, email bouncing, pedido já pago.
- **Variáveis:** exatamente as de §7.4. Imagens com `alt` = nome do produto (fallback gracioso, §7.6).

### 5.4 Acessibilidade do email

- Contraste texto/fundo ≥ 4.5:1 (escuro sobre claro).
- CTA é `<a>` estilizado como botão (não imagem-botão) — sobrevive a imagens bloqueadas.
- Estrutura em tabela única de 1 coluna (compat Outlook).
- `lang="pt-BR"`, título de documento descritivo.

---

## 6. Checklist de aceitação (rastreável p/ QA — espelha o doc de decisões)

**Modal de separação (§5.3):**
- [ ] Stepper respeita passo 0,1 para fracionários (`FRACTIONAL_STEP`)
- [ ] Audit registra todas as mudanças (qty/remoção/adição/nota) com timestamp + autor
- [ ] "Marcar como separado" bloqueado se algum item `separation_status='pending'` (com contador + tooltip)
- [ ] Total recalcula otimista em tempo real
- [ ] Fechar sem finalizar = rascunho (`status='separating'`)
- [ ] Remover item exige confirmação + motivo; "Desfazer remoção" disponível

**Tela de pagamento (§5.6):**
- [ ] Não-dono → 404; status ≠ `awaiting_payment` → redirect + toast
- [ ] Breakdown mostra qty original (riscada) vs separada para itens modificados
- [ ] Itens removidos e adicionados claramente sinalizados
- [ ] Total a pagar com hierarquia visual dominante
- [ ] "Pagar agora" → MP; "Pagar na entrega" → sub-fluxo §3.3 B (3 steps); "Cancelar" → confirmação
- [ ] Botão de pagamento vira disabled+spinner durante criação da preference (anti duplo-tap)

**Sub-fluxo "Pagar na entrega" (§3.3 B):**
- [ ] Step 1: RadioGroup com 2 opções (Cartão / Dinheiro), sem default, "Continuar" disabled até seleção
- [ ] Helper text muda contextualmente: Cartão → "A loja levará máquina"; Dinheiro → "Você poderá informar se vai precisar de troco"
- [ ] Cartão → pula step de troco, vai direto p/ confirmação (progresso 2/2)
- [ ] Dinheiro → step de troco (progresso 2/3): pergunta Sim/Não, sem default
- [ ] Se "Sim troco" → input R$ aparece com collapse animation (respeita `prefers-reduced-motion`)
- [ ] Input de troco usa mask BR, `inputMode="decimal"`; valor deve ser **maior que o total**
- [ ] Erro inline se troco ≤ total: "O valor deve ser maior que R$ {total}"
- [ ] Step de confirmação mostra resumo dinâmico (3 linhas p/ cartão, 4 p/ dinheiro-exato, 5 p/ dinheiro-com-troco)
- [ ] Step de confirmação calcula "Loja levará: R$ X" automaticamente (`troco - total`) quando aplicável
- [ ] Submit persiste `payment_method ∈ {cartao_entrega, dinheiro_entrega}` + `delivery_change_for` (null ou numeric)
- [ ] Toast de sucesso menciona o método escolhido ("Pagamento na entrega: Cartão" ou "Pagamento na entrega: Dinheiro")
- [ ] "← Voltar" no header retorna ao step correto (Step 1 de qualquer step; Step troco → Step 1; Confirmação → step anterior)
- [ ] Container responsivo: Sheet bottom no mobile, Dialog no desktop (padrão admin existente)
- [ ] Header exibe progresso dinâmico: "(2 de 2)" p/ Cartão, "(2 de 3)" e "(3 de 3)" p/ Dinheiro

**Badges (§4.4):**
- [ ] `separating` e `awaiting_payment` adicionados nos dois `OrderStatusBadge`
- [ ] Paleta unificada entre cliente e admin
- [ ] `awaiting_payment` visualmente mais saliente (ação do cliente)
- [ ] Pílula `✓ Pago` quando `paid_at != null`

**Email (§7):**
- [ ] Assunto + pré-header conforme §7.1/§7.2
- [ ] Breakdown item-a-item com diff e itens removidos/adicionados
- [ ] CTA único "Finalizar pagamento"
- [ ] ≤600px, sem JS, sem fonte custom, contraste AA, imagens com fallback
- [ ] Variáveis de §7.4 todas mapeadas

---

## 7. Notas de handoff para @dev (Dex)

1. **Antes de codar:** confirmar com Fernando se a divergência de cores dos badges (§4.1) deve ser unificada nesta task ou virar task separada.
2. **Reuso obrigatório:** `FRACTIONAL_STEP`/`use-cart-item-controller` (stepper), padrão Sheet/Dialog do admin, `Badge` shadcn, `AlertDialog` para destrutivos, `RadioGroup`/`Input` shadcn para o sub-fluxo §3.3 B.
3. **Estes wireframes não definem schema** — o schema é §4 do doc de decisões (migration 020, LV-141).
4. **Sequência recomendada de implementação:** badges (§4) → modal de separação (§2) → tela de pagamento (§3) → email (§5). Badges são pré-requisito visual das outras telas.
5. **Email HTML real** sai em story de infra (§7 nota); aqui é só a spec de layout/conteúdo.
6. **⚠ Divergência com doc de decisões — bloqueante para @dev em §3.3 B:** este UX spec introduz refinamentos que **invalidam** o doc de decisões e exigem nova rodada antes da implementação:
   - **§4.5 PaymentMethod enum:** o valor único `cartao_entrega` precisa virar **3 valores**: `debito_entrega`, `credito_entrega`, `dinheiro_entrega`. (Decisões §3 e §8 também citam "máquina de cartão" como rótulo único — atualizar para refletir débito/crédito separados.)
   - **§4.1 tabela `orders`:** adicionar campo **`delivery_change_for NUMERIC(12,2) NULL`** (preenchido só quando `payment_method='dinheiro_entrega'` e cliente pediu troco). Constraint: `CHECK (delivery_change_for IS NULL OR delivery_change_for > total)`.
   - **§5.8 fluxo "Pagar na entrega":** substituir o "modal de confirmação" simples pelo sub-fluxo de 3 steps descrito em §3.3 B deste doc.
   - **§7 email pós-aprovação (sugestão):** quando cliente escolhe pagar na entrega, considerar enviar email de **confirmação separado** ao cliente E à loja com o método + troco — fora do escopo desta UX spec, abrir como nova decisão.

   **✅ GATE RESOLVIDO (2026-06-03):** rodada de decisão concluída. `payment_method` usa `cartao_entrega | dinheiro_entrega`. Campo `delivery_change_for` adicionado à migration. Doc de decisões atualizado. @dev pode implementar §3.3 B sem bloqueio.
7. **Sequência recomendada:** badges (§4) → modal de separação (§2) → tela de pagamento §3.1/§3.2 + fluxo "Pagar agora" (§3.3 A) → sub-fluxo "Pagar na entrega" (§3.3 B) → email (§5).

---

**Fontes consultadas:**
- `docs/decisoes/fluxo-pagamento-pos-separacao.md` (fonte da verdade)
- `src/features/orders/components/OrderStatusBadge.tsx` + `src/features/admin/components/OrderStatusBadge.tsx` (badges atuais — divergência §4.1)
- `docs/ux-specs/cart-feedback-on-product-card.md` (convenção de ux-spec da Uma)
- Padrões de grocery UX (Baymard) já citados na convenção anterior
