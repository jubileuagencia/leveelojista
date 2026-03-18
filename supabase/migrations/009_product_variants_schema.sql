-- ============================================================================
-- Migration 009: Schema de Produtos com Variantes de Unidade (T5.1)
-- ============================================================================
-- Cria tabela product_variants e adiciona campos novos em products.
-- Parte da FASE 5 — Fundacao do novob2b.
-- Agente: @data-engineer
-- Data: 2026-03-18
-- ============================================================================

-- 1. Novos campos em products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sku TEXT,
  ADD COLUMN IF NOT EXISTS ean TEXT,
  ADD COLUMN IF NOT EXISTS original_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS nutritional_info TEXT,
  ADD COLUMN IF NOT EXISTS storage_instructions TEXT,
  ADD COLUMN IF NOT EXISTS on_sale BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sale_discount_pct NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- 2. Tabela product_variants
CREATE TABLE IF NOT EXISTS product_variants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  unit_type        TEXT NOT NULL,  -- 'kg', 'un', 'bj', 'pc', 'cx'
  unit_label       TEXT,           -- ex: "Caixa 20kg", "Bandeja 500g"
  unit_price       NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  weight_grams     INTEGER,       -- peso em gramas desta variante
  allows_fractional BOOLEAN NOT NULL DEFAULT FALSE,  -- true so para KG
  is_default       BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Indices
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_variants_unique_type
  ON product_variants (product_id, unit_type);

CREATE INDEX IF NOT EXISTS idx_product_variants_product
  ON product_variants (product_id);

CREATE INDEX IF NOT EXISTS idx_product_variants_default
  ON product_variants (product_id, is_default)
  WHERE is_default = TRUE;

CREATE INDEX IF NOT EXISTS idx_products_sku
  ON products (sku)
  WHERE sku IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_ean
  ON products (ean)
  WHERE ean IS NOT NULL;

-- 4. RLS para product_variants (mesmas regras de products)
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Clientes leem variantes de produtos ativos
CREATE POLICY "Clientes leem variantes de produtos ativos"
  ON product_variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_variants.product_id
        AND p.is_active = TRUE
        AND p.deleted_at IS NULL
    )
  );

-- Admins CRUD total
CREATE POLICY "Admins gerenciam variantes"
  ON product_variants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- 5. Comentario
COMMENT ON TABLE product_variants IS 'Variantes de venda de um produto (KG, UN, BJ, PC, CX). Um produto pode ter N variantes com precos e pesos diferentes.';
COMMENT ON COLUMN product_variants.unit_type IS 'Tipo de unidade: kg, un, bj (bandeja), pc (pacote), cx (caixa)';
COMMENT ON COLUMN product_variants.allows_fractional IS 'Permite quantidades fracionadas (ex: 2.5kg). True somente para KG.';

-- ============================================================================
-- FIM Migration 009
-- ============================================================================
