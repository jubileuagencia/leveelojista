# Jubileu OS — Sistema Operacional da Agência

**Version:** 1.0.0
**Date:** 2026-03-06
**Author:** Orion (AIOS Master) + Fernando
**Type:** Greenfield Fullstack PRD
**Status:** Draft
**ClickUp Task:** [86afxf9p0](https://app.clickup.com/t/86afxf9p0)

---

## Goals and Background Context

### Goals

- Centralizar todas as operações da agência Jubileu em uma única plataforma web
- Eliminar o tab-switching constante entre ClickUp, Notion, Slack, Google Drive e ferramentas avulsas
- Dar acesso controlado a clientes para que acompanhem entregas sem precisar de onboarding em múltiplas ferramentas
- Viabilizar o uso dos agentes AIOS diretamente pela interface, democratizando o acesso à IA para toda a equipe
- Registrar automaticamente toda atividade executada na plataforma, mantendo o projeto sempre atualizado
- Oferecer experiência mobile-first para operação em campo e deslocamento

### Background Context

A Jubileu é uma agência criativa que opera com uma equipe enxuta (Fernando, Gabriel, Karolina) e atende clientes como Pelicula Sideral, Levee e Caracol Records. Hoje, o fluxo de trabalho está fragmentado entre ClickUp (tarefas), Notion (documentação/knowledge base), Slack (comunicação), Google Drive (arquivos) e ferramentas diversas de IA. Essa fragmentação gera perda de contexto, retrabalho, e dificulta o onboarding de clientes.

O Jubileu OS será o front-end unificado que integra todas essas ferramentas via API, adicionando uma camada de permissões por role (admin, membro, cliente) e uma experiência coesa otimizada para mobile. Não se trata de recriar cada ferramenta, mas de orquestrar o acesso inteligente a elas a partir de um único ponto.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-06 | 1.0.0 | PRD inicial completo — 3 fases, 11 módulos | Orion + Fernando |

---

## Requirements

### Functional Requirements

**Auth & Permissões**
- FR1: O sistema deve suportar autenticação via email/senha e OAuth (Google)
- FR2: Três roles de usuário: Admin (acesso total), Membro (acesso operacional), Cliente (acesso restrito)
- FR3: Admins podem criar, editar e desativar contas de usuário
- FR4: Cada role define quais módulos, clientes e recursos são visíveis
- FR5: Sessão persistente com refresh token e timeout configurável

**ClickUp Integration**
- FR6: Listar tarefas filtradas por lista, status, assignee e tags
- FR7: Visualizar detalhes completos de uma tarefa (descrição, checklists, comentários, custom fields)
- FR8: Criar novas tarefas com campos obrigatórios (nome, lista, assignee, prioridade)
- FR9: Atualizar status, prioridade e assignee de tarefas existentes
- FR10: Visualização Kanban e Lista com drag-and-drop para mudança de status
- FR11: Adicionar comentários a tarefas diretamente pela plataforma

**Gestão de Clientes**
- FR12: CRUD de clientes com dados básicos (nome, logo, contatos, links)
- FR13: Cada cliente possui uma pasta virtual com seus documentos, tarefas e recursos associados
- FR14: Filtrar recursos globais por cliente ativo
- FR15: Dashboard resumo por cliente (tarefas pendentes, docs recentes, próximos prazos)

**Notion Integration**
- FR16: Listar e buscar páginas do workspace Notion da Jubileu
- FR17: Visualizar conteúdo de páginas Notion renderizado na plataforma
- FR18: Criar e editar páginas Notion diretamente pela interface
- FR19: Organizar páginas por categorias (skills, roteiros, SOPs, briefings)
- FR20: Busca full-text no conteúdo das páginas

**Agentes IA (Fase 2)**
- FR21: Diretório de agentes AIOS disponíveis com descrição e capabilities
- FR22: Interface de chat para interação com agentes via API Claude
- FR23: Histórico de conversas por agente e por usuário
- FR24: Capacidade de anexar contexto (tarefas ClickUp, docs Notion) à conversa do agente

**Workflows Inteligentes (Fase 2)**
- FR25: Criar workflows com steps sequenciais, cada step com instruções e responsável
- FR26: Executar workflows step-by-step com tracking de progresso
- FR27: Auto-registro: toda ação executada na plataforma é logada com timestamp, usuário e contexto
- FR28: Dashboard de atividade recente mostrando logs de auto-registro

**Acesso Cliente (Fase 2)**
- FR29: Portal dedicado para clientes com layout simplificado
- FR30: Cliente vê apenas: suas tarefas, seus documentos, calendário de entregas
- FR31: Cliente pode adicionar comentários e aprovar entregas

**Google Drive (Fase 3)**
- FR32: Navegar estrutura de pastas do Google Drive da agência
- FR33: Visualizar preview de arquivos (imagens, PDFs, docs)
- FR34: Upload e download de arquivos
- FR35: Filtrar arquivos por cliente

**Slack (Fase 3)**
- FR36: Visualizar canais e mensagens recentes
- FR37: Enviar mensagens para canais e DMs
- FR38: Notificações de novas mensagens na plataforma

**Inbox & Calendário (Fase 3)**
- FR39: Inbox unificado agregando notificações de todas as integrações
- FR40: Calendário com eventos, prazos de tarefas e entregas agendadas
- FR41: Criar e editar eventos no calendário

### Non-Functional Requirements

- NFR1: Tempo de carregamento inicial < 3s em conexão 4G
- NFR2: PWA instalável com suporte a push notifications
- NFR3: Responsividade total — mobile-first design, funcional em telas de 320px a 4K
- NFR4: Supabase Row-Level Security (RLS) para isolamento de dados por role e cliente
- NFR5: Rate limiting nas API routes para proteção contra abuso
- NFR6: Todas as chamadas a APIs externas via server-side (API routes) — nunca expor tokens no client
- NFR7: Caching inteligente de dados do ClickUp e Notion (stale-while-revalidate, 60s default)
- NFR8: Suporte a dark mode e light mode
- NFR9: Acessibilidade WCAG AA (contraste, navegação por teclado, screen readers)
- NFR10: Deploy automático via Vercel com preview deployments por branch
- NFR11: Logs estruturados para debugging e auditoria
- NFR12: Dados sensíveis (tokens, API keys) em variáveis de ambiente, nunca no código

---

## User Interface Design Goals

### Overall UX Vision

Interface limpa, profissional e focada em produtividade. O design segue o paradigma de "workspace" (similar ao Linear, Notion, Vercel Dashboard) com sidebar de navegação persistente, conteúdo principal centralizado e painéis contextuais. A experiência deve ser rápida, sem friccção, e reduzir o número de cliques para ações comuns.

### Key Interaction Paradigms

- **Sidebar Navigation**: Menu lateral colapsável com ícones e labels por módulo
- **Command Palette (Cmd+K)**: Acesso rápido a qualquer recurso, página ou ação
- **Contextual Panels**: Slide-over panels para detalhes sem sair da view atual
- **Drag & Drop**: Kanban boards, reordenamento de itens
- **Inline Editing**: Edição de campos sem abrir formulários separados
- **Toast Notifications**: Feedback de ações sem bloquear a interface
- **Skeleton Loading**: Estados de carregamento que preservam o layout

### Core Screens and Views

1. **Login / Onboarding** — Autenticação e primeiro acesso
2. **Dashboard Home** — Visão geral com widgets (tarefas urgentes, atividade recente, calendário)
3. **ClickUp Module** — Kanban + Lista de tarefas com filtros
4. **Task Detail** — Slide-over com descrição, checklists, comentários
5. **Client Hub** — Seletor de cliente + dashboard por cliente
6. **Client Folder** — Documentos, tarefas e recursos do cliente
7. **Notion Browser** — Explorador de páginas com editor inline
8. **AI Agents** (Fase 2) — Diretório + interface de chat
9. **Workflows** (Fase 2) — Builder + executor de workflows
10. **Client Portal** (Fase 2) — View dedicada para clientes
11. **Settings** — Gestão de usuários, integrações, preferências

### Accessibility

WCAG AA — Contraste mínimo 4.5:1, navegação completa por teclado, labels ARIA em todos os componentes interativos, suporte a screen readers.

### Branding

- Paleta: Dark mode como padrão, tons de cinza (#0a0a0a → #fafafa) com accent color da Jubileu
- Tipografia: Inter (UI) + JetBrains Mono (code/dados)
- Estilo: Minimal, profissional, inspirado em Linear/Vercel — sem excessos visuais
- Ícones: Lucide Icons (consistente com shadcn/ui)

### Target Devices and Platforms

Web Responsive (Mobile-First) + PWA instalável em iOS e Android. Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide).

---

## Technical Assumptions

### Repository Structure: Monorepo

Projeto único Next.js que contém frontend, API routes (BFF), e configurações de deploy. Sem necessidade de polyrepo nesta fase — complexidade não justifica.

### Service Architecture

**Serverless Monolith** via Next.js App Router:
- **Frontend**: React Server Components + Client Components (interatividade)
- **Backend (BFF)**: Next.js API Routes (`app/api/`) como proxy autenticado para APIs externas
- **Database**: Supabase (PostgreSQL) para dados próprios (users, clients, settings, activity logs)
- **Auth**: Auth.js v5 com Supabase Adapter + Google OAuth provider
- **Storage**: Supabase Storage para uploads internos
- **Realtime**: Supabase Realtime para notificações e updates em tempo real

### Stack Completa

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router) | 15.x |
| Runtime | Node.js | 20.x LTS |
| Language | TypeScript | 5.x (strict mode) |
| UI Components | shadcn/ui | latest |
| Styling | Tailwind CSS | 4.x |
| State Management | Zustand | 5.x |
| Data Fetching | TanStack Query (React Query) | 5.x |
| Forms | React Hook Form + Zod | latest |
| Database | Supabase (PostgreSQL 15) | latest |
| Auth | Auth.js v5 | 5.x |
| Icons | Lucide React | latest |
| Drag & Drop | @dnd-kit | latest |
| Rich Text | Tiptap (para editor Notion-like) | 2.x |
| Deploy | Vercel | — |
| Package Manager | pnpm | 9.x |

