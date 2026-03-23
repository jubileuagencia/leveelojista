# UX Spec — CategoriesPage (`/categorias`)

**Agente:** @ux-design-expert (Uma)
**Data:** 2026-03-23
**Tarefa:** C4.1
**Status:** Spec pronto para implementacao

---

## 1. Objetivo da Pagina

Permitir que o usuario visualize todas as categorias de produtos disponveis e navegue rapidamente para os produtos de cada categoria. E o hub central de descoberta por categoria.

**Usuarios:** Lojistas (B2B) que compram produtos em quantidade. Precisam encontrar categorias rapidamente, especialmente no mobile durante visitas ao deposito.

---

## 2. Layout & Wireframe

### Mobile (< 768px)

```
+----------------------------------+
|  <- Categorias                   |   <- Header com back button
+----------------------------------+
|  [Buscar categoria...]           |   <- Search input (opcional, se > 8 categorias)
+----------------------------------+
|                                  |
|  +--------+  +--------+         |
|  | icon   |  | icon   |         |   <- Grid 2 colunas
|  | Nome   |  | Nome   |         |
|  | (12)   |  | (45)   |         |   <- Contagem de produtos
|  +--------+  +--------+         |
|                                  |
|  +--------+  +--------+         |
|  | icon   |  | icon   |         |
|  | Nome   |  | Nome   |         |
|  | (8)    |  | (23)   |         |
|  +--------+  +--------+         |
|                                  |
|  +--------+  +--------+         |
|  | ...    |  | ...    |         |
|  +--------+  +--------+         |
|                                  |
+----------------------------------+
|  Inicio | Categ | Cart | Ped | P |   <- BottomNav (Categ ativo)
+----------------------------------+
```

### Tablet (768px — 1024px)

```
+----------------------------------------------+
|  <- Categorias                               |
+----------------------------------------------+
|  +--------+  +--------+  +--------+         |
|  | icon   |  | icon   |  | icon   |         |   <- Grid 3 colunas
|  | Nome   |  | Nome   |  | Nome   |         |
|  | (12)   |  | (45)   |  | (8)    |         |
|  +--------+  +--------+  +--------+         |
|  ...                                         |
+----------------------------------------------+
```

### Desktop (> 1024px)

```
+---+----------------------------------------------+
| S |  Categorias                                   |   <- Sidebar (Categ ativo) + conteudo
| i |                                               |
| d |  +--------+  +--------+  +--------+  +----+  |
| e |  | icon   |  | icon   |  | icon   |  |icon|  |   <- Grid 4 colunas
| b |  | Nome   |  | Nome   |  | Nome   |  |Nome|  |
| a |  | (12)   |  | (45)   |  | (8)    |  |(23)|  |
| r |  +--------+  +--------+  +--------+  +----+  |
|   |  ...                                          |
+---+----------------------------------------------+
```

---

## 3. Componente: CategoryCard

Cada categoria e representada por um card clicavel.

### Estrutura

```
+---------------------------+
|                           |
|       [icon/emoji]        |   <- Icone da categoria (campo `icon`) ou fallback Grid3X3
|         size-8            |   <- Grande, centralizado
|                           |
|     Nome da Categoria     |   <- `name`, font-medium, text-sm, line-clamp-2
|         (42 produtos)    |   <- Contagem, text-xs, text-muted-foreground
|                           |
+---------------------------+
```

### Especificacoes Visuais

| Propriedade | Valor |
|-------------|-------|
| Container | `rounded-xl border bg-card hover:shadow-md hover:border-primary/20 transition-all cursor-pointer` |
| Padding | `p-4 sm:p-6` |
| Alinhamento | `flex flex-col items-center justify-center text-center` |
| Gap interno | `gap-2` |
| Icone container | `flex size-12 items-center justify-center rounded-full bg-primary/5` |
| Icone | Emoji do campo `icon` em `text-2xl`, ou `<Grid3X3 className="size-6 text-primary/60" />` como fallback |
| Nome | `text-sm font-medium text-foreground line-clamp-2` |
| Contagem | `text-xs text-muted-foreground` — formato: "(N produtos)" ou "(N produto)" |
| Hover | `hover:shadow-md hover:border-primary/20` — consistente com ProductCard |
| Aspect ratio | Nenhum forcado — altura natural pelo conteudo |
| Min height | `min-h-[120px]` para uniformidade visual |

### Cor da Categoria

O campo `color` da categoria (se existir) pode ser usado como accent no icone container:
- Se `color` presente: `bg-{color}/10` no container do icone
- Se `color` ausente: `bg-primary/5` (fallback padrao)

---

## 4. Fluxo de Navegacao

### Ao clicar numa categoria:

**Opcao recomendada:** Navegar para `/?categoria={categoryId}`

Justificativa:
- A HomePage ja tem `CategoryFilter` que filtra por categoria
- Reutiliza toda a infra existente (grid, ProductCard, paginacao)
- Evita criar uma pagina duplicada de listagem de produtos
- O usuario ja conhece o layout da home

Implementacao:
```
navigate(`/?categoria=${category.id}`)
```

