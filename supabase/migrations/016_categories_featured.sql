-- ============================================================================
-- Migration 016: Campo is_featured em categories
-- ============================================================================
-- Permite ao admin marcar categorias como destaque para exibir na Home.
-- Categorias nao-destaque aparecem apenas na pagina /categorias (tabs).
-- Agente: @data-engineer | Data: 2026-03-23
-- ============================================================================

-- 1. Adicionar coluna
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

-- 2. Backfill: marcar as primeiras 5 categorias (por sort_order) como destaque
UPDATE categories
SET is_featured = true
WHERE id IN (
  SELECT id FROM categories
  ORDER BY sort_order ASC, name ASC
  LIMIT 5
);