### APIs Externas

| Serviço | API | Auth Method |
|---------|-----|-------------|
| ClickUp | REST API v2 | Personal Token |
| Notion | REST API | Integration Token |
| Google Drive | Google Drive API v3 | OAuth 2.0 (service account) |
| Slack | Web API + Events API | Bot Token |
| Claude (AI) | Anthropic Messages API | API Key |

### Testing Requirements

- **Unit**: Vitest para lógica de negócio e utils
- **Component**: Testing Library para componentes React
- **E2E**: Playwright para fluxos críticos (login, CRUD tarefas, navegação)
- **Cobertura mínima**: 70% para lógica de negócio, 50% geral

### Additional Technical Assumptions

- Todas as API keys e tokens armazenados em variáveis de ambiente Vercel (nunca no código)
- API routes servem como BFF (Backend For Frontend) — client nunca chama APIs externas diretamente
- Supabase RLS policies enforçam isolamento por tenant (role + client_id)
- Imagens e assets servidos via Vercel Image Optimization
- Internacionalização não é requisito para MVP (apenas pt-BR)
- PWA manifest e service worker para offline básico e push notifications
- Monitoramento via Vercel Analytics + Vercel Speed Insights (free tier)

---

## Epic List

### Phase 1 — MVP (Core Operacional)

