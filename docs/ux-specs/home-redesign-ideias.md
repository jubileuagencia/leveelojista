<!-- ⚠️ [REVISAR-COM-DEV] Arquivo local da branch feature/fase-5-fundacao (2026-03-23), nunca pushado ao GitHub. Avaliar com @dev se deve ser mantido, descartado ou mergeado. -->

# Home Redesign — Pesquisa e Ideias

**Agente:** @ux-design-expert (Uma)
**Data:** 2026-03-23
**Status:** Pesquisa + Ideias (pre-wireframe)

---

## 1. Benchmark — O que os grandes fazem

### 1.1 iFood

| Secao | Descricao |
|-------|-----------|
| **Header** | Endereco de entrega + busca |
| **Banner carousel** | Banners promocionais rotativos (cupons, campanhas sazonais) |
| **Categorias rapidas** | Icones circulares em scroll horizontal (Restaurantes, Mercado, Farmacia, Bebidas, Pet) |
| **Pedidos recentes** | "Pedir de novo" com cards dos ultimos restaurantes/itens |
| **Recomendados pra voce** | Feed personalizado baseado em historico + localizacao |
| **Ofertas do dia** | Cards com desconto em destaque, temporizador de urgencia |
| **Lojas proximas** | Grid de estabelecimentos com avaliacao, tempo de entrega, frete |

**Insight UX:** iFood criou 3 novas sessoes na home baseadas em dados — restaurantes recomendados, descontos personalizados por ultimo pedido, e favoritos com desconto. Resultado: aumento de conversao.

### 1.2 Ze Delivery

| Secao | Descricao |
|-------|-----------|
| **Header** | Endereco + tempo estimado de entrega ("30-40 min") |
| **Banner promocional** | Um banner hero grande com oferta principal |
| **Categorias** | Icones em grid/scroll: Cervejas, Destilados, Vinhos, Refrigerantes, Snacks, Gelo |
| **Combos** | Cards de combos (ex: "6 cervejas + gelo") com preco especial |
| **Mais vendidos** | Scroll horizontal com os produtos mais populares da regiao |
| **Novidades** | Produtos recem-adicionados |

**Insight UX:** Redesign do Ze resultou em +8pp de conversao, nota Google Play de 2.90→3.50, e ticket medio +$4. Chave: design minimalista, muito white-space, UI vibrante e identidade visual forte.

### 1.3 99Food / Rappi

| Secao | Descricao |
|-------|-----------|
| **Header** | Endereco + busca + notificacoes |
| **Stories** | Bolhas circulares no topo (estilo Instagram) com ofertas rapidas |
| **Categorias horizontais** | Pills/tabs filtráveis |
| **Cupons/Ofertas** | Banner card com CTA direto "Usar cupom" |
| **Feed personalizado** | Mix de restaurantes + ofertas + recomendacoes em lista infinita |

**Insight UX:** Formato Stories aumenta engajamento. Layout minimalista com foco em velocidade de decisao.

### 1.4 Apps B2B / Wholesale (RepSpark, WizCommerce, OROSHI)

| Secao | Descricao |
|-------|-----------|
| **Dashboard de status** | Pedidos em andamento, ultimo pedido, status de entrega |
| **Reorder rapido** | "Repetir ultimo pedido" com 1 clique — feature #1 mais usada |
| **Catalogo por categorias** | Grid com imagens e contagem de produtos por categoria |
| **Precos personalizados** | Desconto por tier visivel na home (urgencia/valor) |
| **Lista de compras** | Salvar listas recorrentes para reordenar |
| **Alertas de estoque** | Notificacoes de produtos em falta ou reposicao |

**Insight B2B:** Usuarios B2B sao orientados a resultado, nao exploracao. Quick reorder e dashboard de status sao os elementos mais criticos. Personalizacao por role/tier e essencial.

---

## 2. Estado Atual da Home — Levee B2B

```
┌─────────────────────────────────┐
│  Saudacao + Badge Tier          │
│  Barra de Busca                 │
├─────────────────────────────────┤
│  Categorias (pills scroll)     │  ← Só featured
│  + "Ver todas →"               │
├─────────────────────────────────┤
│  Pedido Rapido (scroll horiz)  │  ← Ultimo pedido
├─────────────────────────────────┤
│  Grid de Produtos (2-4 cols)   │  ← Todos ou filtrados
│  ...                           │
│  ...                           │
└─────────────────────────────────┘
```

**O que funciona bem:**
- Saudacao personalizada com tier
- Pedido rapido baseado no ultimo pedido
- Filtro por categoria com pills

