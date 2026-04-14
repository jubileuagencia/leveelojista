-- ============================================================================
-- Migration 015: Data estimada de entrega (T7.1)
-- ============================================================================
-- 1. Adicionar coluna estimated_delivery_date em orders
-- 2. Atualizar RPC create_order_validated para calcular e salvar a data
-- Regra:
--   - Se pedido antes do horario de corte (config) → entrega dia seguinte
--   - Se pedido depois do corte → entrega daqui 2 dias
-- Agente: @dev | Data: 2026-03-18
-- ============================================================================

-- 1. Adicionar coluna
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;

-- 2. Backfill: pedidos existentes recebem created_at + 1 dia
UPDATE orders
SET estimated_delivery_date = (created_at AT TIME ZONE 'America/Sao_Paulo')::DATE + INTERVAL '1 day'
WHERE estimated_delivery_date IS NULL;

-- 3. Atualizar RPC create_order_validated com calculo de data de entrega
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
  v_delivery_config JSONB;
  v_cutoff_time TIME := '18:00';
  v_now_sp TIMESTAMPTZ;
  v_current_time TIME;
  v_estimated_date DATE;
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

  -- Buscar tier do usuario
  SELECT tier::TEXT INTO v_user_tier FROM profiles WHERE id = v_user_id;

  SELECT value::JSONB INTO v_tier_config FROM app_config WHERE key = 'tier_discounts';

  IF v_tier_config IS NOT NULL AND v_user_tier IS NOT NULL THEN
    v_discount_pct := COALESCE((v_tier_config ->> v_user_tier)::NUMERIC, 0);
  END IF;

  -- Buscar config de entrega (horario de corte)
  SELECT value::JSONB INTO v_delivery_config FROM app_config WHERE key = 'delivery_config';

  IF v_delivery_config IS NOT NULL AND v_delivery_config ->> 'order_cutoff_time' IS NOT NULL THEN
    v_cutoff_time := (v_delivery_config ->> 'order_cutoff_time')::TIME;
  END IF;

  -- Calcular data estimada de entrega (timezone SP)
  v_now_sp := NOW() AT TIME ZONE 'America/Sao_Paulo';
  v_current_time := v_now_sp::TIME;

  IF v_current_time < v_cutoff_time THEN
    -- Antes do corte: entrega amanha
    v_estimated_date := v_now_sp::DATE + 1;
  ELSE
    -- Depois do corte: entrega em 2 dias
    v_estimated_date := v_now_sp::DATE + 2;
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

  INSERT INTO orders (user_id, address_id, status, payment_method, subtotal, discount, total, estimated_delivery_date)
  VALUES (v_user_id, p_address_id, 'pending', p_payment_method::payment_method, v_subtotal, v_discount, v_total, v_estimated_date)
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
  'Cria pedido com validacao server-side. Suporta variantes. Calcula estimated_delivery_date baseado em horario de corte (delivery_config).';

-- ============================================================================
-- FIM Migration 015
-- ============================================================================