- **Epic 1: Foundation & Auth** — Estrutura do projeto, autenticação, roles, app shell com navegação
- **Epic 2: ClickUp Integration** — Módulo completo de gestão de tarefas integrado ao ClickUp
- **Epic 3: Client Management** — Pastas de clientes, dashboard por cliente, organização de recursos
- **Epic 4: Notion Integration** — Browser de páginas, visualização, edição e busca no Notion

### Phase 2 — Automação & IA

- **Epic 5: AI Agents & Workflows** — Hub de agentes IA, chat interface, workflows step-by-step, auto-registro
- **Epic 6: Client Portal** — Acesso restrito para clientes com aprovação de entregas

### Phase 3 — Integrações Externas

- **Epic 7: External Integrations** — Google Drive, Slack, Inbox & Calendário

---

## Epic 1: Foundation & Auth

**Goal:** Estabelecer a base técnica do projeto (Next.js 15, Supabase, Vercel), implementar autenticação completa com roles (admin/membro/cliente), e construir o app shell responsivo com navegação por módulos. Ao final deste épico, temos um app deployado com login funcional, dashboard placeholder, e estrutura pronta para receber os módulos.

### Story 1.1: Project Scaffolding & Deploy Pipeline

> As a developer,
> I want the project initialized with Next.js 15, TypeScript, Tailwind, shadcn/ui, and deployed to Vercel,
> so that we have a working CI/CD pipeline from day one.