**O que falta / pode melhorar:**
- Sem banners promocionais (ofertas, novidades, campanhas)
- Sem secao de "mais vendidos" ou "populares"
- Sem indicador de prazo de entrega
- Sem secao de ofertas/descontos por tier
- Grid de produtos sem hierarquia visual (tudo igual)
- Sem "lista de compras" recorrente (feature B2B essencial)
- Sem status de pedido recente na home

---

## 3. Proposta de Redesign — Secoes da Nova Home

### Layout proposto (mobile-first):

```
┌─────────────────────────────────┐
│  HEADER (ja existe no layout)   │
╞═════════════════════════════════╡
│                                 │
│  1. HERO / BOAS-VINDAS          │
│  Saudacao + Tier + Prazo entrega│
│                                 │
├─────────────────────────────────┤
│  2. BUSCA (ja existe)           │
├─────────────────────────────────┤
│                                 │
│  3. BANNER CAROUSEL             │  ← NOVO
│  [Promo 1] [Promo 2] [Promo 3] │
│  ● ○ ○                         │
│                                 │
├─────────────────────────────────┤
│                                 │
│  4. CATEGORIAS DESTAQUE         │
│  🍺 🥩 🧃 🥬 🧀 → Ver todas   │
│                                 │
├─────────────────────────────────┤
│                                 │
│  5. PEDIDO RAPIDO               │
│  ⚡ Repetir ultimo pedido       │
│  [Card] [Card] [Card] →        │
│                                 │
├─────────────────────────────────┤
│                                 │
│  6. OFERTAS DO SEU TIER         │  ← NOVO
│  💎 Desconto Diamante -10%     │
│  [Card com preco riscado]       │
│                                 │
├─────────────────────────────────┤
│                                 │
│  7. MAIS VENDIDOS               │  ← NOVO
│  🔥 Os queridinhos da semana   │
│  [Card] [Card] [Card] →        │
│                                 │
├─────────────────────────────────┤
│                                 │
│  8. TODOS OS PRODUTOS           │
│  Grid 2x (mobile) 4x (desktop) │
│  ...                           │
│                                 │
└─────────────────────────────────┘
```

---

## 4. Detalhamento de Cada Secao

### 4.1 Hero / Boas-vindas (melhorado)

**Hoje:** Saudacao + tier badge
**Proposta:** Adicionar prazo estimado de entrega + status do ultimo pedido

```
┌─────────────────────────────────┐
│  Bom dia, Mercadinho ABC   💎  │
│  📦 Proximo pedido: entrega    │
│     amanha ate 14h             │
│  🟢 Pedido #1234 — a caminho  │  ← link para /pedido/:id
└─────────────────────────────────┘
```

**Valor:** Lojistas B2B querem saber status de pedidos sem navegar. Urgencia = engajamento.

### 4.2 Banner Carousel

**O que:** Carousel de banners promocionais (2-4 slides)
**Exemplos de banners:**
- "Frete gratis em compras acima de R$500"
- "Novos produtos: linha de limpeza"
- "Desconto relampago: cervejas 15% OFF ate sexta"
- "Indique um lojista e ganhe R$50"

**UX:** Auto-slide a cada 5s, dots indicadores, swipe mobile, pause on hover.
**Dados:** Tabela `banners` no Supabase (id, title, image_url, link, active, sort_order, starts_at, ends_at)

### 4.3 Categorias Destaque (ja existe, refinar)

**Proposta de melhoria:**
- Trocar pills por icones circulares maiores (estilo iFood/Ze) com emoji + nome
- Background colorido por categoria (usar campo `color` que ja existe)
- Scroll horizontal suave
- Badge de contagem de produtos por categoria

```
  (🍺)    (🥩)    (🧃)    (🥬)    (🧀)    (→)
  Bebidas  Carnes  Sucos   Hortifruti  Laticinios  Ver mais
```

### 4.4 Pedido Rapido (ja existe, melhorar)

**Melhorias:**
- Adicionar botao "Repetir tudo" que adiciona todos os itens ao carrinho de uma vez
- Mostrar preco de cada item no card
- Mostrar quantidade do ultimo pedido
- Se nao tem pedido anterior, mostrar "Monte seu primeiro pedido" com CTA

### 4.5 Ofertas do Tier (NOVO)

**O que:** Secao exclusiva mostrando produtos com desconto do tier do usuario
**Exemplo:**

