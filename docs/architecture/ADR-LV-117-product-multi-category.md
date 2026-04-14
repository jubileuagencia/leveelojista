# ADR — Produtos com Múltiplas Categorias (novob2b)

- **ID:** ADR-LV-117
- **Status:** Accepted
- **Data:** 2026-04-14
- **Autor:** Aria (Architect)
- **Contexto:** LV-117 / novob2b (Levee)
- **Consumido por:** LV-118 (Supabase eng), LV-119 (dev services), LV-120 (admin form), LV-121 (catalog UI), LV-122 (QA)

---

## 1. Contexto

Hoje `products.category_id UUID` é 1-N (cada produto pertence a uma única categoria). Precisamos suportar N-N (um produto em várias categorias).

**Base real auditada (2026-04-14, prod):**
- `1.017` produtos totais
- `115` produtos com `category_id = NULL` (~11%) — decisão de migração relevante
- `16` categorias ativas
- Consumidores de `category_id` / nested `categories(*)`:
  - `src/features/catalog/services/products.ts` (5 funções)
  - `src/features/admin/services/products.ts` (listar/criar/atualizar)
  - `src/stores/cart-store.ts` (2 selects)
  - `src/features/favorites/services/favorites.ts` (2 selects)
  - `ProductCard.tsx` lê `product.categories?.name`

## 2. Decisão 1 — Modelagem

### Comparativo

| Opção | Prós | Contras |
|-------|------|---------|
| A) **Junction table `product_categories`** | Padrão relacional, queries indexáveis, FKs, compatível com Supabase nested selects | Precisa migration + backfill |
| B) Coluna `category_ids uuid[]` em products | Sem tabela nova | Sem FK nativa por item do array, joins esquisitos, perde integridade se categoria é deletada |
| C) JSONB `categories` | Flexibilidade máxima | Sem constraints, sem nested select amigável |

### Decisão

**Adotar Opção A — junction table `product_categories`.**

```sql
-- Schema proposto
CREATE TABLE product_categories (
  product_id   uuid NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
  category_id  uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  is_primary   boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, category_id)
);

CREATE INDEX idx_product_categories_category ON product_categories(category_id);
CREATE INDEX idx_product_categories_product  ON product_categories(product_id);

-- Garante no máximo 1 categoria primária por produto
CREATE UNIQUE INDEX idx_product_categories_primary
  ON product_categories(product_id)
  WHERE is_primary = true;
```

**Justificativa:**
- `ON DELETE CASCADE` em `product_id`: deletar produto limpa vínculos (consistência).
- `ON DELETE RESTRICT` em `category_id`: impede deletar categoria que ainda tem produtos (evita acidente); o admin precisa reatribuir antes de deletar.
- `is_primary`: mantém o conceito de "categoria principal" (útil para breadcrumbs, SEO, sort default). **1 primária por produto** enforced via partial unique index.
- PK composta (product_id, category_id) impede duplicatas.
- Índices nas duas FKs cobrem joins em ambas direções.

## 3. Decisão 2 — Coluna `products.category_id`

### Opções

| Opção | Efeito |
|-------|--------|
| A) Manter `products.category_id` como "atalho da primária" | Backward-compatible, todos os callers antigos continuam funcionando. Duplica informação de `is_primary` |
| B) Dropar `products.category_id` imediatamente | Single source of truth. Requer atualizar TODOS os callers na mesma migration |
| C) **Manter durante migração, depreciar em task separada** | Dual-write temporário, rollout gradual, menos risco |

### Decisão

**Opção C — manter `products.category_id` durante transição.**

- **LV-118 (migration)**: cria `product_categories`, backfill, RLS. NÃO toca em `products.category_id`.
- **LV-119/120**: services/admin passam a ler/escrever em `product_categories` **e** manter `products.category_id` sincronizado com a primária (dual-write).
- **Task futura (fora deste epic)**: depois que todos os consumidores estiverem usando `product_categories`, remover `products.category_id` com migration `DROP COLUMN`.

**Regra de sincronização dual-write (LV-119):**
- Ao criar/atualizar um produto:
  1. Grava em `product_categories` todas as categorias selecionadas
  2. Marca como `is_primary = true` a primeira (ou a escolhida explicitamente)
  3. Copia o `category_id` da primária em `products.category_id`

Se a task de remoção for adiada ou cancelada, o app permanece funcional indefinidamente.

## 4. Decisão 3 — RLS

### Decisão

Espelhar as policies de `products`. Como `product_categories` é tabela de relacionamento, a regra é: **qualquer usuário que pode ler/escrever um `product` pode ler/escrever o vínculo**.

```sql
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Read: qualquer autenticado (espelha products)
CREATE POLICY "product_categories_select" ON product_categories
  FOR SELECT TO authenticated
  USING (true);

-- Write: somente admin (espelha products)
CREATE POLICY "product_categories_write_admin" ON product_categories
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
```

> **Observação para LV-118:** as policies reais de `products` devem ser consultadas em `pg_policies` e espelhadas literalmente — o esqueleto acima assume o padrão `profiles.role = 'admin'`. Se o projeto usar outra flag (ex.: `is_admin`, `role IN (...)`), ajustar na migration.

## 5. Decisão 4 — Backfill

```sql
-- Dentro da mesma migration, após criar a tabela:
INSERT INTO product_categories (product_id, category_id, is_primary)
SELECT id, category_id, true
FROM products
WHERE category_id IS NOT NULL;
```