**Acceptance Criteria:**
1. Projeto criado com `create-next-app` usando App Router, TypeScript strict, Tailwind CSS, pnpm
2. shadcn/ui inicializado com tema dark como padrão
3. ESLint + Prettier configurados com regras do projeto
4. Estrutura de pastas definida: `app/`, `components/`, `lib/`, `types/`, `hooks/`
5. Deploy funcional no Vercel com preview deployments por branch
6. README com instruções de setup local
7. Variáveis de ambiente documentadas em `.env.example`
8. PWA manifest básico (`manifest.json`) configurado

### Story 1.2: Supabase Setup & Database Schema

> As a developer,
> I want Supabase configured with the core database schema,
> so that we have persistent storage with row-level security ready.

**Acceptance Criteria:**
1. Projeto Supabase criado e conectado ao Next.js via `@supabase/ssr`
2. Tabelas criadas: `profiles` (id, email, full_name, role, avatar_url, created_at), `clients` (id, name, slug, logo_url, created_at), `user_clients` (user_id, client_id — relação N:N)
3. Enum `user_role` criado: `admin`, `member`, `client`
4. RLS policies: users só veem seus próprios dados; admins veem tudo; clients veem apenas recursos do seu client_id
5. Migration files versionados no repositório (`supabase/migrations/`)
6. Seed script com dados de teste (3 users, 2 clients)
7. Supabase client helpers criados em `lib/supabase/` (server + client)

### Story 1.3: Authentication System

> As a user,
> I want to log in with email/password or Google OAuth,
> so that I can access the platform securely with my assigned role.

**Acceptance Criteria:**
1. Auth.js v5 configurado com Supabase Adapter
2. Login page com form email/senha + botão "Continue with Google"
3. Registro de novos usuários (apenas por convite — admin gera link)
4. Após login, profile criado/atualizado na tabela `profiles`
5. Role do usuário carregado na sessão e disponível via `useSession()`
6. Middleware de proteção: rotas `/dashboard/*` requerem autenticação
7. Redirect automático: não-autenticado → `/login`, autenticado → `/dashboard`
8. Logout funcional com limpeza de sessão
9. Páginas de erro: 401 (não autenticado), 403 (sem permissão)

### Story 1.4: App Shell & Responsive Navigation

> As a user,
> I want a responsive app shell with sidebar navigation,
> so that I can navigate between modules efficiently on any device.

**Acceptance Criteria:**
1. Layout com sidebar colapsável (expanded: 240px, collapsed: 64px, mobile: drawer)
2. Sidebar mostra módulos com ícones Lucide: Dashboard, Tarefas, Clientes, Documentos, Settings
3. Módulos visíveis baseados no role do usuário (via middleware + conditional rendering)
4. Header com: avatar do usuário, nome, dropdown (perfil, configurações, logout)
5. Mobile: hamburger menu abre drawer overlay; swipe-to-close
6. Breadcrumbs dinâmicos baseados na rota atual
7. Skeleton loading states para transições entre módulos
8. Dark mode toggle no header (persistido em localStorage)
9. Breakpoints responsivos: mobile (<768px), tablet (768-1024px), desktop (>1024px)

### Story 1.5: Dashboard Home

> As a user,
> I want a dashboard home page showing an overview of my work,
> so that I can quickly see what needs attention.

**Acceptance Criteria:**
1. Grid de widgets responsivo (1 col mobile, 2 cols tablet, 3 cols desktop)
2. Widget "Tarefas Urgentes" — placeholder com dados mock (será conectado no Epic 2)
3. Widget "Atividade Recente" — lista de últimas 10 ações (placeholder)
4. Widget "Calendário da Semana" — mini calendário com próximos 7 dias (placeholder)
5. Greeting personalizado: "Bom dia, {nome}" baseado no horário
6. Quick actions bar: botões rápidos para ações frequentes (nova tarefa, novo doc)
7. Dados mock servidos via funções locais (fácil substituir por API real depois)
8. Loading states com skeleton para cada widget

