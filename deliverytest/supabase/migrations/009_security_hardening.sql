-- ============================================================
-- Migration: Security Hardening (Phase 9)
-- Version: v0.09
-- Date: 2026-02-13
-- EXECUTE IN: Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ============================================================
-- 9A: set_main_address — Atomic main address toggle
-- Garantia: apenas 1 endereço "principal" por usuário
-- ============================================================

CREATE OR REPLACE FUNCTION set_main_address(target_address_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Get the authenticated user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Verify the address belongs to the user
    IF NOT EXISTS (
        SELECT 1 FROM user_addresses 
        WHERE id = target_address_id AND user_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Address not found or does not belong to user';
    END IF;

    -- Atomic: unmark all, then mark the target
    UPDATE user_addresses SET is_main = false WHERE user_id = v_user_id;
    UPDATE user_addresses SET is_main = true  WHERE id = target_address_id;
END;
$$;

-- ============================================================
-- 9B: create_order_validated — Server-side price recalculation
-- Recalcula preços no servidor a partir do catálogo atual.
-- O frontend envia items + endereço + método de pagamento.
-- O servidor busca os preços REAIS e cria o pedido.
-- ============================================================

CREATE OR REPLACE FUNCTION create_order_validated(
    p_address_id uuid,
    p_payment_method text,
    p_items jsonb  -- Array de { product_id, quantity }
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
    -- Get the authenticated user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Validate address belongs to user
    IF NOT EXISTS (
        SELECT 1 FROM user_addresses 
        WHERE id = p_address_id AND user_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Invalid address';
    END IF;

    -- Validate items array is not empty
    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Cart is empty';
    END IF;

    -- Calculate real subtotal from DB prices
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

    -- Create the order (discount = 0 for now, can add tier logic later)
    INSERT INTO orders (user_id, address_id, payment_method, status, subtotal, discount, total)
    VALUES (v_user_id, p_address_id, p_payment_method::payment_method, 'approved'::text, v_subtotal, 0, v_subtotal)
    RETURNING id INTO v_order_id;

    -- Create order items with server-verified prices
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

-- ============================================================
-- 9C: Admin RLS Policies
-- Verifica/cria policies restritivas para tabelas admin
-- ============================================================

-- Products: apenas admin pode INSERT/UPDATE/DELETE
-- (SELECT já deve estar aberto para todos os usuários logados)

-- Habilitar RLS (idempotente)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Limpa policies anteriores (idempotente)
DROP POLICY IF EXISTS "products_select_active" ON products;
DROP POLICY IF EXISTS "products_insert_admin" ON products;
DROP POLICY IF EXISTS "products_update_admin" ON products;
DROP POLICY IF EXISTS "products_delete_admin" ON products;

-- Policy: qualquer usuário logado pode ler produtos ativos (admin vê todos)
CREATE POLICY "products_select_active" ON products
    FOR SELECT USING (is_active = true OR auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

-- Policy: apenas admin pode inserir
CREATE POLICY "products_insert_admin" ON products
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

-- Policy: apenas admin pode atualizar
CREATE POLICY "products_update_admin" ON products
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

-- Policy: apenas admin pode deletar
CREATE POLICY "products_delete_admin" ON products
    FOR DELETE USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

-- ============================================================
-- DONE! Após executar, teste:
-- 1. set_main_address: Trocar endereço principal
-- 2. create_order_validated: Finalizar um pedido
-- 3. Como cliente normal, tentar editar produto (deve falhar)
-- ============================================================