**Produtos com `category_id = NULL` (115 hoje):** não geram linha em `product_categories`. **Decisão:** não forçar categoria default ("Outros") automaticamente — o admin decide caso a caso. O front precisa lidar com array vazio de categorias.

Validação pós-backfill (roda no script da migration e também manual):
```sql
SELECT
  (SELECT count(*) FROM products WHERE category_id IS NOT NULL) AS products_with_cat,
  (SELECT count(*) FROM product_categories WHERE is_primary) AS pc_primary_count;
-- ambos devem ser iguais
```

## 6. Decisão 5 — Nested select do Supabase

Padrão para LV-119 substituir `categories(*)` atual:

### Antes (1-N)
```ts
supabase.from('products').select('*, categories(*)')
// retorna: { …product, categories: { id, name, … } }
```

### Depois (N-N)
```ts
supabase.from('products').select(`
  *,
  category_links:product_categories(
    is_primary,
    category:categories(id, name, slug, sort_order)
  )
`)
// retorna: { …product, category_links: [ { is_primary, category: {...} }, ... ] }
```

### Helper para normalizar no front (LV-119 cria)
```ts
function normalizeProduct<T extends { category_links?: Array<{is_primary: boolean, category: Category}> }>(p: T) {
  const categories = (p.category_links ?? []).map(l => l.category)
  const primary = p.category_links?.find(l => l.is_primary)?.category ?? categories[0] ?? null
  return { ...p, categories, primaryCategory: primary }
}
```

**Types em `src/types/database.ts`** (LV-119):
```ts
interface Product {
  id: string
  name: string
  // ...existing
  category_id: string | null        // deprecated, manter
  categories?: Category[]            // NOVO: array derivado de product_categories
  primaryCategory?: Category | null  // NOVO: atalho para a primária
}
```

## 7. Impacto por arquivo (mapa para LV-119/120/121)

| Arquivo | Mudança |
|---------|---------|
| `supabase/migrations/..._product_categories.sql` | **LV-118** — cria tabela, índices, RLS, backfill |
| `src/types/database.ts` | LV-119 — add `categories: Category[]`, `primaryCategory: Category \| null` em Product |
| `src/features/catalog/services/products.ts` | LV-119 — trocar nested select + normalize; filtro por categoria via `product_categories!inner(category_id=eq.X)` |
| `src/features/admin/services/products.ts` | LV-119 — `create/update` aceita `categoryIds: string[]` + `primaryCategoryId?: string`, grava em product_categories **e** sincroniza `products.category_id` |
| `src/features/admin/components/ProductFormModal.tsx` | LV-120 — trocar Select single por MultiSelect (shadcn + Command); radio para marcar primária |
| `src/features/admin/hooks/useProducts.ts` | LV-120 — ajustar payload |
| `src/stores/cart-store.ts` | LV-119 — nested select atualizado |
| `src/features/favorites/services/favorites.ts` | LV-119 — nested select atualizado |
| `src/features/catalog/components/ProductCard.tsx` | LV-121 — renderizar `product.categories` como badges (truncar em 2 + "+N") |
| `src/features/catalog/pages/ProductPage.tsx` | LV-121 — listar todas as categorias, cada uma linka para `/?categoria={id}` |

## 8. Riscos e mitigação

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| Consumidor esquecido ainda lê `product.categories.name` (singular, 1-N) e quebra | Alta | Helper `normalizeProduct` preserva `primaryCategory`; grep exaustivo em LV-119 |
| Filtro por categoria em `getProducts({categoryId})` para de funcionar | Alta | Mudar para `eq` em `product_categories` via `!inner` join + distinct (Supabase) |
| Produto com `products.category_id` divergente de `is_primary` em `product_categories` (estado inválido) | Média | Dual-write rígido em LV-119; teste de invariante no QA LV-122 |
| Admin deleta categoria em uso | Baixa | FK `ON DELETE RESTRICT` bloqueia; UX mostra erro claro |
| RLS deixa brecha | Média | Policies espelhadas de products + revisão em LV-118 |
| Bundle/perf: cada produto traz array de categorias aninhado | Baixa | Lista atual de 10 itens/carrossel; grid tem no máx ~1k; aceitável |

## 9. Rollback

- **Migration**: `DROP TABLE product_categories CASCADE` — `products.category_id` ainda está lá com dados intactos.
- **Código**: reverter PRs de LV-119/120/121.

Como `products.category_id` nunca é tocado nesta fase, rollback é limpo.

## 10. Plano de execução (ordem recomendada)

```
LV-118  ──┐
          ▼
LV-119  ──┬─────┐
          ▼     ▼
        LV-120 LV-121
          │     │
          └──┬──┘
             ▼
          LV-122
```

1. **LV-118** Supabase eng: migration + backfill + validação SQL.
2. **LV-119** Dev: services + types + dual-write + normalize helper. Smoke test manual.
3. **LV-120** Frontend Lead: ProductFormModal multiselect + radio primária. Teste manual admin.
4. **LV-121** Frontend Lead (pode paralelizar com 120): badges em ProductCard + chips em ProductPage.
5. **LV-122** QA: cenários end-to-end.

## 11. Definition of Done para LV-117

- [x] Schema SQL definido com justificativa de cada constraint
- [x] Decisão sobre `products.category_id` (manter durante transição)
- [x] Plano de RLS
- [x] Plano de backfill com tratamento de NULLs
- [x] Padrão de nested select + helper de normalização
- [x] Mapa de impacto por arquivo
- [x] Riscos e mitigação
- [x] Rollback
- [x] Ordem de execução
