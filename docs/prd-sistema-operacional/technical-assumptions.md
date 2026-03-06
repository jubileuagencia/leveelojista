# Technical Assumptions

**Source:** `docs/prd-sistema-operacional.md`

## Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router) | 15.x |
| Runtime | Node.js | 20.x LTS |
| Language | TypeScript | 5.x (strict mode) |
| UI Components | shadcn/ui | latest |
| Styling | Tailwind CSS | 4.x |
| State Management | Zustand | 5.x |
| Data Fetching | TanStack Query | 5.x |
| Forms | React Hook Form + Zod | latest |
| Database | Supabase (PostgreSQL 15) | latest |
| Auth | Auth.js v5 | 5.x |
| Icons | Lucide React | latest |
| Drag & Drop | @dnd-kit | latest |
| Rich Text | Tiptap | 2.x |
| Deploy | Vercel | — |
| Package Manager | pnpm | 9.x |

## Architecture

- **Serverless Monolith** via Next.js App Router
- **BFF Pattern**: API Routes como proxy autenticado para APIs externas
- **Supabase RLS** para isolamento de dados por tenant
- **Monorepo**: Single Next.js project (não monorepo)
- **i18n**: Não requisito para MVP (apenas pt-BR)
- **PWA**: manifest + service worker para offline básico e push notifications

## External APIs

| Serviço | Auth Method |
|---------|-------------|
| ClickUp API v2 | Personal Token |
| Notion API | Integration Token |
| Google Drive API v3 | OAuth 2.0 Service Account |
| Slack Web API | Bot Token |
| Claude API | API Key |

## Testing

- Unit: Vitest (70% cobertura lógica de negócio)
- Component: Testing Library (50% geral)
- E2E: Playwright (fluxos críticos)
