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
- [x] Configurar Vercel ou VPS deploy
- [x] vercel.json com rewrites
- [x] Variáveis de ambiente em produção

---

## FASE 4 — Nice-to-have 🟢

### 4.1 Google Sheets Integration — Gestão de Produtos

**Dependências:** `T1 → T3, T5 → T4 → T6 → T7`
**Arquitetura:** `docs/architecture/google-sheets-integration.md`

| # | Tarefa | Agente | Bloqueada por | Status |
|---|--------|--------|---------------|--------|
| T1 | Arquitetura da Integração Sheets↔Supabase | @architect | — | [x] |
| ~~T2~~ | ~~API de Sync~~ | — | — | Eliminada (acesso direto PostgREST) |
| T3 | Estrutura da Planilha Google Sheets Template | @dev + @po | T1 | [x] |
| T4 | Apps Script — Sync Engine | @dev | T3, T5 | [x] |
| T5 | Migration SQL — RPC `bulk_upsert_products` | @data-engineer | T1 | [x] |
| T6 | Testes & Validação | @qa | T3, T4, T5 | [x] |
| T7 | Documentação & Handoff para cliente | @pm | T6 | [x] |

#### Decisões Arquiteturais (T1)
- **Acesso direto**: Apps Script → Supabase PostgREST (sem middleware/Edge Function)
- **Auth**: `service_role` key via `PropertiesService` do Apps Script (server-side, seguro)
- **Chave de match**: `display_id` (amigável, UNIQUE, sequencial)
- **Conflitos**: Last Write Wins — planilha tem prioridade no push
- **Validação**: Dupla — local no Apps Script + server-side na RPC SQL
- **T2 eliminada**: API Route/Edge Function desnecessária — PostgREST já serve

#### Detalhamento
- **T3**: Aba "Cadastro" (ID, nome, preço, unidade, categoria, descrição, ativo, imagem URL, status sync, última sync), Aba "Categorias" (readonly). Dropdowns, validação, formatação condicional
- **T4**: Funções `pullFromSupabase()` e `pushToSupabase()`, validação pré-envio, menu customizado "📦 Levee Produtos"
- **T5**: Migration 007 — RPC `bulk_upsert_products(p_products JSONB)` com validação, resolve category_name→UUID, retorna {inserted, updated, errors[]}
- **T6**: Sync bidirecional, edge cases (duplicatas, campos vazios, preço negativo, categoria inexistente, 100+ produtos)
- **T7**: Guia de uso para Levee + documentação técnica

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

## Bugs Corrigidos (sessão 2026-02-25)

- [x] Checkout 400 — `create_order_validated` cast TEXT→enum `payment_method` (migration 006)
- [x] ProductCard não navegava — typo `/produtos/` → `/produto/` (HomePage.tsx)
- [x] Navigator Lock timeout em produção — custom lock no-op no Supabase client (supabase.ts)
- [x] Rate limit 429 sem mensagem amigável — tratamento PT-BR (LoginForm + RegisterForm)
- [x] 5 erros TypeScript bloqueando build (RegisterForm, OrderFilters, Chart, ProductFormModal, ProductCard)

## Pendências Manuais

- [x] Rodar migration `006_fix_payment_method_cast.sql` no Supabase SQL Editor
- [x] Configurar env vars no Vercel Dashboard (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
- [x] Commit + push dos arquivos pendentes (LoginForm.tsx, RegisterForm.tsx) via @devops

---

## Ordem de Execução (próximos passos)

```
Fases 1-3: COMPLETAS → Fase 4.1 Google Sheets: COMPLETA → Próximo: Fase 4.2+
```

> Fases 1, 2, 2.5 e 3: COMPLETAS ✅
> Fase 4.1 Google Sheets: COMPLETA ✅ (2026-03-04)
> Deploy Vercel: CONCLUÍDO (env vars + migration 006 aplicados em 2026-02-27)
> GitHub: github.com/jubileuagencia/leveelojista
> Migrations: 000-008 (008 = bulk_upsert_products com setval)
> **Próximo: Fase 4.2 (Notificações), 4.3 (Relatórios), 4.4 (PWA)**
