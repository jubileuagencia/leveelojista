# Revisão Arquitetural - Admin Panel novob2b

**Projeto**: novob2b (Plataforma B2B E-commerce)
**Autor**: @architect (Synkra AIOS)
**Data**: 2026-02-25
**Stack**: React 19 + TypeScript + Vite 7 + Tailwind 4 + shadcn/ui + Supabase + Zustand + Zod

---

## 1. Resumo da Arquitetura Atual

### 1.1 O Que Está Bem

**Organização feature-based consistente**: O projeto segue uma estrutura clara de features em `src/features/`, onde cada feature (auth, catalog, cart, checkout, favorites, orders, search) possui sua própria pasta com subdivisões para `components/`, `pages/`, `services/`, `hooks/` e `stores/`. Este padrão está bem consolidado e deve ser mantido.

**Separação de responsabilidades**:
- **Services** (`features/*/services/`): Funções puras async que encapsulam chamadas ao Supabase. Retornam dados tipados e lançam erros com mensagens claras. Nenhum acoplamento com UI.
- **Stores** (`stores/` e `features/*/stores/`): Zustand stores com interface limpa separando estado de ações. Utilizam optimistic updates de forma consistente (`cart-store.ts`, `favorites-store.ts`).
- **Pages** (`features/*/pages/`): Componentes de página que orquestram dados com `useState`/`useEffect` e delegam rendering para componentes menores.
- **Components** (`features/*/components/`): Componentes de UI reutilizáveis dentro da feature.

**Padrão de serviços bem definido**: Cada service file exporta funções nomeadas (não classes), recebe parâmetros simples e retorna `Promise` tipada. O padrão `getProducts(filters)`, `getUserOrders(userId, page, pageSize)`, `createOrder(params)` é consistente e fácil de seguir.

**Tipagem sólida**: O arquivo `src/types/database.ts` define todas as interfaces do banco (Profile, Product, Category, Order, OrderItem, etc.) incluindo tipos discriminados (`UserRole`, `UserTier`, `OrderStatus`, `PaymentMethod`, `ProductUnit`) e um tipo `Database` para o client Supabase. Já possui inclusive a RPC `get_admin_clients` definida na interface.

**Layout admin já preparado**: O `AdminLayout.tsx` já possui sidebar colapsável com 7 itens de navegação (Dashboard, Produtos, Pedidos, Clientes, Categorias, Relatórios, Configurações), autenticação de admin com redirect, top bar com título dinâmico via `getPageTitle()`, e suporte a `<Outlet />` para rotas filhas.

**Componentes UI padronizados**: shadcn/ui já configurado com Button, Card, Dialog, Badge, Select, Input, Label, Sheet, Tabs, Tooltip, Skeleton, ScrollArea, Separator, Sonner (toast), Command, Popover, DropdownMenu, Avatar.

**Libs prontas para usar**: `@tanstack/react-query` já está no `package.json` mas NÃO está sendo usada no lado cliente. `zod` também está presente mas sem uso atual. Ambas devem ser aproveitadas pelo admin.

**Optimistic updates**: Os stores de cart e favorites implementam optimistic update com rollback em caso de erro. Padrão maduro que pode ser referência.

**Lazy loading**: Todas as pages são lazy-loaded com `React.lazy()` e `Suspense` com fallback.

### 1.2 O Que Pode Melhorar

**React Query não utilizado**: Todas as pages fazem fetch manual com `useState` + `useEffect` + `useCallback`. Isso resulta em código boilerplate repetido para loading, error handling, e refetch. O admin deve adotar React Query desde o início.

**Ausência de validação com Zod nos forms**: O lado cliente não possui forms complexos. O admin vai precisar de forms robustos com validação -- Zod já está disponível.

**Error handling inconsistente**: Alguns services lançam `throw new Error(...)` com mensagens customizadas (products.ts, favorites.ts), outros fazem `throw error` direto do Supabase (checkout.ts). Algumas pages fazem `toast.error()`, outras `console.error` silencioso. O admin deve padronizar: sempre `throw new Error(mensagem_pt)` nos services e `toast.error()` nas pages/mutations.