### Story 1.6: User Management (Admin)

> As an admin,
> I want to manage users and their roles,
> so that I can control who has access to the platform and what they can see.

**Acceptance Criteria:**
1. Página `/dashboard/settings/users` acessível apenas para admins
2. Listagem de usuários com: nome, email, role, status (ativo/inativo), último login
3. Criar novo usuário: form com nome, email, role, clientes associados
4. Editar usuário: alterar role, clientes, ativar/desativar
5. Gerar link de convite com expiração (7 dias)
6. Não é possível desativar o próprio usuário admin
7. Confirmation dialog antes de ações destrutivas (desativar)
8. Toast notifications para feedback de ações (sucesso/erro)

---

## Epic 2: ClickUp Integration

**Goal:** Integrar o módulo de tarefas do ClickUp à plataforma, permitindo visualizar, criar, editar e gerenciar tarefas sem sair do Jubileu OS. O módulo deve refletir a estrutura real do workspace ClickUp da Jubileu (spaces, folders, lists) e suportar views de Kanban e Lista.

### Story 2.1: ClickUp API Proxy & Data Layer

> As a developer,
> I want API routes that proxy ClickUp requests securely,
> so that the frontend can access ClickUp data without exposing the API token.

**Acceptance Criteria:**
1. API routes em `app/api/clickup/` para: spaces, folders, lists, tasks, comments
2. ClickUp API token armazenado em env var, nunca exposto ao client
3. Helper `lib/clickup/client.ts` com métodos tipados: `getTasks()`, `getTask()`, `createTask()`, `updateTask()`, `addComment()`
4. Tipos TypeScript para todas as entidades ClickUp usadas (Task, List, Space, Comment)
5. Error handling padronizado: rate limit retry, auth errors, network errors
6. Response caching com `stale-while-revalidate` (60s para listagens, 30s para detalhes)
7. Rate limit nas API routes (max 30 req/min por usuário)

### Story 2.2: Task List View with Filters

> As a team member,
> I want to see tasks in a list view with powerful filters,
> so that I can quickly find and focus on the tasks that matter.

**Acceptance Criteria:**
1. Página `/dashboard/tasks` com listagem de tarefas
2. Cada row mostra: nome, status (badge colorido), assignee (avatar), prioridade (flag), due date
3. Filtros: por lista, por status, por assignee, por prioridade, por tag
4. Filtros persistidos na URL (query params) para compartilhamento
5. Busca por texto no nome da tarefa (client-side filter)
6. Ordenação por: due date, prioridade, data de criação
7. Paginação com infinite scroll ou load more
8. Empty state quando não há tarefas nos filtros ativos
9. Loading skeleton durante fetch

### Story 2.3: Kanban Board View

> As a team member,
> I want to view tasks as a Kanban board organized by status,
> so that I can visualize workflow progress and move tasks between stages.

**Acceptance Criteria:**
1. Toggle entre List View e Kanban View (persistido em localStorage)
2. Colunas representam statuses da lista selecionada
3. Cards mostram: nome, assignee avatar, prioridade flag, due date
4. Drag-and-drop entre colunas atualiza status via ClickUp API
5. Optimistic update: card move imediatamente, reverte se API falhar
6. Contagem de tasks por coluna no header
7. Scroll horizontal em mobile para navegar entre colunas
8. Mesmos filtros da List View se aplicam ao Kanban

### Story 2.4: Task Detail Panel

> As a team member,
> I want to view and edit full task details in a slide-over panel,
> so that I can work on tasks without losing context of the board/list.

**Acceptance Criteria:**
1. Click em qualquer task abre slide-over panel (direita, 480px desktop, fullscreen mobile)
2. Exibe: nome (editável inline), descrição (markdown rendered), status, assignee, prioridade, due date, tags, custom fields
3. Seção de checklists com checkboxes interativos
4. Seção de comentários com timeline cronológica
5. Adicionar novo comentário com campo de texto + botão enviar
6. Editar status, assignee e prioridade via dropdowns inline
7. URL atualizada com task ID para deep linking (`/dashboard/tasks?task=86afxf9p0`)
8. Close com ESC, click fora, ou botão X

