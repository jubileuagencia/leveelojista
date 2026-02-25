# novob2b — Task Plan

> Gerado em: 2026-02-24
> Atualizado em: 2026-02-26
> Baseado na análise comparativa: deliverytest v0.4 → novob2b (rewrite)

## Legenda

- [ ] Pendente
- [x] Concluído
- 🔴 Crítico (bloqueia uso)
- 🟡 Importante (MVP)
- 🟢 Nice-to-have (pós-MVP)

---

## O que já está pronto ✅

- [x] Auth (Login + Registro multi-step com CNPJ, CEP, masks)
- [x] Catálogo de Produtos (grid, categorias, busca, tier pricing)
- [x] Carrinho (add/remove/qty, optimistic updates, sheet sidebar)
- [x] Checkout 4-step (endereço → pagamento → revisão → sucesso)
- [x] Histórico de Pedidos (listagem paginada + detalhes com timeline)
- [x] Favoritos (toggle com optimistic updates)
- [x] Busca (debounced, recent searches, filtro por categoria)
- [x] Layout responsivo (Header, BottomNav mobile, MainLayout)
- [x] UI Kit (19 componentes shadcn/ui)
- [x] Stores Zustand (auth, cart, config)
- [x] Types TypeScript (schema completo)
- [x] Tier Pricing (Bronze 0%, Silver 4%, Gold 8%)

---

## PRE-REQUISITOS (Infra) ✅

### Supabase - Novo Projeto "novob2b"
- [x] Criar projeto Supabase novo (sgczuohhyxetibmswtvm)
- [x] Atualizar .env com nova URL e anon key
- [x] Executar 000_base_schema.sql (enums, sequences, 9 tabelas, trigger handle_new_user, seed)
- [x] Executar 001_admin_rpc_functions.sql (is_admin, get_dashboard_metrics, search_admin_orders, get_admin_clients, create_order_validated, etc.)
- [x] Executar 002_admin_rls_policies.sql (RLS em todas as tabelas + bucket product-images)
- [x] Executar 003_admin_schema_additions.sql (sort_order, updated_at, triggers, 20+ indices)
- [x] Executar seed_products.sql (8 categorias + 30 produtos de exemplo)
- [x] Executar 004_fix_handle_new_user_address.sql (trigger salva endereço no cadastro)
- [x] Executar 005_backfill_addresses_from_metadata.sql (backfill endereços de users existentes)

### Dependências & Componentes
- [x] Instalar: @tanstack/react-query, @tanstack/react-table, react-hook-form, @hookform/resolvers, recharts, react-dropzone
- [x] Adicionar shadcn: table, textarea, switch, checkbox, calendar, alert-dialog, form, progress
- [x] Configurar QueryClientProvider + query-client.ts (staleTime: 30s, gcTime: 300s)

### Stories & Documentação
- [x] Story 2.1 — Admin Dashboard (docs/stories/2.1.story.md)
- [x] Story 2.2 — Admin Produtos CRUD (docs/stories/2.2.story.md)
- [x] Story 2.3 — Admin Pedidos (docs/stories/2.3.story.md)
- [x] Story 2.4 — Admin Clientes (docs/stories/2.4.story.md)
- [x] Story 2.5 — Admin Categorias (docs/stories/2.5.story.md)
- [x] Story 2.6 — Admin Configurações (docs/stories/2.6.story.md)
- [x] Revisão de Arquitetura (docs/architecture/novob2b-admin-review.md)

---

## FASE 1 — Admin Panel 🔴

### 1.1 Admin Layout & Navegação
- [x] Sidebar com links: Dashboard, Produtos, Pedidos, Clientes, Categorias, Relatórios, Configurações
- [x] Header admin com user info e logout
- [x] Proteção de rota (AdminLayout com role check + redirect)
- [x] Responsivo: sidebar como Sheet no mobile, hamburger no top bar, sidebar fixa com collapse no desktop
- [x] Fix overflow horizontal mobile (min-w-0 + overflow-x-hidden no main)

### 1.2 Admin Dashboard
- [x] Cards de resumo: total pedidos, pedidos hoje, total clientes, receita do mês (MetricCard component)
- [x] Pedidos recentes (RecentOrdersTable com colunas responsivas)
- [x] Hooks React Query: useDashboardMetrics, useRecentOrders, useOrdersByStatus
- [x] Service: features/admin/services/dashboard.ts (fetchDashboardMetrics, fetchRecentOrders, fetchOrdersByStatus)
- [x] Gráfico de pedidos por status (recharts — dados prontos via useOrdersByStatus)

### 1.3 Admin Produtos (CRUD)
- [x] Listagem paginada com busca (nome/ID)
- [x] Filtros: status (ativo/inativo), categoria
- [x] Criar produto (form modal: nome, preço, unidade, categoria, descrição, imagem)
- [x] Editar produto
- [x] Toggle ativo/inativo
- [x] Soft-delete (deleted_at)
- [x] Bulk actions (selecionar vários → ativar/desativar/excluir)
- [x] Upload de imagem (Supabase Storage bucket: product-images)
- [x] Display ID amigável (auto-increment via sequence)

