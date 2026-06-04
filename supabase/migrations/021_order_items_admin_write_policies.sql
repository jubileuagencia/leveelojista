-- ============================================================================
-- Migration 021: Policies de escrita do admin em order_items
-- ============================================================================
-- Bug (LV-137): o modal de separação faz UPDATE/INSERT em order_items como
-- admin, mas a migration 002 só criou policies de SELECT (admin) e
-- SELECT/INSERT (customer dono do pedido). Sem policy de UPDATE, o PostgREST
-- atualiza 0 linhas SEM retornar erro → UI mostrava "Item confirmado" sem
-- persistir nada.
--
-- Esta migration espelha o padrão já usado em orders/profiles (002):
--   orders_admin_update   → USING (is_admin()) WITH CHECK (is_admin())
-- ============================================================================

-- 1. Admin pode atualizar itens (confirmar separação, remover, restaurar)
DROP POLICY IF EXISTS "order_items_admin_update" ON order_items;
CREATE POLICY "order_items_admin_update" ON order_items FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- 2. Admin pode inserir itens (adicionar item de substituição na separação)
--    A policy existente (order_items_customer_insert) exige que o pedido seja
--    do próprio usuário — admin separando pedido de cliente era bloqueado.
DROP POLICY IF EXISTS "order_items_admin_insert" ON order_items;
CREATE POLICY "order_items_admin_insert" ON order_items FOR INSERT TO authenticated
  WITH CHECK (is_admin());