**Sem paginação server-side padronizada**: Apenas `orders.ts` implementa paginação com `range(from, to)` + `{ count: 'exact' }`. Products carrega tudo sem limite. O admin precisa de um padrão unificado `PaginatedResult<T>`.

**Sem componente de tabela**: O lado cliente usa Cards e Grid. O admin precisa de tabelas de dados com sort, filter, paginação.

**Supabase client sem tipagem genérica**: O `createClient` em `supabase.ts` não usa `createClient<Database>(...)`. Deveria.

---

## 2. Padrões a Seguir

### 2.1 Padrão de Service

Seguir o padrão existente: funções nomeadas exportadas, interface de filtros explícita, resultado paginado com `PaginatedResult<T>`, error handling com `console.error` + `throw new Error` com mensagem em português, usar `{ count: 'exact' }` para paginação.

### 2.2 Padrão de Store (Feature-Scoped)

Stores de admin devem guardar apenas estado de UI (filtros, paginação, seleção). Dados do servidor ficam no React Query. Reset de página automático ao mudar filtros. Naming: `useAdmin*Store`.

### 2.3 Padrão de Page com React Query

Pages devem combinar: store de filtros (Zustand) + query de dados (React Query) + DataTable genérico. Mutations com `toast.success`/`toast.error` para feedback.

### 2.4 Padrão de Components

Named exports, Skeleton components junto do principal, props via interface, `cn()` para classes condicionais, Lucide icons, formatação via `src/lib/format.ts`.

### 2.5 Padrão de Routing

Todas as pages admin lazy-loaded, rotas filhas dentro de `<AdminLayout />` que já provê autenticação.

---

## 3. Estrutura Recomendada para Admin

```
src/features/admin/
├── components/
│   ├── shared/
│   │   ├── DataTable.tsx
│   │   ├── DataTablePagination.tsx
│   │   ├── DataTableToolbar.tsx
│   │   ├── FormModal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── StatusSelect.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── StatCard.tsx
│   │   ├── EmptyState.tsx
│   │   └── PageHeader.tsx
│   ├── dashboard/
│   │   ├── RevenueChart.tsx
│   │   ├── RecentOrders.tsx
│   │   ├── TopProducts.tsx
│   │   └── KPICards.tsx
│   ├── products/
│   │   ├── ProductColumns.tsx
│   │   ├── ProductForm.tsx
│   │   └── ProductFilters.tsx
│   ├── orders/
│   │   ├── OrderColumns.tsx
│   │   ├── OrderStatusUpdate.tsx
│   │   ├── OrderDetails.tsx
│   │   └── OrderFilters.tsx
│   ├── clients/
│   │   ├── ClientColumns.tsx
│   │   ├── ClientForm.tsx
│   │   ├── ClientDetails.tsx
│   │   └── ClientFilters.tsx
│   ├── categories/
│   │   ├── CategoryColumns.tsx
│   │   ├── CategoryForm.tsx
│   │   └── CategoryCard.tsx
│   └── settings/
│       ├── TierDiscountsForm.tsx
│       ├── GeneralSettings.tsx
│       └── SettingsSection.tsx
├── hooks/
│   ├── use-admin-products.ts
│   ├── use-admin-orders.ts
│   ├── use-admin-clients.ts
│   ├── use-admin-categories.ts
│   ├── use-admin-stats.ts
│   └── use-image-upload.ts
├── pages/
│   ├── DashboardPage.tsx
│   ├── ProductsPage.tsx
│   ├── OrdersPage.tsx
│   ├── OrderDetailPage.tsx
│   ├── ClientsPage.tsx
│   ├── ClientDetailPage.tsx
│   ├── CategoriesPage.tsx
│   ├── ReportsPage.tsx
│   └── SettingsPage.tsx
├── services/
│   ├── admin-products.ts
│   ├── admin-orders.ts
│   ├── admin-clients.ts
│   ├── admin-categories.ts
│   ├── admin-stats.ts
│   ├── admin-config.ts
│   └── admin-storage.ts
├── stores/
│   ├── admin-products-store.ts
│   ├── admin-orders-store.ts
│   └── admin-clients-store.ts
└── schemas/
    ├── product-schema.ts
    ├── category-schema.ts
    ├── client-schema.ts
    └── config-schema.ts
```

