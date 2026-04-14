# UX Research — Feedback Visual de "Item no Carrinho" em ProductCard

**Autor:** Uma (UX/UI)
**Data:** 2026-04-14
**Contexto:** novob2b (Levee) — sinalizar no `ProductCard` produtos que já estão no carrinho
**Status:** Recomendação para definição de tasks

---

## 1. Padrão dominante (Baymard + benchmarks)

A pesquisa em apps de grocery/delivery (Instacart, Peapod, Cornershop, Uber Eats Grocery, iFood Mercado, Rappi Turbo) converge em **um padrão claro**:

> **O botão "Adicionar" transforma-se em um stepper de quantidade quando o item está no carrinho.**

Por que esse padrão venceu:
- **Visibilidade**: dá pra escanear a grade e ver o que já foi pego sem ir até o carrinho
- **Eficiência**: ajustar quantidade direto na grade — clássico fluxo "no carrinho 5 laranjas, mudou de ideia, ajusta pra 3 sem sair" (Baymard)
- **Mental model**: imita "pegar e devolver na prateleira" — chave em compra de mercearia (>50 itens por pedido típico)
- **Mobile-first**: stepper compacto cabe no espaço do botão, zero layout shift

**Fontes principais:**
- Baymard Institute — [Grocery UX: Add to Cart → Quantity Selector](https://baymard.com/blog/grocery-add-to-cart-buttons)
- Baymard — [Update cart quantity (61% Don't)](https://baymard.com/blog/auto-update-users-quantity-changes)
- Justinmind — [Shopping cart UI](https://www.justinmind.com/ui-design/shopping-cart)
- UX Lift — [Dynamically update Add to Cart button](https://www.uxlift.org/articles/grocery-ux---dynamically-update-the-add-to-cart-button-to-a-quantity-selector-after-item-added/)

## 2. Estado atual no novob2b

```
[ - 1 + ]   [🛒 Adicionar]
```

- Stepper independente (sempre 1 inicial) + botão "Adicionar"
- Sem feedback visual de "já no carrinho"
- Pra ajustar quantidade: precisa abrir Cart Sheet → ajustar lá

## 3. Opções avaliadas

### Opção A — Stepper substitui o botão (RECOMENDADA)

Quando `quantityInCart > 0`, o botão "Adicionar" some e dá lugar a um stepper que **controla diretamente o item no carrinho**.

```
NÃO ESTÁ NO CARRINHO          NO CARRINHO
┌──────────────────┐          ┌──────────────────┐
│                  │          │                  │
│   [imagem]       │          │   [imagem]       │
│                  │          │                  │
│ Açúcar 500g      │          │ Açúcar 500g      │
│ R$ 8,99          │          │ R$ 8,99          │
│ [- 1 +] [Adic.]  │          │   [ - 3 + ]      │  ← stepper full-width
└──────────────────┘          └──────────────────┘
                                + borda/glow sutil verde
                                + ✓ pequeno no canto
```

**Detalhes:**
- `+`/`-` ajusta direto no carrinho (debounced 300ms pra evitar request por tap)
- `0` no decremento → remove do carrinho → volta ao estado inicial
- Borda sutil `border-primary/40` + ícone ✓ no canto superior esquerdo (substitui o lugar do badge de desconto se ambos coexistirem)
- Feedback otimista (UI muda imediato, request em background)

**Prós:** padrão de mercado, máxima eficiência, zero layout shift.
**Contras:** muda comportamento atual do stepper (era "quantidade a adicionar", vira "quantidade no carrinho"). Em B2B, pode confundir lojistas acostumados com fluxo "monto pedido → confirmo".

### Opção B — Badge "✓ N no carrinho" + botão "Adicionar mais"

Mantém o stepper atual + botão, e **adiciona** um pill no canto do card mostrando "✓ 3".

```
┌──────────────────┐
│ ✓ 3              │  ← pill verde top-left
│   [imagem]       │
│                  │
│ Açúcar 500g      │
│ R$ 8,99          │
│ [- 1 +] [Adic.]  │
└──────────────────┘
```

**Prós:** mudança incremental, não muda comportamento do stepper, lojista B2B continua "acumulando" pedido.
**Contras:** pra ajustar tem que ir pro cart sheet. Baymard alerta: badge sozinho é sub-ótimo em mobile (pequeno demais, fácil ignorar).

### Opção C — Híbrida (RECOMENDADA pra B2B)

Combina: **badge** sinaliza visualmente + **botão muda label** pra "Adicionar mais (3)" + stepper continua sendo "quantidade a adicionar agora".

```
┌──────────────────┐
│ ✓ 3              │
│   [imagem]       │
│                  │
│ Açúcar 500g      │
│ R$ 8,99          │
│ [- 1 +] [+ Mais 3] │
└──────────────────┘
```

**Prós:** preserva mental model de B2B (acumula pedido), tem feedback visual claro (badge + label), zero risco de "decrementei sem querer e perdi 5 do carrinho".
**Contras:** mais elementos visuais no card pequeno; Adicionar fica wider.

## 4. Recomendação final

**Para o novob2b**, recomendo **Opção C (híbrida)**.

Motivo: o público é **lojista B2B**, não consumidor final. Ele monta um pedido grande de revenda — o fluxo é "browse → adicionar → ajustar no checkout", não "compro spot e ajusto quantidade no card". Trocar o paradigma pra "stepper = quantidade no carrinho" (Opção A, tipo iFood) força o lojista a pensar em quantidade absoluta o tempo todo, o que conflita com como ele monta listas grandes.

A **Opção C** dá o melhor de dois mundos:
- Feedback visual igual ao padrão de mercado (badge ✓ + count)
- Comportamento de adição mantém o mental model B2B
- Pra ajustar precisão (ex: tirar 2 do que já adicionou), o lojista vai pro Cart Sheet — onde já tem visão consolidada do pedido

## 5. Detalhes de implementação (pra LV-127+)

### Visual

- **Badge** top-left do card: pill verde `bg-emerald-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm`. Conteúdo: `✓ {qtdNoCarrinho}` ou `✓ {qtdFormatada}` se fracionário (ex: "✓ 1,5kg"). Conflito com badge de desconto: empilhar verticalmente OU mover o de desconto pra direita.
- **Card**: borda sutil `border-primary/30` quando `inCart`. Não usar glow forte (poluição visual numa grade de 4 colunas).
- **Label do botão Adicionar**: muda pra `+ Mais` (mantém o ícone + texto curto). Tooltip: "Adicionar +N ao carrinho. Já tem {qtd}".

### Comportamento

- `quantityInCart` = soma de todas as variantes do produto no carrinho (ou da variante selecionada — ver decisão de variantes abaixo)
- Atualização **reativa** ao cart-store (zustand): mudança no carrinho via outra tela reflete no card sem refresh
- Feedback otimista mantido (sem mudanças no addItem)

### Variantes — decisão necessária

Produtos com múltiplas variantes (un / kg / cx):
- **(a)** Badge soma todas as variantes: "✓ 5" (3un + 2kg)
- **(b)** Badge mostra só da variante selecionada: badge muda quando o lojista troca a variante
- **(c)** Badge mostra "✓ 3 + 2kg" detalhado

Recomendo **(b)** — o lojista está vendo uma variante por vez, faz sentido o badge refletir essa.

### Acessibilidade

- Badge tem `aria-label="3 unidades já no carrinho"`
- Card com `aria-current="true"` quando in-cart (lê em screen reader)
- Borda + ícone garantem acessibilidade pra daltônicos (cor sozinha não basta)

## 6. Tasks sugeridas (pra Orion criar)

1. **DEV (frontend-lead)** — `useCartQuantity(productId, variantId?)` hook que lê do cart-store e retorna quantidade atual reativa.
2. **DEV (frontend-lead)** — refatorar `ProductCard` pra incluir badge ✓ + borda + label dinâmico do botão. Tratar conflito visual com badge de desconto.
3. **DEV (frontend-lead)** — mesma lógica em `QuickReorderCard` (HomePage) e `ProductPage` (página de detalhe).
4. **QA** — validar nos 3 contextos (HomePage carrossel, grade filtrada, ProductPage), com produto sem variante / com variantes / fracionário (kg).

Tudo no projeto **Levee**, módulo **Aplicativo B2B**, com Diego + agentes nos assignees.

---

_Doc gerado como deliverable da pesquisa solicitada por Diego em 2026-04-14._
