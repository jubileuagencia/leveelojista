# Categorias Destaque na Home + CategoriesPage com Tabs

**Data:** 2026-03-23
**Origem:** Redesign de navegacao por categorias (C4 v3)
**Branch:** `feature/fase-5-fundacao`
**Revisado por:** @aios-master (Orion) — 2026-03-23

---

## Resumo

Duas mudancas conectadas:

1. **HomePage** — O `CategoryFilter` (chips horizontais) mostra apenas categorias marcadas como **destaque** pelo admin, nao todas. Link "Ver todas as categorias" leva para `/categorias`.
2. **CategoriesPage (`/categorias`)** — Redesenhada com **tabs** (estilo Ze Delivery): cada tab e uma categoria, ao selecionar mostra os produtos daquela categoria direto na pagina.

---

## Parte 1 — Migration: campo `is_featured`

### Responsavel: @data-engineer
### Escopo: APENAS SQL (migration + aplicar no Supabase)

### Migration SQL

**Arquivo a criar:** `supabase/migrations/016_categories_featured.sql`

```sql
-- ============================================================================
-- Migration 016: Campo is_featured em categories
-- ============================================================================
-- Permite ao admin marcar categorias como destaque para exibir na Home
-- Agente: @data-engineer | Data: 2026-03-23
-- ============================================================================

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

-- Backfill: marcar as primeiras 5 categorias (por sort_order) como destaque
UPDATE categories
SET is_featured = true
WHERE id IN (
  SELECT id FROM categories
  ORDER BY sort_order ASC, name ASC
  LIMIT 5
);
```

- [ ] Migration criada
- [ ] Migration aplicada no Supabase

---

## Parte 2 — Frontend: tipo TypeScript + service cliente

### Responsavel: @dev
### Depende de: Parte 1

### Atualizar tipo TypeScript

**Arquivo:** `src/types/database.ts`

Adicionar `is_featured` e `sort_order` a interface `Category`:

```typescript
export interface Category {
  id: string
  name: string
  icon: string | null
  color: string | null
  sort_order: number       // NOVO — ja existe no banco (migration 003)
  is_featured: boolean     // NOVO — migration 016
  created_at: string
}
```

### Novo service (cliente)

**Arquivo:** `src/features/catalog/services/products.ts`

Adicionar funcao `getFeaturedCategories()`:

```typescript
export async function getFeaturedCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Falha ao buscar categorias destaque: ${error.message}`)
  }
  return data ?? []
}
```

- [ ] Tipo atualizado
- [ ] Service criado

---

## Parte 3 — Admin: Toggle "Destaque" no CRUD de Categorias

### Responsavel: @dev
### Depende de: Parte 2

### CategoryFormModal — Adicionar switch `is_featured`

**Arquivo:** `src/features/admin/components/CategoryFormModal.tsx`

- Adicionar campo `is_featured` (boolean) ao schema Zod: `is_featured: z.boolean().default(false)`
- Renderizar como `<Switch>` abaixo dos campos existentes
- Label: "Exibir como destaque na Home"
- Default: `false` para novas categorias, valor atual para edicao

### CategoriesTable — Mostrar badge "Destaque"

**Arquivo:** `src/features/admin/components/CategoriesTable.tsx`

- Adicionar badge `Star` (icone estrela amarela) ao lado do nome das categorias marcadas como destaque
- Ou coluna dedicada com icone

### Admin Service — Incluir `is_featured` no create/update

**Arquivo:** `src/features/admin/services/categories.ts`

- `CreateCategoryData`: adicionar `is_featured?: boolean`
- `UpdateCategoryData`: adicionar `is_featured?: boolean`

- [ ] Switch no form
- [ ] Badge na tabela
- [ ] Service atualizado

---

## Parte 4 — HomePage: Apenas categorias destaque + link "Ver todas"

### Responsavel: @dev
### Depende de: Parte 2
### Nota: Esta parte agrupa as mudancas na HomePage (chips + link). Sao dois ajustes no mesmo arquivo.

### Mudanca 1 — CategoryFilter usa apenas destaques

**Arquivo:** `src/features/catalog/pages/HomePage.tsx`

Trocar no `loadCategories`:
```typescript
// ANTES
const data = await getCategories()

// DEPOIS
const data = await getFeaturedCategories()
```

Adicionar import:
```typescript
import { getFeaturedCategories } from '@/features/catalog/services/products'
```

O chip "Todos" continua como primeiro item. Os chips mostram apenas categorias que o admin marcou como destaque.

### Mudanca 2 — Link "Ver todas as categorias"

Abaixo do `<CategoryFilter>`, adicionar link:

```tsx
<div className="flex items-center justify-between">
  <CategoryFilter ... />
  <Link
    to="/categorias"
    className="shrink-0 text-xs text-primary hover:underline"
  >
    Ver todas →
  </Link>
