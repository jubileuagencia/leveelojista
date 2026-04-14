# Arquivos para Revisar com @dev

> Estes 10 arquivos existiam apenas na branch local `feature/fase-5-fundacao` (commits de 2026-03-23)
> e **nunca foram pushados** ao GitHub `jubileuagencia/leveelojista`.
>
> Foram copiados de volta apos o clone fresh da `main` em 2026-04-10.
> Cada arquivo texto tem o marcador `[REVISAR-COM-DEV]` na primeira linha.

## Decisao necessaria para cada arquivo

| # | Arquivo | Tipo | Acao sugerida |
|---|---------|------|---------------|
| 1 | `TASKS-CORRECOES-FRONTEND.md` | Doc | Manter? Ainda relevante? |
| 2 | `public/logo.png` | Asset | Logo melancia — integrar definitivamente? |
| 3 | `supabase/migrations/016_categories_featured.sql` | Migration | Aplicar no Supabase? Conflita com 009-014? |
| 4 | `docs/tasks/categorias-destaque-home.md` | Doc/Task | Tarefa ainda pendente? |
| 5 | `docs/ux-specs/home-redesign-ideias.md` | UX Spec | Ideias aprovadas ou descartadas? |
| 6 | `docs/ux-specs/categories-page-spec.md` | UX Spec | Spec aprovada? |
| 7 | `src/features/account/pages/ProfilePage.tsx` | Componente | Feature pronta ou placeholder? |
| 8 | `src/features/catalog/pages/CategoriesPage.tsx` | Componente | Feature pronta ou placeholder? |
| 9 | `src/components/ui/Logo.tsx` | Componente | Necessario para o app? |
| 10 | `unnamed-removebg-preview (1).png` | Asset | Lixo? Renomear e mover? Deletar? |

## Como encontrar os arquivos sinalizados

```bash
grep -r "REVISAR-COM-DEV" --include="*.tsx" --include="*.ts" --include="*.md" --include="*.sql" .
```

## Origem

- **Branch local:** `feature/fase-5-fundacao` (4 commits de 2026-03-23, nunca pushados)
- **Clone base:** `jubileuagencia/leveelojista` main @ `b95d3b2` (2026-03-24)
- **Operacao:** @devops em 2026-04-10
