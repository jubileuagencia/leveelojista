-- ============================================================================
-- FIX: create_order_validated - TEXT → payment_method enum cast
-- ============================================================================
-- Problema: A coluna orders.payment_method é do tipo enum payment_method,
-- mas o parametro p_payment_method é TEXT. PostgreSQL nao faz cast implicito
-- de TEXT para enum, causando erro 42804:
-- "column payment_method is of type payment_method but expression is of type text"
-- Solucao: Adicionar cast explicito p_payment_method::payment_method no INSERT.
-- Execucao: Copiar e colar no Supabase SQL Editor > Run
-- ============================================================================

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
  v_item_total NUMERIC;
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
    IF (v_item ->> 'quantity')::INT <= 0 THEN
      RAISE EXCEPTION 'Quantidade invalida para produto: %', v_product.name;
    END IF;

    v_item_total := v_product.price * (v_item ->> 'quantity')::INT;
    v_subtotal := v_subtotal + v_item_total;
  END LOOP;

  v_discount := ROUND(v_subtotal * (v_discount_pct / 100), 2);
  v_total := v_subtotal - v_discount;

  INSERT INTO orders (user_id, address_id, status, payment_method, subtotal, discount, total)
  VALUES (v_user_id, p_address_id, 'pending', p_payment_method::payment_method, v_subtotal, v_discount, v_total)
  RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT price INTO v_product FROM products WHERE id = (v_item ->> 'product_id')::UUID;

    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
    VALUES (
      v_order_id,
      (v_item ->> 'product_id')::UUID,
      (v_item ->> 'quantity')::INT,
      v_product.price,
      v_product.price * (v_item ->> 'quantity')::INT
    );
  END LOOP;

  DELETE FROM cart_items WHERE user_id = v_user_id;

  RETURN v_order_id;
END;
$$;

COMMENT ON FUNCTION create_order_validated(UUID, TEXT, JSONB) IS
  'Cria pedido com validacao server-side de precos, desconto por tier e itens. Usa JSONB para compatibilidade com PostgREST.';
