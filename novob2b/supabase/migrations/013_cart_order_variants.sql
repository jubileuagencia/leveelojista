-- ============================================================================
-- Migration 013: Suporte a variantes no carrinho e pedidos (T5.4)
-- ============================================================================
-- 1. Adicionar variant_id em cart_items e order_items
-- 2. Alterar quantity de INTEGER para NUMERIC (suportar fracionado p/ KG)
-- 3. Adicionar unit_type em order_items (snapshot da unidade)
-- 4. Atualizar constraint UNIQUE de cart_items
-- 5. Atualizar RPC create_order_validated para usar variante
-- Agente: @dev | Data: 2026-03-18
-- ============================================================================

-- 1. cart_items: adicionar variant_id + alterar quantity para NUMERIC
ALTER TABLE cart_items
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE;

ALTER TABLE cart_items
  ALTER COLUMN quantity TYPE NUMERIC USING quantity::NUMERIC;

-- Trocar constraint UNIQUE: (user_id, product_id) → (user_id, product_id, variant_id)
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS cart_items_user_product_variant_key
  ON cart_items (user_id, product_id, COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'));

-- 2. order_items: adicionar variant_id + unit_type + alterar quantity
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS unit_type TEXT;

ALTER TABLE order_items
  ALTER COLUMN quantity TYPE NUMERIC USING quantity::NUMERIC;

-- 3. Backfill: linkar cart_items/order_items existentes à variante default
UPDATE cart_items ci
SET variant_id = pv.id
FROM product_variants pv
WHERE pv.product_id = ci.product_id
  AND pv.is_default = true
  AND ci.variant_id IS NULL;

UPDATE order_items oi
SET variant_id = pv.id,
    unit_type = pv.unit_type
FROM product_variants pv
WHERE pv.product_id = oi.product_id
  AND pv.is_default = true
  AND oi.variant_id IS NULL;

-- 4. Atualizar RPC create_order_validated para usar preço da variante
DROP FUNCTION IF EXISTS create_order_validated(UUID, TEXT, JSONB);

CREATE OR REPLACE FUNCTION create_order_validated(
  p_address_id UUID,
  p_payment_method TEXT,
  p_items JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_user_tier TEXT;
  v_discount_pct NUMERIC := 0;
  v_tier_config JSONB;
  v_subtotal NUMERIC := 0;
  v_discount NUMERIC := 0;
  v_total NUMERIC := 0;
  v_order_id UUID;
  v_item JSONB;
  v_product RECORD;
  v_variant RECORD;
  v_unit_price NUMERIC;
  v_item_total NUMERIC;
  v_unit_type TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario nao autenticado';
  END IF;

  IF p_payment_method NOT IN ('pix', 'boleto') THEN
    RAISE EXCEPTION 'Metodo de pagamento invalido: %', p_payment_method;
  END IF;

  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Pedido deve conter ao menos um item';
  END IF;

  IF p_address_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM user_addresses WHERE id = p_address_id AND user_id = v_user_id
    ) THEN
      RAISE EXCEPTION 'Endereco nao encontrado ou nao pertence ao usuario';
    END IF;
  END IF;

  SELECT tier::TEXT INTO v_user_tier FROM profiles WHERE id = v_user_id;

  SELECT value::JSONB INTO v_tier_config FROM app_config WHERE key = 'tier_discounts';

  IF v_tier_config IS NOT NULL AND v_user_tier IS NOT NULL THEN
    v_discount_pct := COALESCE((v_tier_config ->> v_user_tier)::NUMERIC, 0);
  END IF;

  -- Primeira passada: validar e calcular subtotal
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT id, price, name, is_active, deleted_at INTO v_product
    FROM products WHERE id = (v_item ->> 'product_id')::UUID;

    IF v_product IS NULL THEN
      RAISE EXCEPTION 'Produto nao encontrado: %', v_item ->> 'product_id';
    END IF;
    IF NOT v_product.is_active THEN
      RAISE EXCEPTION 'Produto inativo: %', v_product.name;
    END IF;
    IF v_product.deleted_at IS NOT NULL THEN
      RAISE EXCEPTION 'Produto removido: %', v_product.name;
    END IF;
    IF (v_item ->> 'quantity')::NUMERIC <= 0 THEN
      RAISE EXCEPTION 'Quantidade invalida para produto: %', v_product.name;
    END IF;

    -- Usar preco da variante se variant_id fornecido, senao preco do produto
    IF v_item ->> 'variant_id' IS NOT NULL THEN
      SELECT unit_price, unit_type INTO v_variant
      FROM product_variants
      WHERE id = (v_item ->> 'variant_id')::UUID
        AND product_id = (v_item ->> 'product_id')::UUID;

      IF v_variant IS NULL THEN
        RAISE EXCEPTION 'Variante nao encontrada para produto: %', v_product.name;
      END IF;
      v_unit_price := v_variant.unit_price;
    ELSE
      v_unit_price := v_product.price;
    END IF;

    v_item_total := v_unit_price * (v_item ->> 'quantity')::NUMERIC;
    v_subtotal := v_subtotal + v_item_total;
  END LOOP;

  v_discount := ROUND(v_subtotal * (v_discount_pct / 100), 2);
  v_total := v_subtotal - v_discount;

  INSERT INTO orders (user_id, address_id, status, payment_method, subtotal, discount, total)
  VALUES (v_user_id, p_address_id, 'pending', p_payment_method, v_subtotal, v_discount, v_total)
  RETURNING id INTO v_order_id;

  -- Segunda passada: inserir order_items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_unit_type := NULL;

    IF v_item ->> 'variant_id' IS NOT NULL THEN
      SELECT unit_price, unit_type INTO v_variant
      FROM product_variants
      WHERE id = (v_item ->> 'variant_id')::UUID;
      v_unit_price := v_variant.unit_price;
      v_unit_type := v_variant.unit_type;
    ELSE
      SELECT price INTO v_unit_price FROM products WHERE id = (v_item ->> 'product_id')::UUID;
    END IF;

    INSERT INTO order_items (order_id, product_id, variant_id, quantity, unit_price, total_price, unit_type)
    VALUES (
      v_order_id,
      (v_item ->> 'product_id')::UUID,
      CASE WHEN v_item ->> 'variant_id' IS NOT NULL
        THEN (v_item ->> 'variant_id')::UUID
        ELSE NULL
      END,
      (v_item ->> 'quantity')::NUMERIC,
      v_unit_price,
      v_unit_price * (v_item ->> 'quantity')::NUMERIC,
      v_unit_type
    );
  END LOOP;

  DELETE FROM cart_items WHERE user_id = v_user_id;

  RETURN v_order_id;
END;
$$;

COMMENT ON FUNCTION create_order_validated(UUID, TEXT, JSONB) IS
  'Cria pedido com validacao server-side. Suporta variantes de produto (variant_id). Usa preco da variante quando fornecido.';

-- ============================================================================
-- FIM Migration 013
-- ============================================================================