### Story 2.5: Create & Edit Tasks

> As a team member,
> I want to create new tasks and edit existing ones,
> so that I can manage work directly from the platform.

**Acceptance Criteria:**
1. Botão "+ Nova Tarefa" no header do módulo de tarefas
2. Modal/drawer com form: nome (obrigatório), lista (dropdown), descrição (textarea), assignee, prioridade, due date
3. Lista dropdown carrega lists do workspace ClickUp
4. Validação client-side com Zod: nome obrigatório, lista obrigatória
5. Após criar, task aparece na listagem sem refresh (optimistic update ou revalidation)
6. Edição de campos da task via Task Detail Panel (Story 2.4)
7. Toast de sucesso/erro após operações

---

## Epic 3: Client Management

**Goal:** Criar o módulo de gestão de clientes que organiza todos os recursos (tarefas, documentos, informações) por cliente. Cada cliente tem uma "pasta virtual" que agrega seus dados de múltiplas fontes, facilitando a gestão contextualizada.

### Story 3.1: Client CRUD & List

> As an admin,
> I want to create, edit and manage client profiles,
> so that I can organize the agency's work by client.

**Acceptance Criteria:**
1. Página `/dashboard/clients` com grid de cards de clientes
2. Cada card mostra: logo, nome, contagem de tarefas abertas, último update
3. Criar cliente: modal com nome (obrigatório), slug (auto-gerado), logo upload, contatos, links
4. Editar cliente: mesmos campos, acessível pelo card
5. Desativar cliente (soft delete — não exclui dados)
6. Dados persistidos na tabela `clients` do Supabase
7. Apenas admins podem criar/editar/desativar clientes
8. Membros veem todos os clientes; clientes veem apenas o próprio

### Story 3.2: Client Detail & Dashboard

> As a team member,
> I want a dedicated dashboard for each client,
> so that I can see all relevant information in one place.

**Acceptance Criteria:**
1. Página `/dashboard/clients/[slug]` com dashboard do cliente
2. Header com logo, nome e dados de contato do cliente
3. Widget "Tarefas Abertas" — lista tarefas ClickUp filtradas por tag do cliente
4. Widget "Documentos Recentes" — últimas páginas Notion associadas ao cliente
5. Widget "Próximos Prazos" — tarefas com due date nos próximos 7 dias
6. Tabs para navegar: Overview, Tarefas, Documentos, Informações
7. Tab "Informações" — dados editáveis do cliente (contatos, links, notas)
8. Associação client ↔ ClickUp feita via tag do cliente no ClickUp

### Story 3.3: Client-Scoped Resource Filtering

> As a team member,
> I want to filter all platform resources by active client,
> so that I can focus on one client's work at a time.

**Acceptance Criteria:**
1. Client selector no header (dropdown com todos os clientes + "Todos")
2. Quando cliente selecionado: tarefas, docs, atividade filtram automaticamente
3. Seleção persistida em localStorage (mantém entre sessões)
4. Badge visual no header indicando cliente ativo
5. Módulos respeitam o filtro: ClickUp filtra por tag, Notion por categoria/tag
6. "Todos" remove filtro e mostra tudo (comportamento padrão)

---

## Epic 4: Notion Integration

**Goal:** Integrar o Notion como base de conhecimento da plataforma, permitindo navegar, visualizar, criar e editar páginas diretamente no Jubileu OS. O módulo serve como hub de documentação — skills, roteiros, briefings, SOPs — organizado por categorias.

### Story 4.1: Notion API Proxy & Data Layer

> As a developer,
> I want API routes that proxy Notion requests securely,
> so that the frontend can access Notion data without exposing the integration token.

**Acceptance Criteria:**
1. API routes em `app/api/notion/` para: search, pages, databases, blocks
2. Notion Integration Token em env var, nunca exposto ao client
3. Helper `lib/notion/client.ts` com métodos tipados: `searchPages()`, `getPage()`, `getBlocks()`, `createPage()`, `updateBlock()`
4. Tipos TypeScript para entidades Notion (Page, Block, Database, RichText)
5. Notion blocks convertidos para HTML/React components para renderização
6. Caching de páginas (5 min TTL) para reduzir chamadas à API
7. Error handling para rate limits e token expiration

### Story 4.2: Notion Page Browser