### 1.4 Admin Pedidos
- [x] Listagem paginada de todos os pedidos
- [x] Smart Search (por # pedido, nome empresa, CNPJ) — RPC search_admin_orders pronto
- [x] Filtro por status (multi-select chips)
- [x] Modal de detalhes (Sheet lateral: itens, cliente, endereço, valores)
- [x] Alterar status individual (dentro do detail modal)
- [x] Bulk actions (selecionar vários → alterar status em massa)
- [x] Order number amigável (#1000+)

### 1.5 Admin Clientes
- [x] Listagem paginada de usuários — RPC get_admin_clients pronto
- [x] Busca por nome, email, CNPJ
- [x] Filtros: tier (Bronze/Silver/Gold), role (Customer/Admin)
- [x] Modal de detalhes com edição (tier, role, dados)
- [x] Gestão de endereços do cliente (listar, adicionar com CEP auto-fill, excluir)
- [x] Alterar email (via RPC update_admin_user_email)
- [x] Badges visuais de tier e role
- [x] Proteção: só super_admin promove admins

---

## FASE 2 — Services Admin (Backend/Supabase) 🔴

### 2.1 Services Layer
- [x] `features/admin/services/dashboard.ts` — Queries de métricas
- [x] `features/admin/services/products.ts` — CRUD de produtos (admin)
- [x] `features/admin/services/categories.ts` — Listagem de categorias (admin)
- [x] `features/admin/services/orders.ts` — Listagem e gestão de pedidos (admin)
- [x] `features/admin/services/clients.ts` — Listagem e gestão de clientes (admin)

### 2.2 RPCs do Supabase
- [x] `is_admin()` / `is_super_admin()` — Verificação de role
- [x] `get_dashboard_metrics()` — Métricas do dashboard
- [x] `get_orders_by_status()` — Contagem por status
- [x] `search_admin_orders()` — Busca avançada com paginação
- [x] `get_admin_clients()` — Listagem segura com email
- [x] `update_admin_user_email()` — Alteração de email por super_admin
- [x] `create_order_validated()` — Validação server-side de preços
- [x] `set_main_address()` — Toggle atômico de endereço principal
- [x] `trigger_set_updated_at()` — Auto-atualização de updated_at

### 2.3 RLS Policies
- [x] Produtos: clientes veem ativos; admins fazem CRUD
- [x] Pedidos: clientes veem próprios; admins veem/editam todos
- [x] Perfis: clientes veem próprio; admins editam qualquer
- [x] Endereços: clientes gerenciam próprios; admins gerenciam qualquer
- [x] Categorias: todos leem; admins fazem CRUD
- [x] App Config: todos leem; admins editam
- [x] Cart/Favorites: clientes gerenciam próprios
- [x] Storage product-images: público lê; admins fazem upload/delete

---

## FASE 2.5 — Responsividade Mobile-First 🔴

### Correções aplicadas
- [x] MainLayout: min-w-0 + overflow-x-hidden no main (fix scroll horizontal)
- [x] AdminLayout: sidebar Sheet no mobile, hamburger no top bar, padding responsivo
- [x] MetricCard: padding/tamanhos responsivos, truncate nos textos
- [x] RecentOrdersTable: colunas Empresa/Data hidden em telas pequenas, skeleton responsivo
- [x] ProductCard: padding p-2/p-3 responsivo, quantidade+botão empilhados no mobile, textos menores
- [x] DashboardPage: removido padding duplicado

---

## FASE 3 — Funcionalidades Extras 🟡

### 3.1 Gestão de Categorias (Admin)
- [x] CRUD de categorias (criar, editar, excluir)
- [x] Reordenar categorias (sort_order via setas up/down)

### 3.2 Configurações (Admin)
- [x] Tela para editar tier discounts (Bronze/Silver/Gold %)
- [x] Configurações gerais do app (ConfigPage com save + validação)

### 3.3 Server Express (Produção)
- [x] `server.js` com Express para servir SPA
- [x] CSP (Content Security Policy) via Helmet
- [x] Rewrite rules para SPA routing
- [x] Dockerfile de produção (multi-stage build)

### 3.4 Deploy
- [ ] Configurar Vercel ou VPS deploy
- [x] vercel.json com rewrites
- [ ] Variáveis de ambiente em produção

---

## FASE 4 — Nice-to-have 🟢

### 4.1 Google Sheets Integration
- [ ] Sync bidirecional de produtos (edição em massa)
- [ ] Aba Preços + Aba Cadastro
- [ ] Apps Script com validação

### 4.2 Notificações
- [ ] Email de confirmação de pedido
- [ ] Notificação de mudança de status

### 4.3 Relatórios
- [ ] Relatório de vendas por período
- [ ] Relatório de clientes por tier
- [ ] Export CSV/PDF

### 4.4 PWA
- [ ] Service Worker
- [ ] Manifest.json
- [ ] Offline support básico

---

## Melhorias do novob2b vs deliverytest

O novob2b já é **superior** ao deliverytest em:
- **TypeScript** (vs JavaScript puro)
- **Zustand** (vs Context API — menos re-renders)
- **Tailwind 4 + shadcn/ui** (vs CSS Modules — componentes prontos, consistência)
- **Zod validation** (vs validação manual)
- **Feature-based structure** (vs flat pages/)
- **Lazy loading** de rotas (vs carrega tudo)
- **React 19** (vs 19 também, mas com melhor aproveitamento)
- **React Query** para server state (queries com cache, staleTime, refetch)

---

## Ordem de Execução (próximos passos)

```
1.3 Produtos CRUD → 1.4 Pedidos → 1.5 Clientes → 3.1 Categorias → 3.2 Config → Deploy
```

> Dashboard e backend (RPCs, RLS, schema) já estão prontos.
> Story 2.2 — Admin Produtos CRUD: CONCLUÍDA
> Story 2.3 — Admin Pedidos: CONCLUÍDA
> Story 2.4 — Admin Clientes: CONCLUÍDA
> Story 3.1 — Admin Categorias CRUD: CONCLUÍDA
> Story 3.2 — Admin Configurações: CONCLUÍDA
> Próximo: 1.2 Gráfico Dashboard (recharts) → 3.3 Server Express → 3.4 Deploy