</div>
```

Isso conecta a Home (so destaques) com a CategoriesPage (tudo com tabs).

- [ ] Chips so destaques
- [ ] Link "Ver todas"

---

## Parte 5 — CategoriesPage com Tabs (v3)

### Responsavel: @dev
### Depende de: Parte 2
### Nota: REESCREVER o arquivo `CategoriesPage.tsx` atual (v1 com grid de cards). O codigo antigo sera totalmente substituido.

### Redesenhar `CategoriesPage.tsx`

**Arquivo:** `src/features/catalog/pages/CategoriesPage.tsx` (reescrever completo)

Layout com tabs (estilo Ze Delivery):

```
+----------------------------------+
|  <- Explorar                     |
+----------------------------------+
| Todos | Frutas | Verduras | Car→ |   <- Tabs scrollaveis (TODAS as categorias)
+======+===========================+
|                                  |
|  Frutas  ·  38 produtos          |   <- Titulo da tab ativa
|                                  |
|  +--------+  +--------+         |   <- Grid de ProductCards
|  | Maca   |  | Laranja |         |
|  | R$4,50 |  | R$3,20  |         |
|  | [+]    |  | [+]     |         |
|  +--------+  +--------+         |
+----------------------------------+
```

### Comportamento

| Aspecto | Detalhe |
|---------|---------|
| **Tab "Todos"** | Primeira tab, mostra todos os produtos |
| **Cada categoria** | Uma tab, carrega produtos daquela categoria via `getProducts({ categoryId })` |
| **Tab ativa** | Underline `primary` (2px), font bold |
| **Tab inativa** | `text-muted-foreground` |
| **Sticky** | Tabs fixas abaixo do header ao rolar |
| **URL** | `?categoria={id}` — permite deep link e back funcionar |
| **Emoji** | Mostrar `category.icon` antes do nome na tab, se existir |
| **Grid** | Mesmo `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3` da HomePage |
| **ProductCard** | Reutilizar `ProductCard` e `ProductCardSkeleton` de `@/features/catalog/components/ProductCard` |
| **Loading** | 8x `ProductCardSkeleton` |
| **Empty** | "Nenhum produto nesta categoria" com CTA "Ver todos" (seleciona tab "Todos") |
| **Erro** | "Erro ao carregar" com botao "Tentar novamente" |

### Spec visual das Tabs

```
/* Container */
sticky top-[3.5rem] md:top-[4rem] z-10 bg-background border-b

/* Scroll */
flex overflow-x-auto scrollbar-hide gap-0

/* Tab base */
shrink-0 px-4 py-3 text-sm font-medium transition-colors relative min-h-[44px]

/* Tab ativa */
text-primary font-semibold
after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary

/* Tab inativa */
text-muted-foreground hover:text-foreground
```

### Dados

- Tabs: `getCategories()` — TODAS as categorias (nao apenas destaques)
- Produtos: `getProducts({ categoryId })` — service ja existe
- Tab inicial: ler `searchParams.get('categoria')` — se presente, pre-selecionar

### Acessibilidade

- Tabs como `<button>` com `role="tab"` e `aria-selected`
- Container com `role="tablist"`
- Panel com `role="tabpanel"`
- Focus visible ring em todas as tabs

- [ ] Concluida

---

## Resumo de Arquivos

| Arquivo | Acao | Parte | Agente |
|---------|------|-------|--------|
| `supabase/migrations/016_categories_featured.sql` | Criar | 1 | @data-engineer |
| `src/types/database.ts` | Editar (add `is_featured`, `sort_order`) | 2 | @dev |
| `src/features/catalog/services/products.ts` | Editar (add `getFeaturedCategories`) | 2 | @dev |
| `src/features/admin/components/CategoryFormModal.tsx` | Editar (add Switch) | 3 | @dev |
| `src/features/admin/components/CategoriesTable.tsx` | Editar (add badge) | 3 | @dev |
| `src/features/admin/services/categories.ts` | Editar (add `is_featured`) | 3 | @dev |
| `src/features/catalog/pages/HomePage.tsx` | Editar (destaques + link) | 4 | @dev |
| `src/features/catalog/pages/CategoriesPage.tsx` | Reescrever (tabs v3) | 5 | @dev |

---

## Ordem de Execucao

```
Parte 1 (@data-engineer):  Migration SQL                          (pre-requisito)
Parte 2 (@dev):             Tipo TS + service getFeaturedCategories (depende de 1)
Parte 3 (@dev):             Admin toggle destaque                   (depende de 2)
Parte 4 (@dev):             Home so destaques + link "Ver todas"    (depende de 2)
Parte 5 (@dev):             CategoriesPage tabs                     (depende de 2)
```

Partes 3, 4 e 5 podem rodar em paralelo apos Parte 2.
