-- Migration: product_categories (N-N products ↔ categories)
-- Task: LV-118 | ADR: LV-117
-- Author: Supabase Engineer
-- Date: 2026-04-14
--
-- Cria a tabela de vínculo produto↔categoria, mantendo products.category_id
-- intacto durante a transição (dual-write em LV-119).
--
-- Rollback: DROP TABLE product_categories CASCADE;
-- (products.category_id permanece com os dados originais — rollback limpo.)
-- ============================================================================

BEGIN;

-- 1) Tabela
CREATE TABLE IF NOT EXISTS product_categories (
  product_id   uuid        NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
  category_id  uuid        NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  is_primary   boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, category_id)
);

COMMENT ON TABLE  product_categories           IS 'Vínculo N-N produto↔categoria. Substitui products.category_id (mantido durante transição).';
COMMENT ON COLUMN product_categories.is_primary IS 'Marca a categoria principal do produto (1 por produto, enforced via partial unique index).';

-- 2) Índices
CREATE INDEX IF NOT EXISTS idx_product_categories_category ON product_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_product  ON product_categories(product_id);

-- Garante no máximo 1 categoria primária por produto
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_categories_primary
  ON product_categories(product_id)
  WHERE is_primary = true;

-- 3) RLS (espelha policies de products — função is_admin() já existe no schema)
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_categories_customer_select" ON product_categories;
DROP POLICY IF EXISTS "product_categories_admin_select"    ON product_categories;
DROP POLICY IF EXISTS "product_categories_admin_insert"    ON product_categories;
DROP POLICY IF EXISTS "product_categories_admin_update"    ON product_categories;
DROP POLICY IF EXISTS "product_categories_admin_delete"    ON product_categories;

-- Customer só vê vínculos de produtos ativos/não deletados (espelha products_customer_select)
CREATE POLICY "product_categories_customer_select" ON product_categories FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_categories.product_id
        AND products.is_active = TRUE
        AND products.deleted_at IS NULL
    )
  );

CREATE POLICY "product_categories_admin_select" ON product_categories FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "product_categories_admin_insert" ON product_categories FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "product_categories_admin_update" ON product_categories FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "product_categories_admin_delete" ON product_categories FOR DELETE TO authenticated
  USING (is_admin());

-- 4) Backfill a partir de products.category_id
-- Produtos com category_id NULL (115 hoje) NÃO geram linha — admin decide caso a caso.
-- Uso ON CONFLICT DO NOTHING pra migration ser idempotente.
INSERT INTO product_categories (product_id, category_id, is_primary)
SELECT id, category_id, true
FROM products
WHERE category_id IS NOT NULL
ON CONFLICT (product_id, category_id) DO NOTHING;

-- 5) Validação de invariante pós-backfill
-- Ambos os counts devem ser iguais. Se divergirem, aborta via exception.
DO $$
DECLARE
  v_products_with_cat int;
  v_pc_primary        int;
BEGIN
  SELECT count(*) INTO v_products_with_cat FROM products WHERE category_id IS NOT NULL;
  SELECT count(*) INTO v_pc_primary        FROM product_categories WHERE is_primary = true;

  IF v_products_with_cat <> v_pc_primary THEN
    RAISE EXCEPTION
      'Backfill inconsistente: products.category_id NOT NULL = %, product_categories.is_primary = %',
      v_products_with_cat, v_pc_primary;
  END IF;

  RAISE NOTICE 'Backfill OK: % produtos com categoria primária migrados.', v_pc_primary;
END $$;

COMMIT;