> As a team member,
> I want to browse and search Notion pages organized by category,
> so that I can quickly find the documentation I need.

**Acceptance Criteria:**
1. Página `/dashboard/docs` com explorador de páginas Notion
2. Sidebar com categorias: Skills, Roteiros, SOPs, Briefings, Geral (configuráveis)
3. Grid/lista de páginas com: título, ícone, última edição, preview de conteúdo
4. Busca full-text via Notion Search API
5. Click em página abre visualização renderizada (Story 4.3)
6. Breadcrumb mostrando hierarquia da página no Notion
7. Botão "Abrir no Notion" para acesso direto quando necessário

### Story 4.3: Notion Page Viewer & Editor

> As a team member,
> I want to view and edit Notion pages inline,
> so that I can work with documentation without leaving the platform.

**Acceptance Criteria:**
1. Renderização de blocos Notion: heading, paragraph, bulleted list, numbered list, toggle, callout, code, image, divider, table
2. Modo visualização como padrão (read-only)
3. Botão "Editar" ativa modo de edição com editor Tiptap
4. Edições sincronizadas de volta ao Notion via API (block-level updates)
5. Auto-save com debounce (2s após última edição)
6. Indicador visual de "salvando..." / "salvo"
7. Criar nova página: botão "+ Nova Página" com título e parent database/page

---

## Epic 5: AI Agents & Workflows (Phase 2)

**Goal:** Implementar o hub de agentes IA e o sistema de workflows inteligentes, permitindo que a equipe interaja com agentes AIOS via chat e execute fluxos de trabalho step-by-step com auto-registro de toda atividade.

### Story 5.1: AI Agent Directory

> As a team member,
> I want to see all available AI agents with their capabilities,
> so that I can choose the right agent for my task.

**Acceptance Criteria:**
1. Página `/dashboard/agents` com grid de cards de agentes
2. Cada card: ícone, nome, role, descrição curta, tags de capability
3. Dados dos agentes carregados de configuração local (JSON/YAML)
4. Filtro por capability (desenvolvimento, conteúdo, análise, etc.)
5. Click em agente abre interface de chat (Story 5.2)
6. Badge "Novo" para agentes recém-adicionados

### Story 5.2: Agent Chat Interface

> As a team member,
> I want to chat with AI agents through a clean interface,
> so that I can get AI assistance for my tasks.

**Acceptance Criteria:**
1. Interface de chat `/dashboard/agents/[id]/chat` com streaming de respostas
2. System prompt do agente carregado automaticamente baseado na persona
3. Histórico de conversas persistido no Supabase
4. Possibilidade de iniciar nova conversa ou continuar anterior
5. Suporte a markdown rendering nas respostas
6. Botão para anexar contexto: link de task ClickUp ou página Notion
7. Indicador de "typing..." durante streaming

### Story 5.3: Workflow Engine

> As a team member,
> I want to create and execute step-by-step workflows,
> so that complex tasks are broken into manageable steps with tracked progress.

**Acceptance Criteria:**
1. Página `/dashboard/workflows` com lista de workflows disponíveis
2. Cada workflow definido em YAML/JSON com steps, responsáveis, instruções
3. Executar workflow: progresso visual step-by-step com status por step
4. Cada step pode ser: manual (aguarda ação), automático (executa via API), ou misto
5. Histórico de execuções de workflows com timestamps e resultados
6. Auto-registro: toda execução de step logada na tabela `activity_logs`

### Story 5.4: Activity Auto-Logging

> As a team member,
> I want all platform actions automatically logged,
> so that the team always knows what work was done and by whom.

**Acceptance Criteria:**
1. Tabela `activity_logs`: user_id, action, entity_type, entity_id, metadata (JSON), created_at
2. Ações logadas: criar/editar tarefa, criar/editar doc, executar workflow step, login/logout
3. Feed de atividade no Dashboard Home (Widget "Atividade Recente" — substitui placeholder)
4. Filtro de atividade por: usuário, tipo de ação, módulo, data
5. Atividade visível por client scope (filtrada por cliente ativo)

---

## Epic 6: Client Portal (Phase 2)

**Goal:** Criar uma experiência dedicada e simplificada para clientes, onde possam acompanhar entregas, aprovar trabalhos e visualizar apenas os recursos pertinentes ao seu projeto.