A HomePage deve ler o searchParam `categoria` e pre-selecionar no `CategoryFilter`.

---

## 5. Estados

### Loading

```
+--------+  +--------+
| ~~~~~~ |  | ~~~~~~ |   <- Skeleton cards com animate-pulse
| ~~~~~~ |  | ~~~~~~ |   <- Mesmo grid da pagina
| ~~~~~~ |  | ~~~~~~ |
+--------+  +--------+
+--------+  +--------+
| ~~~~~~ |  | ~~~~~~ |
| ~~~~~~ |  | ~~~~~~ |
+--------+  +--------+
```

- 6 skeleton cards (2x3 mobile, 3x2 tablet, 4+2 desktop)
- Skeleton: `rounded-xl bg-muted animate-pulse min-h-[120px]`

### Empty (sem categorias)

```
+----------------------------------+
|                                  |
|         [Grid3X3 icon]           |   <- size-16 rounded-full bg-muted
|                                  |
|   Nenhuma categoria disponivel   |   <- text-lg font-semibold
|   Os produtos serao organizados  |   <- text-sm text-muted-foreground
|   em categorias em breve.        |
|                                  |
|      [Ver todos os produtos]     |   <- Button outline, navega para /
|                                  |
+----------------------------------+
```

### Erro

```
+----------------------------------+
|                                  |
|        [AlertTriangle]           |
|                                  |
|   Erro ao carregar categorias    |
|   Tente novamente em instantes.  |
|                                  |
|         [Tentar novamente]       |   <- Button outline, refetch
|                                  |
+----------------------------------+
```

---

## 6. Header da Pagina

### Mobile
- Back button (`ArrowLeft`) + titulo "Categorias"
- Consistente com ProfilePage (C5) e padrao de paginas internas

### Desktop
- Apenas titulo "Categorias" (sidebar ja tem navegacao)
- Subtitulo opcional: `text-sm text-muted-foreground` — "Explore nossos produtos por categoria"

---

## 7. Contagem de Produtos

Para mostrar a contagem de produtos por categoria, duas opcoes:

**Opcao A (simples):** Nao mostrar contagem — apenas nome + icone. Mais limpo, sem query extra.

**Opcao B (recomendada):** Mostrar contagem. Requer uma query adicional ou RPC que retorne count por category_id.

Se a contagem nao estiver disponivel no momento, implementar sem ela (Opcao A) e adicionar depois como melhoria.

---

## 8. Responsividade

| Breakpoint | Grid | Gap | Padding |
|------------|------|-----|---------|
| Mobile (< 640px) | `grid-cols-2` | `gap-3` | `px-4 py-6` |
| SM (640px) | `grid-cols-2` | `gap-3` | `px-4 py-6` |
| MD (768px) | `grid-cols-3` | `gap-4` | `px-6 py-6` |
| LG (1024px) | `grid-cols-4` | `gap-4` | `px-6 py-6` |

Container: `mx-auto max-w-5xl`

---

## 9. Acessibilidade

- Cards devem ser `<a>` ou `<Link>` (nao div com onClick) para navegacao por teclado
- `aria-label="Ver produtos da categoria {name}"`
- Focus visible ring: `focus-visible:ring-2 focus-visible:ring-primary`
- Contagem de produtos com `aria-description="{N} produtos disponiveis"`
- Titulo da pagina: `<h1>` semantico

---

## 10. Decisoes de Design

| Decisao | Escolha | Motivo |
|---------|---------|--------|
| Layout | Grid de cards | Visual, escaneavel, consistente com HomePage |
| Navegacao ao clicar | `/?categoria={id}` | Reutiliza infra existente da HomePage |
| Icone | Emoji do campo `icon` | Ja existe na base, visual imediato |
| Contagem | Opcional (implementar sem) | Evita query extra na v1 |
| Search | Nao na v1 | Poucas categorias (~10-15), desnecessario |
| Ordenacao | Alfabetica (ASC) | Ja vem assim do `getCategories()` |
| Aspect ratio | Livre (min-h) | Cards com nomes variados ficam uniformes |

---

## 11. Componentes shadcn/ui Utilizados

- `Card` (ou div estilizado) — container do CategoryCard
- `Skeleton` — loading state
- `Button` — back button, empty state CTA

---

## 12. Handoff para @dev (C4.2)

**Arquivos a criar:**
- `src/features/catalog/pages/CategoriesPage.tsx`

**Arquivos a modificar:**
- `src/App.tsx` — adicionar rota `/categorias`
- `src/features/catalog/pages/HomePage.tsx` — ler searchParam `categoria` para pre-selecionar filtro (se nao existir)

**Service existente:**
- `getCategories()` em `src/features/catalog/services/products.ts`

**Padrao de referencia:**
- Layout: similar a `ProfilePage.tsx` (header com back + conteudo)
- Grid: mesmo padrao de `HomePage.tsx` (grid-cols-2 md:3 lg:4 gap-3)
- Loading: mesmo padrao de `ProductCardSkeleton`
- Empty state: mesmo padrao de HomePage empty state

---

*— Uma, desenhando com empatia*
