# Epic 4: Notion Integration

**Phase:** 1 — MVP
**Status:** Pending
**Stories:** 3
**Dependencies:** Epic 1 (auth, app shell)

## Goal

Integrar o Notion como base de conhecimento da plataforma, permitindo navegar, visualizar, criar e editar páginas diretamente no Jubileu OS. O módulo serve como hub de documentação — skills, roteiros, briefings, SOPs — organizado por categorias.

---

## Story 4.1: Notion API Proxy & Data Layer

**Status:** Draft

> As a developer,
> I want API routes that proxy Notion requests securely,
> so that the frontend can access Notion data without exposing the integration token.

### Acceptance Criteria
1. API routes em `app/api/notion/` para: search, pages, databases, blocks
2. Notion Integration Token em env var, nunca exposto ao client
3. Helper `lib/notion/client.ts` com métodos tipados: `searchPages()`, `getPage()`, `getBlocks()`, `createPage()`, `updateBlock()`
4. Tipos TypeScript para entidades Notion (Page, Block, Database, RichText)
5. Notion blocks convertidos para HTML/React components para renderização
6. Caching de páginas (5 min TTL) para reduzir chamadas à API
7. Error handling para rate limits e token expiration

---

## Story 4.2: Notion Page Browser

**Status:** Draft

> As a team member,
> I want to browse and search Notion pages organized by category,
> so that I can quickly find the documentation I need.

### Acceptance Criteria
1. Página `/dashboard/docs` com explorador de páginas Notion
2. Sidebar com categorias: Skills, Roteiros, SOPs, Briefings, Geral (configuráveis)
3. Grid/lista de páginas com: título, ícone, última edição, preview de conteúdo
4. Busca full-text via Notion Search API
5. Click em página abre visualização renderizada (Story 4.3)
6. Breadcrumb mostrando hierarquia da página no Notion
7. Botão "Abrir no Notion" para acesso direto quando necessário

---

## Story 4.3: Notion Page Viewer & Editor

**Status:** Draft

> As a team member,
> I want to view and edit Notion pages inline,
> so that I can work with documentation without leaving the platform.

### Acceptance Criteria
1. Renderização de blocos Notion: heading, paragraph, bulleted list, numbered list, toggle, callout, code, image, divider, table
2. Modo visualização como padrão (read-only)
3. Botão "Editar" ativa modo de edição com editor Tiptap
4. Edições sincronizadas de volta ao Notion via API (block-level updates)
5. Auto-save com debounce (2s após última edição)
6. Indicador visual de "salvando..." / "salvo"
7. Criar nova página: botão "+ Nova Página" com título e parent database/page

---

## File List

*Updated during development*

| File | Action | Story |
|------|--------|-------|
| — | — | — |
