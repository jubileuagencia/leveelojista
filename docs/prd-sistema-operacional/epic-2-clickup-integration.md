# Epic 2: ClickUp Integration

**Phase:** 1 — MVP
**Status:** Pending
**Stories:** 5
**Dependencies:** Epic 1 (auth, app shell)

## Goal

Integrar o módulo de tarefas do ClickUp à plataforma, permitindo visualizar, criar, editar e gerenciar tarefas sem sair do Jubileu OS. O módulo deve refletir a estrutura real do workspace ClickUp da Jubileu (spaces, folders, lists) e suportar views de Kanban e Lista.

---

## Story 2.1: ClickUp API Proxy & Data Layer

**Status:** Draft

> As a developer,
> I want API routes that proxy ClickUp requests securely,
> so that the frontend can access ClickUp data without exposing the API token.

### Acceptance Criteria
1. API routes em `app/api/clickup/` para: spaces, folders, lists, tasks, comments
2. ClickUp API token armazenado em env var, nunca exposto ao client
3. Helper `lib/clickup/client.ts` com métodos tipados: `getTasks()`, `getTask()`, `createTask()`, `updateTask()`, `addComment()`
4. Tipos TypeScript para todas as entidades ClickUp usadas (Task, List, Space, Comment)
5. Error handling padronizado: rate limit retry, auth errors, network errors
6. Response caching com `stale-while-revalidate` (60s para listagens, 30s para detalhes)
7. Rate limit nas API routes (max 30 req/min por usuário)

---

## Story 2.2: Task List View with Filters

**Status:** Draft

> As a team member,
> I want to see tasks in a list view with powerful filters,
> so that I can quickly find and focus on the tasks that matter.

### Acceptance Criteria
1. Página `/dashboard/tasks` com listagem de tarefas
2. Cada row mostra: nome, status (badge colorido), assignee (avatar), prioridade (flag), due date
3. Filtros: por lista, por status, por assignee, por prioridade, por tag
4. Filtros persistidos na URL (query params) para compartilhamento
5. Busca por texto no nome da tarefa (client-side filter)
6. Ordenação por: due date, prioridade, data de criação
7. Paginação com infinite scroll ou load more
8. Empty state quando não há tarefas nos filtros ativos
9. Loading skeleton durante fetch

---

## Story 2.3: Kanban Board View

**Status:** Draft

> As a team member,
> I want to view tasks as a Kanban board organized by status,
> so that I can visualize workflow progress and move tasks between stages.

### Acceptance Criteria
1. Toggle entre List View e Kanban View (persistido em localStorage)
2. Colunas representam statuses da lista selecionada
3. Cards mostram: nome, assignee avatar, prioridade flag, due date
4. Drag-and-drop entre colunas atualiza status via ClickUp API
5. Optimistic update: card move imediatamente, reverte se API falhar
6. Contagem de tasks por coluna no header
7. Scroll horizontal em mobile para navegar entre colunas
8. Mesmos filtros da List View se aplicam ao Kanban

---

## Story 2.4: Task Detail Panel

**Status:** Draft

> As a team member,
> I want to view and edit full task details in a slide-over panel,
> so that I can work on tasks without losing context of the board/list.

### Acceptance Criteria
1. Click em qualquer task abre slide-over panel (direita, 480px desktop, fullscreen mobile)
2. Exibe: nome (editável inline), descrição (markdown rendered), status, assignee, prioridade, due date, tags, custom fields
3. Seção de checklists com checkboxes interativos
4. Seção de comentários com timeline cronológica
5. Adicionar novo comentário com campo de texto + botão enviar
6. Editar status, assignee e prioridade via dropdowns inline
7. URL atualizada com task ID para deep linking (`/dashboard/tasks?task=86afxf9p0`)
8. Close com ESC, click fora, ou botão X

---

## Story 2.5: Create & Edit Tasks

**Status:** Draft

> As a team member,
> I want to create new tasks and edit existing ones,
> so that I can manage work directly from the platform.

### Acceptance Criteria
1. Botão "+ Nova Tarefa" no header do módulo de tarefas
2. Modal/drawer com form: nome (obrigatório), lista (dropdown), descrição (textarea), assignee, prioridade, due date
3. Lista dropdown carrega lists do workspace ClickUp
4. Validação client-side com Zod: nome obrigatório, lista obrigatória
5. Após criar, task aparece na listagem sem refresh (optimistic update ou revalidation)
6. Edição de campos da task via Task Detail Panel (Story 2.4)
7. Toast de sucesso/erro após operações

---

## File List

*Updated during development*

| File | Action | Story |
|------|--------|-------|
| — | — | — |
