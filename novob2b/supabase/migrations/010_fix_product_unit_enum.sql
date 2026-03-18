-- ============================================================================
-- Migration 010: Adicionar 'bj' e 'pc' ao enum product_unit
-- ============================================================================
-- O enum original so tinha: un, kg, cx, maco, dz
-- A base real do Bubble usa: BJ (bandeja), PC (pacote)
-- ============================================================================

ALTER TYPE product_unit ADD VALUE IF NOT EXISTS 'bj';
ALTER TYPE product_unit ADD VALUE IF NOT EXISTS 'pc';

-- ============================================================================
-- FIM Migration 010
-- ============================================================================
