-- Fix: cast payment_method para enum
-- Executar no Supabase SQL Editor

CREATE OR REPLACE FUNCTION create_order_validated(
    p_address_id uuid,
    p_payment_method text,
    p_items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
    v_order_id uuid;
    v_subtotal numeric := 0;
    v_item jsonb;
    v_product record;
    v_line_total numeric;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM user_addresses 
        WHERE id = p_address_id AND user_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Invalid address';
    END IF;

    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Cart is empty';
    END IF;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        SELECT id, price, is_active INTO v_product
        FROM products
        WHERE id = (v_item->>'product_id')::uuid;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product not found: %', v_item->>'product_id';
        END IF;

        IF NOT v_product.is_active THEN
            RAISE EXCEPTION 'Product is inactive: %', v_item->>'product_id';
        END IF;

        v_line_total := v_product.price * (v_item->>'quantity')::integer;
        v_subtotal := v_subtotal + v_line_total;
    END LOOP;

    INSERT INTO orders (user_id, address_id, payment_method, status, subtotal, discount, total)
    VALUES (v_user_id, p_address_id, p_payment_method::payment_method, 'approved'::order_status, v_subtotal, 0, v_subtotal)
    RETURNING id INTO v_order_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        SELECT price INTO v_product FROM products WHERE id = (v_item->>'product_id')::uuid;

        INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
        VALUES (
            v_order_id,
            (v_item->>'product_id')::uuid,
            (v_item->>'quantity')::integer,
            v_product.price,
            v_product.price * (v_item->>'quantity')::integer
        );
    END LOOP;

    RETURN v_order_id;
END;
$$;
