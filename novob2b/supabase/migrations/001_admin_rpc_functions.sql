-- ============================================================================
-- NOVOB2B - Admin RPC Functions
-- ============================================================================
-- Arquivo: 001_admin_rpc_functions.sql
-- Descricao: Funcoes RPC para o painel administrativo.
--            Todas as funcoes exigem autenticacao e verificacao de role admin.
-- Autor: @data-engineer (Synkra AIOS)
-- Data: 2026-02-25
-- Execucao: Copiar e colar no Supabase SQL Editor > Run
-- ============================================================================

-- ============================================================================
-- FUNCAO AUXILIAR: Verificar se o usuario autenticado e admin
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$;

COMMENT ON FUNCTION is_admin() IS
  'Verifica se o usuario autenticado possui role admin ou super_admin.';


CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  );
$$;

COMMENT ON FUNCTION is_super_admin() IS
  'Verifica se o usuario autenticado possui role super_admin.';


-- ============================================================================
-- 1. get_dashboard_metrics()
-- ============================================================================
-- Retorna as 4 metricas principais do dashboard admin.
-- Usado por: Story 2.1 (Dashboard)

CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_orders BIGINT;
  v_today_orders BIGINT;
  v_total_clients BIGINT;
  v_monthly_revenue NUMERIC;
  v_now_br TIMESTAMPTZ;
  v_today_start TIMESTAMPTZ;
  v_month_start TIMESTAMPTZ;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: usuario nao e admin';
  END IF;

  v_now_br := NOW() AT TIME ZONE 'America/Sao_Paulo';
  v_today_start := DATE_TRUNC('day', v_now_br) AT TIME ZONE 'America/Sao_Paulo';
  v_month_start := DATE_TRUNC('month', v_now_br) AT TIME ZONE 'America/Sao_Paulo';

  SELECT COUNT(*) INTO v_total_orders FROM orders;

  SELECT COUNT(*) INTO v_today_orders
  FROM orders WHERE created_at >= v_today_start;

  SELECT COUNT(*) INTO v_total_clients
  FROM profiles WHERE role = 'customer';

  SELECT COALESCE(SUM(total), 0) INTO v_monthly_revenue
  FROM orders
  WHERE created_at >= v_month_start
    AND status NOT IN ('cancelled', 'rejected');

  RETURN json_build_object(
    'total_orders', v_total_orders,
    'today_orders', v_today_orders,
    'total_clients', v_total_clients,
    'monthly_revenue', v_monthly_revenue
  );
END;
$$;

COMMENT ON FUNCTION get_dashboard_metrics() IS
  'Retorna metricas do dashboard: total pedidos, pedidos hoje, total clientes, receita mensal.';


-- ============================================================================
-- 2. get_orders_by_status()
-- ============================================================================
-- Contagem de pedidos agrupados por status para grafico do dashboard.

CREATE OR REPLACE FUNCTION get_orders_by_status()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: usuario nao e admin';
  END IF;

  SELECT json_agg(
    json_build_object('status', status, 'count', cnt)
  )
  INTO v_result
  FROM (
    SELECT status, COUNT(*) AS cnt
    FROM orders
    GROUP BY status
    ORDER BY
      CASE status
        WHEN 'pending'   THEN 1
        WHEN 'approved'  THEN 2
        WHEN 'preparing' THEN 3
        WHEN 'shipped'   THEN 4
        WHEN 'delivered'  THEN 5
        WHEN 'rejected'  THEN 6
        WHEN 'cancelled' THEN 7
      END
  ) sub;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

COMMENT ON FUNCTION get_orders_by_status() IS
  'Retorna contagem de pedidos agrupados por status para grafico do dashboard.';


-- ============================================================================
-- 3. search_admin_orders()
-- ============================================================================
-- Busca avancada de pedidos com smart search, filtros e paginacao.
-- Usado por: Story 2.3 (Pedidos Admin)

