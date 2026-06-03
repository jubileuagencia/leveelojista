-- ============================================================================
-- Migration 020: Fluxo de pagamento pós-separação
-- ============================================================================
-- Decisão: docs/decisoes/fluxo-pagamento-pos-separacao.md
-- UX Spec: docs/ux-specs/LV-133-fluxo-pagamento-pos-separacao.md
-- Gate:    docs/decisoes/LV-133-gate-payment-method.md
-- Agente: @data-engineer | Data: 2026-06-03
-- ============================================================================
--
-- RESUMO DAS MUDANÇAS:
-- 1. Enum order_status  → adicionar 'separating', 'awaiting_payment'
-- 2. Enum payment_method → adicionar 'cartao_online', 'cartao_entrega', 'dinheiro_entrega'
-- 3. orders             → tornar payment_method nullable + 9 novos campos
-- 4. order_items        → 5 novos campos de separação
-- 5. Nova tabela        → order_separation_audit
-- 6. RPC atualizado     → create_order_validated (payment_method opcional = null)
-- 7. Novos RPCs         → start_separation, finalize_separation
-- 8. Backfill           → approved orders legados recebem paid_at = created_at
-- ============================================================================

-- NOTA: ALTER TYPE ADD VALUE não pode rodar dentro de transaction block.
-- O Supabase CLI detecta e executa fora de transação automaticamente.

-- ============================================================================
-- 1. ENUMS — adicionar valores novos
-- ============================================================================

ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'separating'        AFTER 'pending';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'awaiting_payment'  AFTER 'separating';

ALTER TYPE payment_method ADD VALUE IF NOT EXISTS 'cartao_online'     AFTER 'boleto';
ALTER TYPE payment_method ADD VALUE IF NOT EXISTS 'cartao_entrega'    AFTER 'cartao_online';
ALTER TYPE payment_method ADD VALUE IF NOT EXISTS 'dinheiro_entrega'  AFTER 'cartao_entrega';

-- ============================================================================
-- 2. TABELA orders — tornar payment_method nullable + campos novos
-- ============================================================================

-- Tornar payment_method nullable (novo fluxo: pedido criado sem pagamento)
ALTER TABLE orders
  ALTER COLUMN payment_method DROP NOT NULL;

-- Campos de separação e pagamento
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS separated_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS separated_by        UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS paid_at             TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS mp_payment_id       TEXT,
  ADD COLUMN IF NOT EXISTS mp_preference_id    TEXT,
  ADD COLUMN IF NOT EXISTS original_subtotal   NUMERIC,
  ADD COLUMN IF NOT EXISTS original_total      NUMERIC,
  ADD COLUMN IF NOT EXISTS separation_notes    TEXT,
  ADD COLUMN IF NOT EXISTS delivery_change_for NUMERIC(12,2);

COMMENT ON COLUMN orders.separated_at         IS 'Timestamp em que a separação foi finalizada (status → awaiting_payment)';
COMMENT ON COLUMN orders.separated_by         IS 'Usuário admin que finalizou a separação';
COMMENT ON COLUMN orders.paid_at              IS 'Timestamp do pagamento confirmado (webhook MP ou confirmação manual na entrega)';
COMMENT ON COLUMN orders.mp_payment_id        IS 'ID do pagamento no Mercado Pago (pagamentos online)';
COMMENT ON COLUMN orders.mp_preference_id     IS 'Preference ID do MP Checkout Pro';
COMMENT ON COLUMN orders.original_subtotal    IS 'Snapshot do subtotal no momento do pedido (antes da separação ajustar qtys)';
COMMENT ON COLUMN orders.original_total       IS 'Snapshot do total no momento do pedido';
COMMENT ON COLUMN orders.separation_notes     IS 'Nota geral da loja sobre a separação (opcional)';
COMMENT ON COLUMN orders.delivery_change_for  IS 'Valor da nota para troco (só quando payment_method=dinheiro_entrega e cliente pediu troco). Deve ser > total.';

-- ============================================================================
-- 3. TABELA order_items — campos de separação
-- ============================================================================

ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS original_quantity       NUMERIC,
  ADD COLUMN IF NOT EXISTS original_total_price    NUMERIC,
  ADD COLUMN IF NOT EXISTS separation_status       TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS separation_note         TEXT,
  ADD COLUMN IF NOT EXISTS substituted_from_item_id UUID REFERENCES order_items(id);

COMMENT ON COLUMN order_items.original_quantity        IS 'Quantidade pedida pelo cliente (imutável após criação do pedido)';
COMMENT ON COLUMN order_items.original_total_price     IS 'Total da linha no momento do pedido (imutável)';
COMMENT ON COLUMN order_items.separation_status        IS 'Estado do item na separação: pending | separated | removed | added | substituted';
COMMENT ON COLUMN order_items.separation_note          IS 'Nota livre do separador sobre este item (ex: "pacote fechado 1,2kg")';
COMMENT ON COLUMN order_items.substituted_from_item_id IS 'Se este item foi adicionado como substituição, aponta para o item original removido';

