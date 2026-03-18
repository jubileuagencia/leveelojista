# Memory - JUBILEU AGENCIA

## Pastas de Trabalho
- **Projeto AIOS (dev)**: `/opt/projects/JUBILEU-AGENCIA/` - repositório git principal do AIOS
- **Pasta do Diego**: `/home/diego/DIEGO JUBILEU-AGENCIA/` - mesmo inode que /opt/projects/
- **Delivery Test**: `/home/diego/DIEGO JUBILEU-AGENCIA/deliverytest`

## Docker Dev Environment
- **Container**: `jubileu-dev` (usar `sg docker -c 'docker exec jubileu-dev bash -c "..."'`)
- **Workspace no container**: `/workspace` = volume mount de `/home/diego/DIEGO JUBILEU-AGENCIA/`
- **Portas**: 5173 (novob2b), 5174 (deliverytest), 3000 (server.js)
- **node_modules**: volumes separados (`novob2b_modules`, `deliverytest_modules`)

## novob2b - Projeto B2B
- **Stack**: React 19 + TypeScript + Vite 7 + Tailwind 4 + shadcn/ui + Supabase + Zustand + React Query + Zod
- **Supabase**: Projeto "novob2b" (sgczuohhyxetibmswtvm) - URL e anon key em .env
- **GitHub**: `github.com/jubileuagencia/leveelojista` (user: jubileuagencia)
- **Deploy**: Vercel com GitHub Integration — `vercel.json` configurado
- **Dev server**: `http://localhost:5173`
- **Prod server**: `server.js` (Express 5 + Helmet CSP + compression) — porta 3000

## novob2b - Status (2026-02-27)
- **Cliente**: 100% completo (~9000 linhas, 73 arquivos)
- **Admin Panel**: FASE 1 COMPLETA (Dashboard, Produtos, Pedidos, Clientes, Categorias, Configurações)
- **Fase 2 (Services/RLS)**: COMPLETA
- **Fase 2.5 (Responsividade)**: COMPLETA
- **Fase 3.1-3.2 (Categorias/Config)**: COMPLETA
- **Fase 3.3 (Server Express)**: COMPLETA — server.js + Dockerfile + .dockerignore
- **Fase 3.4 (Deploy)**: COMPLETA — Vercel env vars configuradas, migration 006 aplicada (2026-02-27)
- **Backend SQL**: 9 RPCs, RLS 9 tabelas, migrations 000-006 (006 = fix payment_method cast)
- **Rotas admin**: /admin (dashboard), /admin/produtos, /admin/pedidos, /admin/clientes, /admin/categorias, /admin/configuracoes
- **MVP**: COMPLETO (Fases 1-3 finalizadas)
- **Próximo**: Fase 4 (Google Sheets, Notificações, Relatórios, PWA)

### Pendências Manuais
- ~~Commit + push LoginForm.tsx e RegisterForm.tsx (429 fix)~~ ✅ Concluído (2026-03-04)

## novob2b - Arquivos Admin (por módulo)
- Layout: `src/components/layout/AdminLayout.tsx`
- Dashboard: `services/dashboard.ts`, `hooks/useDashboard.ts`, `pages/DashboardPage.tsx`
- Produtos: `services/products.ts`, `hooks/useProducts.ts`, `pages/ProductsPage.tsx`, components: ProductsTable, ProductFormModal, ProductFilters, BulkActionsBar, ImageUpload
- Pedidos: `services/orders.ts`, `hooks/useOrders.ts`, `pages/OrdersPage.tsx`, components: OrdersTable, OrderDetailsModal, OrderFilters, OrderStatusBadge
- Clientes: `services/clients.ts`, `hooks/useClients.ts`, `pages/ClientsPage.tsx`, components: ClientsTable, ClientDetailsModal, ClientFilters, TierBadge, RoleBadge
- Categorias: `services/categories.ts`, `hooks/useCategories.ts`, `pages/CategoriesPage.tsx`, components: CategoriesTable, CategoryFormModal
- Config: `services/config.ts`, `hooks/useConfig.ts`, `pages/ConfigPage.tsx`
- Shared: `components/Pagination.tsx`
- Hooks utilitários: `src/hooks/use-debounce.ts`, `src/hooks/use-mobile.ts`
- SQL: `supabase/migrations/000-006`, `supabase/seed/seed_products.sql`
- Produção: `server.js`, `Dockerfile`, `.dockerignore`, `vercel.json`

## novob2b - Padrões de Código Confirmados
- **Feature-based**: `src/features/{feature}/services|hooks|components|pages`
- **Services**: Supabase queries diretas ou RPCs, throw Error PT-BR
- **Hooks React Query**: queryKey `['admin', 'module', filters]`, invalidation + toast em mutations, também invalidar `['admin', 'dashboard']` quando relevante
- **Mobile pattern**: Card list (< md) + Table (>= md), touch targets >= 36px (size-9)
- **Modal pattern produtos**: Sheet bottom (mobile) vs Dialog (desktop) via `useIsMobile()` hook
- **Modal pattern detail**: Sheet side="right" (ambos), SheetTitle/SheetDescription SEMPRE no loading (Radix accessibility)
- **Modal simples**: Dialog com DialogTitle/DialogDescription (ex: CategoryFormModal)
- **Scroll fix**: `h-[92dvh] overflow-hidden` container + `min-h-0 flex-1` form + native `overflow-y-auto` + `shrink-0` footer. NUNCA usar ScrollArea para conteúdo dinâmico
- **Flexbox fix**: SEMPRE `min-w-0 overflow-x-hidden` em flex-1 children
- **App.tsx**: Admin lazy imports com prefixo `Admin*` para evitar conflito com customer pages
- **AlertDialog**: Fora do DropdownMenu, controlado via state (evitar problemas mobile)
- **CEP auto-fill**: fetch `viacep.com.br/ws/{cep}/json/` onBlur, preencher street/district/city/state
- **Supabase auth lock**: Em produção (Vercel/CDN), `navigator.locks` causa timeout. Workaround: custom no-op `lock` fn no createClient (supabase.ts)
- **Express 5 wildcard**: Sintaxe mudou de `'*'` para `'/{*splat}'` (breaking change path-to-regexp)
- **Zod 4 + hookform**: `z.coerce.number()` incompatível com `@hookform/resolvers`. Usar `z.number()` + `{ valueAsNumber: true }` no register()
- **Rate limit 429**: Supabase free tier limita ~4 emails/hora. Tratar com mensagem PT-BR no catch

## Bugs Corrigidos (sessão 2026-02-25)
- Checkout 400: `create_order_validated` cast TEXT→enum `payment_method` (migration 006)
- ProductCard navegação: typo `/produtos/` → `/produto/` (HomePage.tsx)
- Navigator Lock timeout produção: custom lock no-op (supabase.ts)
- Rate limit 429: tratamento PT-BR (LoginForm + RegisterForm)
- 5 erros TypeScript bloqueando build (RegisterForm, OrderFilters, Chart, ProductFormModal, ProductCard)

## Preferências do Diego
- Mobile-first prioritizado
- Trabalha na VPS, perde contexto entre sessões — registrar tudo em TASKS.md e memory
- Usa AIOS agents para delegar tarefas