**Atualizações em arquivos existentes:**
- `src/App.tsx` — adicionar rotas admin lazy-loaded
- `src/lib/supabase.ts` — tipar client com `createClient<Database>(...)`
- `src/lib/query-client.ts` — [NOVO] configuração do QueryClient
- `src/main.tsx` — wrap com QueryClientProvider
- `src/types/database.ts` — adicionar `PaginatedResult<T>`

---

## 4. Recomendações Técnicas

### 4.1 Gestão de Estado

**Modelo híbrido React Query + Zustand**:
- React Query para TODO dado do servidor (cache, refetch, loading/error, invalidation pós-mutation)
- Zustand (feature-scoped) para estado de UI (filtros, paginação, modal state)
- QueryClient com `staleTime: 30_000`, `gcTime: 300_000`, `retry: 1`, `refetchOnWindowFocus: true`
- Hooks: `useAdminProducts()`, `useCreateProduct()`, `useUpdateProduct()`, `useDeleteProduct()` — cada um usando `useQuery`/`useMutation` com `toast` feedback e `invalidateQueries` automático

### 4.2 Paginação

Paginação server-side padronizada:
- Interface `PaginatedResult<T>` com `data: T[]` e `totalCount: number`
- Todas as queries de lista usando `range(from, to)` + `{ count: 'exact' }`
- Componente `DataTablePagination` com prev/next, page info, page size selector
- Default: 20 itens/página, opções: 10, 20, 50

### 4.3 Filtros e Busca

- Search input com debounce de 300ms
- Filtros específicos por feature em componentes `*Filters.tsx`
- Store Zustand como fonte de verdade para filtros (queryKey do React Query inclui filtros)
- Reset automático de página ao mudar filtros
- Botão "Limpar filtros" em cada toolbar

### 4.4 Upload de Imagens (Supabase Storage)

- Service `admin-storage.ts`: validação client-side (tipo, tamanho 2MB max), upload com UUID como nome, retorno de URL pública
- Hook `use-image-upload.ts`: estado de upload (uploading, preview), `URL.createObjectURL` para preview instantâneo
- Componente `ImageUpload.tsx`: drag & drop (react-dropzone), preview, botão remover/substituir, loading indicator
- Pré-requisito: bucket `product-images` no Supabase Storage com policies para admin

### 4.5 Tabelas de Dados

- **TanStack Table v8** (`@tanstack/react-table`): headless, usa shadcn/ui para UI, sort/filter/pagination/row selection
- Componente `DataTable<TData>` genérico com props: `columns`, `data`, `isLoading`, `emptyMessage`
- Definições de colunas em arquivos separados: `ProductColumns.tsx`, `OrderColumns.tsx`, etc.
- Funções factory `getProductColumns({ onEdit, onDelete })` para injeção de callbacks de ação
- Coluna de ações com ícones Pencil e Trash2 (Lucide)
- Skeleton loading para tabela

### 4.6 Formulários

- **react-hook-form + @hookform/resolvers + Zod**: mínimo re-renders, validação type-safe
- Schemas em `schemas/*.ts`: `productSchema`, `categorySchema`, `clientSchema`, `configSchema`
- Usar `z.coerce.number()` para campos numéricos de forms HTML
- Components de form reutilizáveis com `defaultValues` opcionais para modo edit
- Erro de validação exibido abaixo de cada campo com `text-destructive`

### 4.7 Modais (Padrão CRUD Modal)