-- Backfill: itens de pedidos existentes já estão "separados"
-- (pedidos legacy têm separation_status 'pending' por default, mas foram criados no fluxo antigo)
-- Pedidos com status approved/preparing/shipped/delivered já passaram pela "separação implícita"
UPDATE order_items oi
SET    separation_status = 'separated'
FROM   orders o
WHERE  oi.order_id = o.id
  AND  o.status IN ('approved', 'preparing', 'shipped', 'delivered')
  AND  oi.separation_status = 'pending';

-- ============================================================================
-- 4. TABELA order_separation_audit
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_separation_audit (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id UUID        REFERENCES order_items(id) ON DELETE CASCADE,
  action        TEXT        NOT NULL,
  user_id       UUID        NOT NULL REFERENCES auth.users(id),
  payload       JSONB       NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE order_separation_audit IS 'Log auditável de todas as ações durante a separação de pedidos';
COMMENT ON COLUMN order_separation_audit.action IS
  'separation_started | qty_changed | item_removed | item_added | item_substituted | note_added | separation_completed | separation_reverted';
COMMENT ON COLUMN order_separation_audit.payload IS
  'Contexto da ação: {before: {...}, after: {...}, reason: "..."}';

CREATE INDEX IF NOT EXISTS idx_separation_audit_order    ON order_separation_audit(order_id);
CREATE INDEX IF NOT EXISTS idx_separation_audit_item     ON order_separation_audit(order_item_id);
CREATE INDEX IF NOT EXISTS idx_separation_audit_user     ON order_separation_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_separation_audit_created  ON order_separation_audit(created_at DESC);

-- RLS: loja (admin) lê tudo do seu workspace; cliente não lê audit
ALTER TABLE order_separation_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin pode ler audit de separacao"
  ON order_separation_audit FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin pode inserir audit de separacao"
  ON order_separation_audit FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );

-- ============================================================================
-- 5. BACKFILL — pedidos legados aprovados recebem paid_at
-- ============================================================================

UPDATE orders
SET    paid_at = created_at,
       original_subtotal = subtotal,
       original_total    = total
WHERE  status IN ('approved', 'preparing', 'shipped', 'delivered')
  AND  paid_at IS NULL;

-- ============================================================================
-- 6. RPC create_order_validated — payment_method agora opcional (default NULL)
-- ============================================================================
-- Novo fluxo: cliente cria pedido sem pagar. payment_method=null até /pagamento.
-- Parâmetro mantido para não quebrar chamadas antigas (será ignorado se null).

DROP FUNCTION IF EXISTS create_order_validated(UUID, TEXT, JSONB);