### Story 6.1: Client Portal Layout & Access

> As a client user,
> I want a simplified portal showing only my project's information,
> so that I can track progress without complexity.

**Acceptance Criteria:**
1. Layout simplificado para role "client": sidebar reduzida (Início, Tarefas, Documentos, Calendário)
2. Redirect automático: client role → `/portal` (não `/dashboard`)
3. Dados filtrados exclusivamente pelo client_id associado ao usuário
4. Sem acesso a: gestão de usuários, configurações do sistema, outros clientes
5. Branding adaptável: logo do cliente no header do portal

### Story 6.2: Client Deliverable Approval

> As a client user,
> I want to review and approve deliverables,
> so that the agency knows when work is accepted.

**Acceptance Criteria:**
1. Seção "Entregas" no portal com itens pendentes de aprovação
2. Cada entrega mostra: nome, descrição, arquivos anexos, data limite
3. Botões "Aprovar" e "Solicitar Revisão" com campo de comentário
4. Status de aprovação sincronizado com ClickUp (comment + status update)
5. Notificação para equipe quando cliente aprova ou solicita revisão

---

## Epic 7: External Integrations (Phase 3)

**Goal:** Adicionar integrações com Google Drive, Slack e sistema de Inbox/Calendário para completar a experiência de workspace unificado.

### Story 7.1: Google Drive Browser

> As a team member,
> I want to browse and manage Google Drive files within the platform,
> so that I don't need to switch to Drive for file operations.

**Acceptance Criteria:**
1. Página `/dashboard/drive` com explorador de pastas e arquivos
2. Navegação hierárquica por pastas com breadcrumbs
3. Preview inline de: imagens, PDFs, Google Docs, Google Sheets
4. Upload de arquivos para pasta selecionada
5. Download de arquivos
6. Filtro por cliente (baseado em estrutura de pastas convencionada)

### Story 7.2: Slack Integration

> As a team member,
> I want to view and send Slack messages within the platform,
> so that communication stays in context with my work.

**Acceptance Criteria:**
1. Página `/dashboard/messages` com lista de canais e DMs
2. Visualizar mensagens recentes de cada canal
3. Enviar mensagens para canais e DMs
4. Notificação badge no sidebar quando há mensagens não lidas
5. Deep link de mensagem para contexto de tarefa

### Story 7.3: Inbox & Calendar

> As a team member,
> I want a unified inbox and calendar,
> so that I can manage notifications and schedule from one place.

**Acceptance Criteria:**
1. Inbox (`/dashboard/inbox`): feed unificado de notificações de todos os módulos
2. Cada notificação: ícone do módulo, título, preview, timestamp, link para recurso
3. Marcar como lida/não-lida, arquivar
4. Calendário (`/dashboard/calendar`): visualização mensal/semanal/diária
5. Eventos agregados de: due dates ClickUp, entregas agendadas, eventos manuais
6. Criar/editar eventos manuais com título, data/hora, descrição

---

## Checklist Results Report

*A ser preenchido após revisão com PM Checklist.*

---

## Next Steps

### Architect Prompt

> Com base neste PRD, crie o documento de arquitetura técnica (`docs/architecture-sistema-operacional.md`) para o Jubileu OS. Use a stack definida (Next.js 15 App Router, Supabase, Auth.js v5, shadcn/ui, Vercel) e detalhe: estrutura de pastas do projeto, schema do banco de dados completo, design das API routes (BFF pattern), estratégia de autenticação e RLS, e diagramas de fluxo para os principais módulos (Auth, ClickUp proxy, Notion proxy). Foque no Epic 1 (Foundation & Auth) com visão de extensibilidade para os épicos subsequentes.

### UX Expert Prompt

> Com base neste PRD, crie o design specification (`docs/ux-spec-sistema-operacional.md`) para o Jubileu OS. Foque na experiência mobile-first, app shell responsivo, e os core screens do MVP (Login, Dashboard, Task List/Kanban, Client Hub, Notion Browser). Defina: wireframes descritivos, componentes reutilizáveis, padrões de interação, e sistema de design (cores, tipografia, espaçamento). Use shadcn/ui como base de componentes e Tailwind para tokens de design.
