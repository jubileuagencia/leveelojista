-- Migration: drop products.category_id (fim da transição N-N)
-- Task: LV-124 | ADR: LV-117
-- Author: Supabase Engineer
-- Date: 2026-04-14
--
-- Pré-requisitos validados:
--   1. LV-119 migrou todos os consumidores de app para product_categories
--   2. LV-120 admin form envia categoryIds[] (N-N)
--   3. LV-122 QA confirmou end-to-end
--   4. LV-123 removeu category_id dos inputs/types e corrigiu SearchPage
--   5. Dual-write removido (services admin não gravam mais em products.category_id)
--   6. Autorização de Diego para dropar bulk_upsert_products (Google Sheets Sync
--      será refeito fora deste epic)
--
-- Rollback:
--   - Re-adicionar coluna: ALTER TABLE products ADD COLUMN category_id uuid
--     REFERENCES categories(id) ON DELETE SET NULL;
--   - Backfill: UPDATE products SET category_id = pc.category_id
--     FROM product_categories pc
--     WHERE pc.product_id = products.id AND pc.is_primary = true;
--   - Re-criar função bulk_upsert_products a partir da migration 008.
-- ============================================================================

BEGIN;

-- 1) Drop função do Google Sheets Sync (será reescrita fora deste epic)
DROP FUNCTION IF EXISTS bulk_upsert_products(jsonb);

-- 2) Drop índice auxiliar (seria removido pelo DROP COLUMN CASCADE, mas explicito)
DROP INDEX IF EXISTS idx_products_category_id;

-- 3) Drop a coluna legacy
ALTER TABLE products DROP COLUMN IF EXISTS category_id;

-- 4) Validação pós-drop
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category_id'
  ) THEN
    RAISE EXCEPTION 'DROP COLUMN falhou: products.category_id ainda existe';
  END IF;

  RAISE NOTICE 'products.category_id removido com sucesso.';
END $$;

COMMIT;
