# UX Spec — Carrossel de Produtos (HomePage) — LV-112

**Projeto:** novob2b (Levee)
**Autor:** Uma (UX/UI)
**Data:** 2026-04-14
**Dependências:** LV-113 (ARCH) consome este doc
**Escopo:** substituir o grid "Todos os produtos" na HomePage por um carrossel de 10 produtos da categoria **Empório**

---

## 1. Objetivo e princípios

- Reduzir fricção cognitiva na home (244 produtos ativos em Empório — mostrar só 10 em destaque)
- Conduzir o olhar horizontalmente em mobile (scroll-snap nativo)
- Manter ritmo visual consistente com `QuickReorderSection` (que já usa cards 140px em scroll-x)
- Zero layout shift: skeleton com mesma altura do card real

## 2. Anatomia da seção

```
┌─────────────────────────────────────────────────────┐
│  ✨ Destaques em Empório          244 produtos › │  <- header
├─────────────────────────────────────────────────────┤
│  ◀  [Card] [Card] [Card] [Card] [Card] [peek]  ▶   │  <- track
│        ● ○ ○ ○                                       │  <- dots (opcional desktop)
└─────────────────────────────────────────────────────┘
```

### Header
- **Ícone:** `Sparkles` (lucide) — cor `text-amber-500`
- **Título:** `text-base font-semibold` — "Destaques em {categoria}"
- **Link "Ver todos":** `text-xs text-primary hover:underline` — leva para `/categoria/{id}`
- Alinhado à grade 7xl (`max-w-7xl px-4 md:px-6`)

### Track (carrossel)
- **Slides por viewport:**
  - Mobile (<640px): **1.5** (peek do próximo para afordância de swipe)
  - Tablet (640–1024px): **3**
  - Desktop (>1024px): **4**
- **Gap:** `gap-3` (12px) — consistente com QuickReorder
- **Padding lateral:** respeitar container (4/6)
- **Loop:** `false` (final do array = fim, sem wrap)
- **Autoplay:** `false` (B2B, usuário no controle — autoplay atrapalha escaneio)

### Controles
- **Mobile:** sem setas. Swipe + peek bastam.
- **Desktop (≥lg):** setas laterais em overlay
  - Botão circular `size-9`, `bg-background/80 backdrop-blur`, `border`
  - Ícones `ChevronLeft`/`ChevronRight` lucide
  - Aparecem no hover do container (`opacity-0 group-hover:opacity-100 transition`)
  - Desabilitadas (`opacity-40`) nas bordas
- **Dots:** ocultos em mobile; em desktop, abaixo do track, alinhados ao centro — só se `slidesScrollable > 1`

## 3. Card (reuso)

Reusar `ProductCard` existente (`src/features/catalog/components/ProductCard.tsx`). Não duplicar.
- Largura no carrossel: flexível (`flex-[0_0_calc(100%/1.5)]` mobile / `1/3` / `1/4`)
- Aspect-ratio da imagem mantido (atual)
- Badge de tier herdada do card

## 4. Estados

### Loading (skeleton)
- Mostrar **exatamente a mesma estrutura** com `ProductCardSkeleton`
- 4 skeletons visíveis no desktop, 2 no mobile (não render todos os 10 em skeleton — só o viewport)
- Track com `overflow-hidden` pra não vazar

### Vazio
- Se `products.length === 0`, **não renderiza a seção** (nem header)
- Motivo: categoria vazia não deve poluir a home; grid/Search continuam cobrindo

### Erro
- Log no console (padrão atual do app)
- Não renderiza seção (fail silent — é uma vitrine opcional)

### <10 produtos na categoria
- Mostrar os N existentes, sem placeholder
- Ocultar setas se `products.length <= slidesPerView`

## 5. Interação

| Evento | Comportamento |
|--------|---------------|
| Swipe esquerda/direita | Scroll-snap no próximo card |
| Click no card | `navigate('/produto/{id}')` (igual ProductCard) |
| Click na seta | Scroll 1 viewport (ex.: 4 cards no desktop) com smooth |
| Tab | Foco percorre cards na ordem do DOM |
| Enter/Space no card focado | Navega |
| `←`/`→` com foco no track | Move para slide anterior/próximo |

## 6. Acessibilidade (WCAG AA)

- `<section aria-label="Destaques em Empório">` no wrapper
- `role="region"` + `aria-roledescription="carousel"`
- Cada slide: `role="group" aria-roledescription="slide" aria-label="Slide 3 de 10"`
- Botões de seta: `aria-label="Próximo produto"` / "Anterior"
- `aria-live="polite"` no contador "3 de 10" (se exibido) — não anunciar em autoplay (não há)
- Contraste mínimo 4.5:1 em todos os textos
- Target size mínimo 44×44px nas setas

## 7. Performance

- Renderizar **todos os 10 slides** no DOM (quantidade pequena) — sem virtualização
- `loading="lazy"` nas imagens exceto os 2 primeiros (above the fold em mobile)
- Debounce não necessário (sem autoplay, sem resize-sensitive logic)

## 8. Posicionamento na HomePage

Ordem atual → proposta:

```
[Welcome header + SearchBar]
[CategoryFilter]
[QuickReorderSection]   ← existe, mantém
[🆕 Destaques em Empório — CARROSSEL]   ← NOVO (este)
[removido: grid "Todos os produtos"]
```

O carrossel **substitui** o grid; busca/filtros ficam acessíveis via SearchBar + CategoryFilter no topo e via página `/categorias`.

## 9. Tokens de design (tailwind/shadcn — já no projeto)

- Container: `max-w-7xl px-4 md:px-6`
- Espaço vertical entre seções: `pt-2 pb-4` (match QuickReorder)
- Separator após a seção: `<Separator className="mt-4" />` (consistência com QuickReorder)

## 10. Checklist de entrega UX (done definition)

- [x] Anatomia e hierarquia definidas
- [x] Breakpoints e slides-per-view especificados
- [x] Estados (loading, vazio, erro, <10) cobertos
- [x] Interação (swipe, teclado, click) especificada
- [x] A11y (ARIA, contraste, target size) coberto
- [x] Integração com HomePage descrita
- [x] Reuso explícito de ProductCard/Skeleton

## 11. Entregas para LV-113 (ARCH)

Esta spec orienta as decisões de LV-113:
- **Lib recomendada:** `embla-carousel-react` — melhor a11y nativa, bundle menor (~6kb), API declarativa, sem CSS obrigatório. Alternativas: `keen-slider` (bom), `swiper` (pesado/overkill aqui).
- **API sugerida:**
  ```ts
  interface ProductCarouselProps {
    categoryId: string
    limit?: number // default 10
    title?: string // default "Destaques"
  }
  ```
- **Fonte de dados:** reusar `getProducts({ categoryId, limit })` — ajustar service se não aceita `limit`.

---

_Doc gerado como deliverable da task LV-112. Próximo passo: LV-113 (ARCH) com base neste doc._
