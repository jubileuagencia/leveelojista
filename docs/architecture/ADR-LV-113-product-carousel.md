# ADR — Product Carousel (novob2b)

- **ID:** ADR-LV-113
- **Status:** Accepted
- **Data:** 2026-04-14
- **Autor:** Aria (Architect)
- **Contexto:** LV-113 / novob2b (Levee)
- **Input:** UX Spec `docs/ux-specs/LV-112-product-carousel-home.md`

---

## 1. Contexto

Vamos substituir o grid de "Todos os produtos" na HomePage por um carrossel de **10 produtos** de uma **categoria fixa** (`Empório` — `0c8e7bfb-afc1-40ca-9a89-e8ad087e6a60`, 244 produtos).

A UX (LV-112) exige:
- Scroll-snap nativo, peek mobile (1.5 slides), desktop 4 slides
- Sem autoplay, setas só em desktop (overlay hover)
- A11y WCAG AA com `role="region"`, `aria-roledescription="carousel"`, labels por slide
- Reuso de `ProductCard` existente
- Loading (skeleton), vazio (não renderiza), erro (fail silent)

## 2. Decisão 1 — Biblioteca

### Comparativo

| Critério | embla-carousel-react | keen-slider | swiper |
|----------|----------------------|-------------|--------|
| Bundle gzip | **~6 kB** | ~10 kB | ~25 kB |
| A11y nativa | ★★★★★ (roles/labels por slot) | ★★★☆☆ | ★★★★☆ |
| API declarativa React | ★★★★★ | ★★★★☆ | ★★★☆☆ (wrapper) |
| Scroll-snap nativo | ✔ | ✔ | parcial |
| CSS obrigatório | Não (você fornece) | Não | Sim (swiper.css) |
| Mantença | ativa, Vercel-grade | ativa | ativa |
| Features extras | Plugins (autoplay, wheel) sob demanda | parallax, ken burns | muitas (overkill) |
| Compat React 19 | ✔ (tested) | ✔ | ✔ |

### Decisão

**Adotar `embla-carousel-react`.**

Justificativa:
1. **Menor bundle** (–19 kB vs swiper, –4 kB vs keen). Home é rota crítica.
2. **A11y por design**: slides/track expõem refs e slots — conseguimos aplicar `role/aria-*` limpo sem lutar contra a lib.
3. **API hook-first** (`useEmblaCarousel`) casa com o padrão React 19 + hooks do projeto.
4. **Sem CSS imposto**: controlamos 100% via Tailwind (consistência com shadcn existente).
5. **Plugins opt-in**: se um dia quisermos autoplay/wheel/fade, `embla-carousel-autoplay` etc.

### Pacotes

```bash
npm i embla-carousel-react
```
(Sem plugins agora. Se for necessário, avaliar em tasks futuras.)

### Integração com shadcn

O projeto já usa shadcn. shadcn tem um wrapper oficial `Carousel` que internamente usa Embla. **Vamos usar o shadcn `Carousel`** para padronização visual (setas, dots) e evitar reinventar estilos. Comando:

```bash
npx shadcn@latest add carousel
```

Cria `src/components/ui/carousel.tsx` com `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`. Internamente instala `embla-carousel-react`.

## 3. Decisão 2 — API do componente

Componente wrapper `ProductCarousel` em `src/features/catalog/components/ProductCarousel.tsx` encapsula: fetch, estado loading/empty, setas responsivas, a11y, reuso de `ProductCard`.

### Assinatura TypeScript

```ts
export interface ProductCarouselProps {
  /** UUID da categoria a exibir. Obrigatório. */
  categoryId: string
  /** Título da seção. Default: "Destaques". */
  title?: string
  /** Máximo de produtos. Default: 10. */
  limit?: number
  /** Link opcional "Ver todos" exibido no header. */
  viewAllHref?: string
  /** Ícone opcional à esquerda do título. Default: Sparkles. */
  icon?: LucideIcon
  /** Callback quando usuário clica num card (override da navegação). */
  onProductClick?: (productId: string) => void
}
```

### Comportamento interno

- Usa hook dedicado `useFeaturedProducts(categoryId, limit)` (ver Decisão 3)
- Se `products.length === 0` (após carregamento): **retorna `null`** — seção somem
- Se `loading`: renderiza `N skeletons` (N = maior slidesPerView, 4)
- Se `error`: `console.error` + retorna `null` (fail silent conforme UX)
- `slidesPerView` via Embla `breakpoints` (nativo da lib): `default 1.5 / sm 2.5 / md 3 / lg 4`
- Setas (via `CarouselPrevious`/`CarouselNext`) só aparecem em `md:flex` (CSS), desabilitadas nas bordas
- Wrapper: `<section aria-label="{title}" role="region" aria-roledescription="carousel">`
- Cada `CarouselItem`: `role="group" aria-roledescription="slide" aria-label="Produto X de N"`

