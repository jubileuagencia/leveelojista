-- Migration: trigger re-eleição automática de categoria primária
-- Task: LV-125 | ADR: LV-117
-- Author: Supabase Engineer
-- Date: 2026-04-14
--
-- Quando uma linha de product_categories é deletada e ela era a primária
-- (is_primary = true), o trigger promove a mais antiga remanescente do mesmo
-- produto a primária. Cobre:
--   - CASCADE quando uma categoria é deletada (ON DELETE CASCADE de category_id)
--   - DELETE explícito pelo syncProductCategories (admin trocando vínculos)
--
-- Sem dual-write (products.category_id já foi dropada em LV-124).
--
-- Rollback: DROP TRIGGER + DROP FUNCTION (ver final do arquivo).
-- ============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION reelect_primary_category()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Só age se o vínculo deletado era a primária
  IF OLD.is_primary THEN
    UPDATE product_categories
    SET is_primary = true
    WHERE product_id = OLD.product_id
      AND category_id = (
        SELECT category_id
        FROM product_categories
        WHERE product_id = OLD.product_id
        ORDER BY created_at ASC, category_id ASC
        LIMIT 1
      );
    -- Se não houver remanescentes, UPDATE afeta 0 linhas — silencioso, OK.
  END IF;
  RETURN OLD;
END;
$$;

COMMENT ON FUNCTION reelect_primary_category() IS
  'AFTER DELETE em product_categories: se a primária foi removida, promove a mais antiga remanescente. LV-125.';

DROP TRIGGER IF EXISTS trg_reelect_primary_category ON product_categories;

CREATE TRIGGER trg_reelect_primary_category
  AFTER DELETE ON product_categories
  FOR EACH ROW
  EXECUTE FUNCTION reelect_primary_category();

COMMIT;

-- ============================================================================
-- Rollback (manual):
--   DROP TRIGGER IF EXISTS trg_reelect_primary_category ON product_categories;
--   DROP FUNCTION IF EXISTS reelect_primary_category();
-- ============================================================================