- Estado discriminado: `{ open: false } | { open: true; mode: 'create' } | { open: true; mode: 'edit'; data: T }`
- Componente `FormModal` reutilizável baseado em shadcn/ui Dialog
- `ConfirmDialog` separado para ações destrutivas (delete) com variant `destructive`
- Form renderizado dentro do modal, mutation feedback via toast

---

## 5. Dependências Sugeridas

### Novas (instalar)

| Pacote | Justificativa |
|--------|---------------|
| `@tanstack/react-table` ^8.x | DataTable headless para admin |
| `react-hook-form` ^7.x | Gestão de forms com mínimo re-render |
| `@hookform/resolvers` ^5.x | Bridge react-hook-form <-> Zod |
| `recharts` ^2.x | Gráficos para dashboard e relatórios |
| `react-dropzone` ^14.x | Drag & drop para upload de imagens |

### Já instaladas (usar)

| Pacote | Ação |
|--------|------|
| `@tanstack/react-query` | Finalmente usar — queries e mutations do admin |
| `zod` | Schemas de validação para todos os forms |
| `zustand` | Stores de filtros/UI para cada seção |
| `sonner` | Toast feedback padronizado em todas operações CRUD |
| `cmdk` | Command palette para busca rápida |

### Componentes shadcn/ui a adicionar

```bash
npx shadcn@latest add table textarea switch checkbox calendar alert-dialog form progress
```

---

## 6. Riscos e Mitigações

### 6.1 RLS do Supabase
Criar policies para admin/super_admin em todas as tabelas. A RPC `get_admin_clients` já existe, indicando que o padrão foi considerado. Policy genérico: `USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')))`.

### 6.2 Performance com Listas Grandes
Paginação server-side obrigatória. Default 20/página. Índices no banco para colunas de filtro. `count: 'exact'` com moderação.

### 6.3 Upload de Imagens
Limite 2MB, apenas JPEG/PNG/WebP, preview antes de upload, loading indicator. Considerar resize client-side com Canvas API.

### 6.4 Conflitos de Edição Concorrente
MVP: campo `updated_at` com verificação antes de salvar. Futuro: Supabase Realtime. Com 1-3 admins, conflitos serão raros.

### 6.5 Segurança de Rotas
AdminLayout já verifica role. RLS do Supabase é a camada real de segurança. Nunca confiar apenas no frontend.

### 6.6 Faseamento Recomendado

**Fase 1 (MVP)**: Infraestrutura (QueryClient, DataTable, FormModal) + Produtos (CRUD) + Categorias (CRUD) + Pedidos (listar + mudar status)

**Fase 2 (Gestão)**: Clientes (listar + editar tier/role) + Dashboard (KPIs básicos) + Configurações (tier discounts)

**Fase 3 (Inteligência)**: Relatórios (gráficos) + Filtros avançados (date range, export CSV) + Command palette admin

### 6.7 Soft Delete e Integridade
Produtos: sempre soft delete. Categorias: verificar produtos associados antes de delete. Pedidos: máquina de estados para transições válidas (`pending -> approved -> preparing -> shipped -> delivered`).

---

## 7. Checklist de Pré-Implementação

- [ ] Bucket `product-images` no Supabase Storage com policies
- [ ] Policies RLS admin em todas as tabelas
- [ ] Trigger `updated_at` nas tabelas editáveis
- [ ] Instalar: `@tanstack/react-table`, `react-hook-form`, `@hookform/resolvers`, `recharts`, `react-dropzone`
- [ ] Adicionar componentes shadcn: `table`, `textarea`, `switch`, `checkbox`, `form`, `alert-dialog`, `calendar`, `progress`
- [ ] `QueryClientProvider` no `main.tsx`
- [ ] `createClient<Database>(...)` no `supabase.ts`
- [ ] Rotas admin no `App.tsx` com lazy loading
- [ ] `DataTable`, `FormModal`, `ConfirmDialog` criados e testados
- [ ] Schemas Zod para produto e categoria