CREATE OR REPLACE FUNCTION search_admin_orders(
  search_term TEXT DEFAULT NULL,
  statuses TEXT[] DEFAULT NULL,
  p_page INT DEFAULT 1,
  p_page_size INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  order_number BIGINT,
  user_id UUID,
  address_id UUID,
  status TEXT,
  payment_method TEXT,
  subtotal NUMERIC,
  discount NUMERIC,
  total NUMERIC,
  created_at TIMESTAMPTZ,
  company_name TEXT,
  cnpj TEXT,
  phone TEXT,
  total_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_offset INT;
  v_search TEXT;
  v_is_numeric BOOLEAN;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: usuario nao e admin';
  END IF;

  v_offset := (GREATEST(p_page, 1) - 1) * p_page_size;
  v_search := NULLIF(TRIM(search_term), '');
  v_is_numeric := v_search IS NOT NULL AND v_search ~ '^\d+$';

  RETURN QUERY
  SELECT
    o.id,
    o.order_number,
    o.user_id,
    o.address_id,
    o.status::TEXT,
    o.payment_method::TEXT,
    o.subtotal,
    o.discount,
    o.total,
    o.created_at,
    p.company_name,
    p.cnpj,
    p.phone,
    COUNT(*) OVER () AS total_count
  FROM orders o
  LEFT JOIN profiles p ON p.id = o.user_id
  WHERE
    (statuses IS NULL OR array_length(statuses, 1) IS NULL OR o.status::TEXT = ANY(statuses))
    AND (
      v_search IS NULL
      OR (v_is_numeric AND o.order_number = v_search::BIGINT)
      OR (NOT v_is_numeric AND (
        p.company_name ILIKE '%' || v_search || '%'
        OR p.cnpj ILIKE '%' || v_search || '%'
      ))
    )
  ORDER BY o.created_at DESC
  LIMIT p_page_size
  OFFSET v_offset;
END;
$$;

COMMENT ON FUNCTION search_admin_orders(TEXT, TEXT[], INT, INT) IS
  'Busca paginada de pedidos para admin com filtro por numero, empresa, cnpj e status.';


-- ============================================================================
-- 4. get_admin_clients()
-- ============================================================================
-- Lista paginada de clientes com email do auth.users.
-- Usado por: Story 2.4 (Clientes Admin)

CREATE OR REPLACE FUNCTION get_admin_clients(
  page INT DEFAULT 1,
  page_size INT DEFAULT 20,
  search_term TEXT DEFAULT NULL,
  filter_tiers TEXT[] DEFAULT NULL,
  filter_roles TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  company_name TEXT,
  cnpj TEXT,
  phone TEXT,
  tier TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  email TEXT,
  total_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_offset INT;
  v_search TEXT;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: usuario nao e admin';
  END IF;

  v_offset := (GREATEST(page, 1) - 1) * page_size;
  v_search := NULLIF(TRIM(search_term), '');

  RETURN QUERY
  SELECT
    p.id,
    p.company_name,
    p.cnpj,
    p.phone,
    p.tier::TEXT,
    p.role::TEXT,
    p.created_at,
    u.email::TEXT,
    COUNT(*) OVER () AS total_count
  FROM profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE
    (filter_tiers IS NULL OR array_length(filter_tiers, 1) IS NULL OR p.tier::TEXT = ANY(filter_tiers))
    AND (filter_roles IS NULL OR array_length(filter_roles, 1) IS NULL OR p.role::TEXT = ANY(filter_roles))
    AND (
      v_search IS NULL
      OR p.company_name ILIKE '%' || v_search || '%'
      OR u.email::TEXT ILIKE '%' || v_search || '%'
      OR p.cnpj ILIKE '%' || v_search || '%'
    )
  ORDER BY p.created_at DESC
  LIMIT page_size
  OFFSET v_offset;
END;
$$;

COMMENT ON FUNCTION get_admin_clients(INT, INT, TEXT, TEXT[], TEXT[]) IS
  'Lista paginada de clientes com email do auth.users, filtros por tier/role e busca.';


-- ============================================================================
-- 5. update_admin_user_email()
-- ============================================================================
-- Permite super_admin alterar email de um usuario.

CREATE OR REPLACE FUNCTION update_admin_user_email(
  target_user_id UUID,
  new_email TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Acesso negado: somente super_admin pode alterar email de usuarios';
  END IF;

  IF TRIM(new_email) = '' OR new_email IS NULL THEN
    RAISE EXCEPTION 'Email nao pode ser vazio';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) THEN
    RAISE EXCEPTION 'Usuario nao encontrado';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = new_email AND id != target_user_id) THEN
    RAISE EXCEPTION 'Este email ja esta em uso por outro usuario';
  END IF;

  UPDATE auth.users
  SET email = new_email, email_confirmed_at = NOW(), updated_at = NOW()
  WHERE id = target_user_id;
END;
$$;

COMMENT ON FUNCTION update_admin_user_email(UUID, TEXT) IS
  'Permite super_admin alterar email de um usuario diretamente no auth.users.';


-- ============================================================================
-- 6. set_main_address()
-- ============================================================================
-- Toggle atomico de endereco principal.

CREATE OR REPLACE FUNCTION set_main_address(
  target_address_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT user_id INTO v_user_id
  FROM user_addresses WHERE id = target_address_id;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Endereco nao encontrado';
  END IF;

  IF NOT is_admin() AND v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Acesso negado: voce so pode alterar seus proprios enderecos';
  END IF;

  UPDATE user_addresses SET is_main = FALSE
  WHERE user_id = v_user_id AND is_main = TRUE;

  UPDATE user_addresses SET is_main = TRUE
  WHERE id = target_address_id;
END;
$$;

COMMENT ON FUNCTION set_main_address(UUID) IS
  'Define um endereco como principal (is_main). Desmarca o anterior automaticamente.';


-- ============================================================================
-- 7. create_order_validated()
-- ============================================================================
-- Criacao de pedido com validacao server-side de precos e desconto por tier.

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
  VALUES (v_user_id, p_address_id, 'pending', p_payment_method, v_subtotal, v_discount, v_total)
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

-- ============================================================================
-- FIM DO ARQUIVO 001_admin_rpc_functions.sql
-- ============================================================================