```
┌─────────────────────────────────┐
│  💎 Ofertas Diamante (-10%)    │
│                                 │
│  ┌────────┐ ┌────────┐         │
│  │ R$8,90 │ │ R$12,50│         │
│  │ R̶$̶9̶,̶9̶0̶│ │ R̶$̶1̶3̶,̶9̶0̶│         │
│  │ Coca 2L│ │ Heineken│        │
│  └────────┘ └────────┘         │
└─────────────────────────────────┘
```

**Valor:** Tier visivel = incentivo a comprar mais para subir de nivel. Preco riscado cria senso de valor.

### 4.6 Mais Vendidos (NOVO)

**O que:** Top 10 produtos mais vendidos (ultimos 7 ou 30 dias)
**Implementacao:** RPC `get_top_selling_products(limit, days)` que faz COUNT em order_items
**UX:** Scroll horizontal, badge "🔥 #1", "#2" etc.

### 4.7 Todos os Produtos (melhorar)

**Melhorias:**
- Infinite scroll ou "Carregar mais" ao inves de carregar todos
- Ordenacao: Mais vendidos | Menor preco | Maior preco | A-Z
- Contagem total no header "248 produtos"

---

## 5. Features Futuras (Fase 2+)

| Feature | Inspiracao | Prioridade |
|---------|-----------|-----------|
| **Lista de compras** salva | B2B apps (RepSpark) | Alta |
| **Stories** promocionais | Rappi / 99Food | Media |
| **Notificacoes de reposicao** | Wholesale apps | Media |
| **Comparativo de precos** por tier | B2B pricing | Baixa |
| **Busca por voz** | Tendencia 2026 | Baixa |
| **Sugestao "voce esqueceu?"** | iFood | Media |
| **Countdown de ofertas** | Flash sales pattern | Media |

---

## 6. Prioridades de Implementacao

### Fase A — Quick Wins (1-2 dias)
1. **Melhorar categorias** → icones circulares com cor
2. **Melhorar Pedido Rapido** → botao "Repetir tudo" + precos
3. **Adicionar prazo de entrega** no hero
4. **Adicionar "Mais Vendidos"** com RPC simples

### Fase B — Impacto Alto (3-5 dias)
5. **Banner Carousel** com tabela `banners` + admin CRUD
6. **Ofertas do Tier** com preco riscado
7. **Status do ultimo pedido** na home
8. **Ordenacao** no grid de produtos

### Fase C — Diferenciacao (futuro)
9. Lista de compras recorrente
10. Infinite scroll
11. Stories promocionais
12. Sugestao "voce esqueceu?"

---

## 7. Referencias e Fontes

- [iFood UX Design Case Study — Designaru](https://www.designaru.com/uxifood)
- [Food Delivery App UI/UX Design 2025 — Medium](https://medium.com/@prajapatisuketu/food-delivery-app-ui-ux-design-in-2025-trends-principles-best-practices-4eddc91ebaee)
- [6 Essential UI/UX Principles for Food Delivery Apps 2025 — WeaversWeb](https://weaversweb.com/6-essential-ui-ux-design-principles-for-food-delivery-apps-in-2025/)
- [Ze Delivery App Design — Behance](https://www.behance.net/gallery/84668831/Z-Delivery-App-Design)
- [Ze Delivery Redesign Case Study — Rodrigo Maues](http://rodrigomaues.com/ze-delivery-app-redesign)
- [B2B Mobile App Interface Design 2025 — ProCreator](https://procreator.design/blog/b2b-mobile-app-interface-design-what-works/)
- [Food Delivery App Design Best Practices — Baymard](https://baymard.com/blog/food-delivery-takeout-launch)
- [Food Delivery App Design for Engagement — SevenSquareTech](https://www.sevensquaretech.com/food-delivery-app-design-for-higher-engagement/)
- [B2B Mobile Ordering Apps — B2Sell](https://www.b2sell.com/blog/b2b-mobile-ordering-apps)
- [Delivery App Design Guide — Mobivery](https://mobivery.com/en/delivery-app-design-part-2-design/)
- [B2B Quick/Bulk Orders — Microsoft Dynamics 365](https://learn.microsoft.com/en-us/dynamics365/commerce/b2b/quick-bulk-orders)
- [Grocery App Development — Onix Systems](https://onix-systems.com/blog/grocery-mobile-app-development)
- [Food App Mobbin Patterns](https://mobbin.com/explore/mobile/app-categories/food-drink)

---

*Documento criado por @ux-design-expert (Uma) — desenhando com empatia* 💝