### Exemplo de uso (LV-115)

```tsx
import { ProductCarousel } from '@/features/catalog/components/ProductCarousel'

const FEATURED_CATEGORY_ID = import.meta.env.VITE_FEATURED_CATEGORY_ID
  ?? '0c8e7bfb-afc1-40ca-9a89-e8ad087e6a60' // Empório

<ProductCarousel
  categoryId={FEATURED_CATEGORY_ID}
  title="Destaques em Empório"
  viewAllHref={`/?categoria=${FEATURED_CATEGORY_ID}`}
  limit={10}
/>
```

## 4. Decisão 3 — Fonte de dados

### Opções avaliadas

| Opção | Prós | Contras |
|-------|------|---------|
| A) Reusar `getProducts({ categoryId })` + `slice(0,10)` no componente | Zero mudança no service | Traz 244 produtos só pra cortar 10 — desperdício de rede |
| B) **Adicionar `limit` em `getProducts`** (opcional) | Mínima mudança no service, reusa todo o pipeline (filtros, joins, ordenação) | Precisa editar `getProducts` |
| C) Criar `getFeaturedProducts(categoryId, limit)` novo | Isola responsabilidade | Duplica lógica de join/filter |

### Decisão

**Opção B — estender `getProducts` com `limit` opcional.**

Por quê:
- `getProducts` já tem toda a lógica de join, filtros ativos, deleted_at, ordering. Reusar é barato.
- Adicionar `.limit(n)` no Supabase é uma linha.
- Evita duplicação (DRY) — se amanhã mudar a semântica de "produto ativo", muda em um lugar.
- Ordenação default (`name asc`) é aceitável para "destaques"; **quando existir campo `is_featured` em produtos ou ordenação por popularidade, migrar para `getFeaturedProducts` dedicado.**

### Patch proposto em `products.ts` (para LV-114 implementar)

```ts
interface ProductFilters {
  categoryId?: string
  search?: string
  isActive?: boolean
  limit?: number
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, categories(*), variants:product_variants(*)')
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (filters?.isActive !== false) query = query.eq('is_active', true)
  if (filters?.categoryId) query = query.eq('category_id', filters.categoryId)
  if (filters?.search) query = query.ilike('name', `%${filters.search}%`)
  if (filters?.limit) query = query.limit(filters.limit)

  const { data, error } = await query
  if (error) { /* idem */ }
  return (data as Product[]) ?? []
}
```

### Hook `useFeaturedProducts`

Encapsula fetch + loading/error para uso pelo componente:

```ts
// src/features/catalog/hooks/useFeaturedProducts.ts
export function useFeaturedProducts(categoryId: string, limit = 10) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getProducts({ categoryId, limit })
      .then((data) => { if (mounted) setProducts(data) })
      .catch((e) => { if (mounted) setError(e) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [categoryId, limit])

  return { products, loading, error }
}
```

**Nota:** projeto já usa `@tanstack/react-query` (detectado em `package.json`). Se a LV-114 quiser, pode usar `useQuery(['featured-products', categoryId, limit], …)` em vez de useState/useEffect. Ambos aceitáveis — deixo a escolha ao @frontend-lead.

## 5. Impacto em consumidores

| Consumidor | Impacto |
|-----------|---------|
| `HomePage.tsx` | Altera em LV-115 — troca grid por `<ProductCarousel/>` |
| `getProducts` outros callers | Zero breaking — `limit` é opcional |
| Bundle | +~7 kB gzipped (embla + shadcn wrapper) — aceitável em rota home |
| Acessibilidade | Melhora — carousel ganha ARIA correto vs grid genérico |

## 6. Riscos e mitigação

| Risco | Mitigação |
|-------|-----------|
| `embla` quebrar com React 19 | Testado upstream; se falhar, fallback para scroll-snap nativo CSS-only (fallback gracioso documentado) |
| Multi-categoria (LV-117+) mudar `getProducts` | `ProductCarousel` não depende de schema single-category — recebe produtos já filtrados |
| Categoria fixa em env var sumindo | Default hardcoded para Empório no componente de integração (LV-115) |

## 7. Rollback

1. Reverter commit que adiciona `<ProductCarousel/>` na `HomePage.tsx`
2. Grid volta
3. Opcional: remover pacote `embla-carousel-react` se ninguém mais consumir

## 8. Next steps

- **LV-114 (DEV)**: implementar `ProductCarousel.tsx` + `useFeaturedProducts.ts` + patch `getProducts` conforme este ADR
- **LV-115 (DEV)**: consumir na `HomePage.tsx` + expor env var `VITE_FEATURED_CATEGORY_ID`
- **LV-116 (QA)**: validar com spec de LV-112 em mãos
