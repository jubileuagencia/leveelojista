# Epic 3: Client Management

**Phase:** 1 — MVP
**Status:** Pending
**Stories:** 3
**Dependencies:** Epic 1 (auth, app shell), Epic 2 (ClickUp for task widget)

## Goal

Criar o módulo de gestão de clientes que organiza todos os recursos (tarefas, documentos, informações) por cliente. Cada cliente tem uma "pasta virtual" que agrega seus dados de múltiplas fontes, facilitando a gestão contextualizada.

---

## Story 3.1: Client CRUD & List

**Status:** Draft

> As an admin,
> I want to create, edit and manage client profiles,
> so that I can organize the agency's work by client.

### Acceptance Criteria
1. Página `/dashboard/clients` com grid de cards de clientes
2. Cada card mostra: logo, nome, contagem de tarefas abertas, último update
3. Criar cliente: modal com nome (obrigatório), slug (auto-gerado), logo upload, contatos, links
4. Editar cliente: mesmos campos, acessível pelo card
5. Desativar cliente (soft delete — não exclui dados)
6. Dados persistidos na tabela `clients` do Supabase
7. Apenas admins podem criar/editar/desativar clientes
8. Membros veem todos os clientes; clientes veem apenas o próprio

---

## Story 3.2: Client Detail & Dashboard

**Status:** Draft

> As a team member,
> I want a dedicated dashboard for each client,
> so that I can see all relevant information in one place.

### Acceptance Criteria
1. Página `/dashboard/clients/[slug]` com dashboard do cliente
2. Header com logo, nome e dados de contato do cliente
3. Widget "Tarefas Abertas" — lista tarefas ClickUp filtradas por tag do cliente
4. Widget "Documentos Recentes" — últimas páginas Notion associadas ao cliente
5. Widget "Próximos Prazos" — tarefas com due date nos próximos 7 dias
6. Tabs para navegar: Overview, Tarefas, Documentos, Informações
7. Tab "Informações" — dados editáveis do cliente (contatos, links, notas)
8. Associação client ↔ ClickUp feita via tag do cliente no ClickUp

---

## Story 3.3: Client-Scoped Resource Filtering

**Status:** Draft

> As a team member,
> I want to filter all platform resources by active client,
> so that I can focus on one client's work at a time.

### Acceptance Criteria
1. Client selector no header (dropdown com todos os clientes + "Todos")
2. Quando cliente selecionado: tarefas, docs, atividade filtram automaticamente
3. Seleção persistida em localStorage (mantém entre sessões)
4. Badge visual no header indicando cliente ativo
5. Módulos respeitam o filtro: ClickUp filtra por tag, Notion por categoria/tag
6. "Todos" remove filtro e mostra tudo (comportamento padrão)

---

## File List

*Updated during development*

| File | Action | Story |
|------|--------|-------|
| — | — | — |