CREATE OR REPLACE FUNCTION create_order_validated(
  p_address_id     UUID,
  p_payment_method TEXT DEFAULT NULL,
  p_items          JSONB DEFAULT '[]'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id       UUID;
  v_user_tier     TEXT;
  v_discount_pct  NUMERIC := 0;
  v_tier_config   JSONB;
  v_subtotal      NUMERIC := 0;
  v_discount      NUMERIC := 0;
  v_total         NUMERIC := 0;
  v_order_id      UUID;
  v_item          JSONB;
  v_product       RECORD;
  v_variant       RECORD;
  v_unit_price    NUMERIC;
  v_item_total    NUMERIC;
  v_unit_type     TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario nao autenticado';
  END IF;

  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Pedido deve conter ao menos um item';
  END IF;

  IF p_address_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM user_addresses
      WHERE id = p_address_id AND user_id = v_user_id
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
    IF (v_item ->> 'quantity')::NUMERIC <= 0 THEN
      RAISE EXCEPTION 'Quantidade invalida para produto: %', v_product.name;
    END IF;

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

    v_subtotal := v_subtotal + (v_unit_price * (v_item ->> 'quantity')::NUMERIC);
  END LOOP;

  v_discount := ROUND(v_subtotal * (v_discount_pct / 100), 2);
  v_total    := v_subtotal - v_discount;

  INSERT INTO orders (
    user_id, address_id, status, payment_method,
    subtotal, discount, total,
    original_subtotal, original_total
  )
  VALUES (
    v_user_id, p_address_id, 'pending',
    CASE WHEN p_payment_method IS NOT NULL
      THEN p_payment_method::payment_method
      ELSE NULL
    END,
    v_subtotal, v_discount, v_total,
    v_subtotal, v_total
  )
  RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_unit_type := NULL;

    IF v_item ->> 'variant_id' IS NOT NULL THEN
      SELECT unit_price, unit_type INTO v_variant
      FROM product_variants
      WHERE id = (v_item ->> 'variant_id')::UUID;
      v_unit_price := v_variant.unit_price;
      v_unit_type  := v_variant.unit_type;
    ELSE
      SELECT price INTO v_unit_price FROM products
      WHERE id = (v_item ->> 'product_id')::UUID;
    END IF;

    INSERT INTO order_items (
      order_id, product_id, variant_id,
      quantity, unit_price, total_price, unit_type,
      original_quantity, original_total_price,
      separation_status
    )
    VALUES (
      v_order_id,
      (v_item ->> 'product_id')::UUID,
      CASE WHEN v_item ->> 'variant_id' IS NOT NULL
        THEN (v_item ->> 'variant_id')::UUID ELSE NULL END,
      (v_item ->> 'quantity')::NUMERIC,
      v_unit_price,
      v_unit_price * (v_item ->> 'quantity')::NUMERIC,
      v_unit_type,
      (v_item ->> 'quantity')::NUMERIC,
      v_unit_price * (v_item ->> 'quantity')::NUMERIC,
      'pending'
    );
  END LOOP;

  DELETE FROM cart_items WHERE user_id = v_user_id;

  RETURN v_order_id;
END;
$$;

COMMENT ON FUNCTION create_order_validated(UUID, TEXT, JSONB) IS
  'Cria pedido sem pagamento upfront (novo fluxo pós-separação). payment_method=null até cliente escolher em /pedido/:id/pagamento.';

-- ============================================================================
-- 7. RPC start_separation — pending → separating
-- ============================================================================

CREATE OR REPLACE FUNCTION start_separation(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order orders%ROWTYPE;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas admin pode iniciar separacao';
  END IF;

  SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;

  IF v_order IS NULL THEN
    RAISE EXCEPTION 'Pedido nao encontrado: %', p_order_id;
  END IF;

  IF v_order.status != 'pending' THEN
    RAISE EXCEPTION 'Pedido % nao esta em status pending (status atual: %)', p_order_id, v_order.status;
  END IF;

  UPDATE orders
  SET status = 'separating'
  WHERE id = p_order_id;

  INSERT INTO order_separation_audit (order_id, action, user_id, payload)
  VALUES (p_order_id, 'separation_started', auth.uid(), '{}');
END;
$$;

COMMENT ON FUNCTION start_separation(UUID) IS
  'Inicia separação de um pedido (pending → separating). Registra audit. Apenas admin.';

-- ============================================================================
-- 8. RPC finalize_separation — separating → awaiting_payment
-- ============================================================================

CREATE OR REPLACE FUNCTION finalize_separation(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order          orders%ROWTYPE;
  v_pending_count  INT;
  v_new_subtotal   NUMERIC;
  v_new_total      NUMERIC;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas admin pode finalizar separacao';
  END IF;

  SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;

  IF v_order IS NULL THEN
    RAISE EXCEPTION 'Pedido nao encontrado: %', p_order_id;
  END IF;

  IF v_order.status != 'separating' THEN
    RAISE EXCEPTION 'Pedido % nao esta em separacao (status atual: %)', p_order_id, v_order.status;
  END IF;

  -- Bloqueia se ainda há itens não confirmados
  SELECT COUNT(*) INTO v_pending_count
  FROM order_items
  WHERE order_id = p_order_id AND separation_status = 'pending';

  IF v_pending_count > 0 THEN
    RAISE EXCEPTION 'Existem % item(ns) ainda nao confirmado(s) na separacao', v_pending_count;
  END IF;

  -- Recalcula total com itens ativos (separated ou added; removed não conta)
  SELECT COALESCE(SUM(total_price), 0) INTO v_new_subtotal
  FROM order_items
  WHERE order_id = p_order_id
    AND separation_status IN ('separated', 'added');

  v_new_total := v_new_subtotal - COALESCE(v_order.discount, 0);

  -- Salva snapshot original se ainda não salvo
  UPDATE orders
  SET
    status            = 'awaiting_payment',
    separated_at      = NOW(),
    separated_by      = auth.uid(),
    subtotal          = v_new_subtotal,
    total             = v_new_total,
    original_subtotal = COALESCE(original_subtotal, v_order.subtotal),
    original_total    = COALESCE(original_total, v_order.total)
  WHERE id = p_order_id;

  INSERT INTO order_separation_audit (order_id, action, user_id, payload)
  VALUES (
    p_order_id,
    'separation_completed',
    auth.uid(),
    jsonb_build_object(
      'original_total', v_order.total,
      'new_total', v_new_total,
      'diff', v_order.total - v_new_total
    )
  );
END;
$$;

COMMENT ON FUNCTION finalize_separation(UUID) IS
  'Finaliza separação (separating → awaiting_payment). Recalcula total, registra audit, dispara notificação via trigger. Apenas admin.';

-- ============================================================================
-- FIM Migration 020
-- ============================================================================
