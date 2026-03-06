# Requirements

**Source:** `docs/prd-sistema-operacional.md`

## Functional Requirements

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
- FR21-FR24: Diretório de agentes, chat interface, histórico, contexto anexável

**Workflows Inteligentes (Fase 2)**
- FR25-FR28: Workflows step-by-step, auto-registro, dashboard de atividade

**Acesso Cliente (Fase 2)**
- FR29-FR31: Portal dedicado, visão limitada, aprovação de entregas

**Google Drive (Fase 3)**
- FR32-FR35: Browser de pastas, preview, upload/download

**Slack (Fase 3)**
- FR36-FR38: Canais, mensagens, notificações

**Inbox & Calendário (Fase 3)**
- FR39-FR41: Inbox unificado, calendário, eventos

## Non-Functional Requirements

- NFR1: Tempo de carregamento inicial < 3s em conexão 4G
- NFR2: PWA instalável com suporte a push notifications
- NFR3: Responsividade total — mobile-first design, funcional em telas de 320px a 4K
- NFR4: Supabase Row-Level Security (RLS) para isolamento de dados por role e cliente
- NFR5: Rate limiting nas API routes para proteção contra abuso
- NFR6: Todas as chamadas a APIs externas via server-side (API routes) — nunca expor tokens no client
- NFR7: Caching inteligente de dados do ClickUp e Notion (stale-while-revalidate, 60s default)
- NFR8: Suporte a dark mode e light mode
- NFR9: Acessibilidade WCAG AA
- NFR10: Deploy automático via Vercel com preview deployments por branch
- NFR11: Logs estruturados para debugging e auditoria
- NFR12: Dados sensíveis em variáveis de ambiente, nunca no código
