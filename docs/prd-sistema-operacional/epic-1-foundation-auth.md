# Epic 1: Foundation & Auth

**Phase:** 1 — MVP
**Status:** Pending
**Stories:** 6
**Dependencies:** None (first epic)

## Goal

Estabelecer a base técnica do projeto (Next.js 15, Supabase, Vercel), implementar autenticação completa com roles (admin/membro/cliente), e construir o app shell responsivo com navegação por módulos. Ao final deste épico, temos um app deployado com login funcional, dashboard placeholder, e estrutura pronta para receber os módulos.

---

## Story 1.1: Project Scaffolding & Deploy Pipeline

**Status:** Draft

> As a developer,
> I want the project initialized with Next.js 15, TypeScript, Tailwind, shadcn/ui, and deployed to Vercel,
> so that we have a working CI/CD pipeline from day one.

### Acceptance Criteria
1. Projeto criado com `create-next-app` usando App Router, TypeScript strict, Tailwind CSS, pnpm
2. shadcn/ui inicializado com tema dark como padrão
3. ESLint + Prettier configurados com regras do projeto
4. Estrutura de pastas definida: `app/`, `components/`, `lib/`, `types/`, `hooks/`
5. Deploy funcional no Vercel com preview deployments por branch
6. README com instruções de setup local
7. Variáveis de ambiente documentadas em `.env.example`
8. PWA manifest básico (`manifest.json`) configurado

---

## Story 1.2: Supabase Setup & Database Schema

**Status:** Draft

> As a developer,
> I want Supabase configured with the core database schema,
> so that we have persistent storage with row-level security ready.

### Acceptance Criteria
1. Projeto Supabase criado e conectado ao Next.js via `@supabase/ssr`
2. Tabelas criadas: `profiles` (id, email, full_name, role, avatar_url, created_at), `clients` (id, name, slug, logo_url, created_at), `user_clients` (user_id, client_id — relação N:N)
3. Enum `user_role` criado: `admin`, `member`, `client`
4. RLS policies: users só veem seus próprios dados; admins veem tudo; clients veem apenas recursos do seu client_id
5. Migration files versionados no repositório (`supabase/migrations/`)
6. Seed script com dados de teste (3 users, 2 clients)
7. Supabase client helpers criados em `lib/supabase/` (server + client)

---

## Story 1.3: Authentication System

**Status:** Draft

> As a user,
> I want to log in with email/password or Google OAuth,
> so that I can access the platform securely with my assigned role.

### Acceptance Criteria
1. Auth.js v5 configurado com Supabase Adapter
2. Login page com form email/senha + botão "Continue with Google"
3. Registro de novos usuários (apenas por convite — admin gera link)
4. Após login, profile criado/atualizado na tabela `profiles`
5. Role do usuário carregado na sessão e disponível via `useSession()`
6. Middleware de proteção: rotas `/dashboard/*` requerem autenticação
7. Redirect automático: não-autenticado → `/login`, autenticado → `/dashboard`
8. Logout funcional com limpeza de sessão
9. Páginas de erro: 401 (não autenticado), 403 (sem permissão)

---

## Story 1.4: App Shell & Responsive Navigation

**Status:** Draft

> As a user,
> I want a responsive app shell with sidebar navigation,
> so that I can navigate between modules efficiently on any device.

### Acceptance Criteria
1. Layout com sidebar colapsável (expanded: 240px, collapsed: 64px, mobile: drawer)
2. Sidebar mostra módulos com ícones Lucide: Dashboard, Tarefas, Clientes, Documentos, Settings
3. Módulos visíveis baseados no role do usuário (via middleware + conditional rendering)
4. Header com: avatar do usuário, nome, dropdown (perfil, configurações, logout)
5. Mobile: hamburger menu abre drawer overlay; swipe-to-close
6. Breadcrumbs dinâmicos baseados na rota atual
7. Skeleton loading states para transições entre módulos
8. Dark mode toggle no header (persistido em localStorage)
9. Breakpoints responsivos: mobile (<768px), tablet (768-1024px), desktop (>1024px)

---

## Story 1.5: Dashboard Home

**Status:** Draft

> As a user,
> I want a dashboard home page showing an overview of my work,
> so that I can quickly see what needs attention.

### Acceptance Criteria
1. Grid de widgets responsivo (1 col mobile, 2 cols tablet, 3 cols desktop)
2. Widget "Tarefas Urgentes" — placeholder com dados mock (será conectado no Epic 2)
3. Widget "Atividade Recente" — lista de últimas 10 ações (placeholder)
4. Widget "Calendário da Semana" — mini calendário com próximos 7 dias (placeholder)
5. Greeting personalizado: "Bom dia, {nome}" baseado no horário
6. Quick actions bar: botões rápidos para ações frequentes (nova tarefa, novo doc)
7. Dados mock servidos via funções locais (fácil substituir por API real depois)
8. Loading states com skeleton para cada widget

---

## Story 1.6: User Management (Admin)

**Status:** Draft

> As an admin,
> I want to manage users and their roles,
> so that I can control who has access to the platform and what they can see.

### Acceptance Criteria
1. Página `/dashboard/settings/users` acessível apenas para admins
2. Listagem de usuários com: nome, email, role, status (ativo/inativo), último login
3. Criar novo usuário: form com nome, email, role, clientes associados
4. Editar usuário: alterar role, clientes, ativar/desativar
5. Gerar link de convite com expiração (7 dias)
6. Não é possível desativar o próprio usuário admin
7. Confirmation dialog antes de ações destrutivas (desativar)
8. Toast notifications para feedback de ações (sucesso/erro)

---

## File List

*Updated during development*

| File | Action | Story |
|------|--------|-------|
| — | — | — |
