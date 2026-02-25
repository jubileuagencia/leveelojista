-- ============================================================================
-- NOVOB2B - Admin RLS Policies
-- ============================================================================
-- Arquivo: 002_admin_rls_policies.sql
-- Descricao: Row Level Security policies para todas as tabelas.
-- Autor: @data-engineer (Synkra AIOS)
-- Data: 2026-02-25
-- IMPORTANTE: Idempotente - dropa policies existentes antes de recriar.
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. PRODUCTS
-- ============================================================================
DROP POLICY IF EXISTS "products_customer_select" ON products;
DROP POLICY IF EXISTS "products_admin_select" ON products;
DROP POLICY IF EXISTS "products_admin_insert" ON products;
DROP POLICY IF EXISTS "products_admin_update" ON products;
DROP POLICY IF EXISTS "products_admin_delete" ON products;

CREATE POLICY "products_customer_select" ON products FOR SELECT TO authenticated
  USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "products_admin_select" ON products FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "products_admin_insert" ON products FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "products_admin_update" ON products FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "products_admin_delete" ON products FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================================
-- 2. ORDERS
-- ============================================================================
DROP POLICY IF EXISTS "orders_customer_select" ON orders;
DROP POLICY IF EXISTS "orders_customer_insert" ON orders;
DROP POLICY IF EXISTS "orders_admin_select" ON orders;
DROP POLICY IF EXISTS "orders_admin_update" ON orders;

CREATE POLICY "orders_customer_select" ON orders FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "orders_customer_insert" ON orders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "orders_admin_select" ON orders FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "orders_admin_update" ON orders FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================================
-- 3. ORDER_ITEMS
-- ============================================================================
DROP POLICY IF EXISTS "order_items_customer_select" ON order_items;
DROP POLICY IF EXISTS "order_items_customer_insert" ON order_items;
DROP POLICY IF EXISTS "order_items_admin_select" ON order_items;

CREATE POLICY "order_items_customer_select" ON order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "order_items_customer_insert" ON order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "order_items_admin_select" ON order_items FOR SELECT TO authenticated
  USING (is_admin());

-- ============================================================================
-- 4. PROFILES
-- ============================================================================
DROP POLICY IF EXISTS "profiles_customer_select" ON profiles;
DROP POLICY IF EXISTS "profiles_customer_update" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_select" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_update" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_insert" ON profiles;

CREATE POLICY "profiles_customer_select" ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_customer_update" ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_admin_select" ON profiles FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "profiles_admin_update" ON profiles FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "profiles_admin_insert" ON profiles FOR INSERT TO authenticated
  WITH CHECK (is_admin() OR id = auth.uid());

-- ============================================================================
-- 5. USER_ADDRESSES
-- ============================================================================
DROP POLICY IF EXISTS "addresses_customer_select" ON user_addresses;
DROP POLICY IF EXISTS "addresses_customer_insert" ON user_addresses;
DROP POLICY IF EXISTS "addresses_customer_update" ON user_addresses;
DROP POLICY IF EXISTS "addresses_customer_delete" ON user_addresses;
DROP POLICY IF EXISTS "addresses_admin_select" ON user_addresses;
DROP POLICY IF EXISTS "addresses_admin_update" ON user_addresses;

CREATE POLICY "addresses_customer_select" ON user_addresses FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "addresses_customer_insert" ON user_addresses FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "addresses_customer_update" ON user_addresses FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "addresses_customer_delete" ON user_addresses FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "addresses_admin_select" ON user_addresses FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "addresses_admin_update" ON user_addresses FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================================
-- 6. CATEGORIES
-- ============================================================================
DROP POLICY IF EXISTS "categories_customer_select" ON categories;
DROP POLICY IF EXISTS "categories_admin_select" ON categories;
DROP POLICY IF EXISTS "categories_admin_insert" ON categories;
DROP POLICY IF EXISTS "categories_admin_update" ON categories;
DROP POLICY IF EXISTS "categories_admin_delete" ON categories;

CREATE POLICY "categories_customer_select" ON categories FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "categories_admin_select" ON categories FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "categories_admin_insert" ON categories FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "categories_admin_update" ON categories FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "categories_admin_delete" ON categories FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================================
-- 7. APP_CONFIG
-- ============================================================================
DROP POLICY IF EXISTS "app_config_customer_select" ON app_config;
DROP POLICY IF EXISTS "app_config_admin_select" ON app_config;
DROP POLICY IF EXISTS "app_config_admin_insert" ON app_config;
DROP POLICY IF EXISTS "app_config_admin_update" ON app_config;

CREATE POLICY "app_config_customer_select" ON app_config FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "app_config_admin_select" ON app_config FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "app_config_admin_insert" ON app_config FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "app_config_admin_update" ON app_config FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================================
-- 8. CART_ITEMS
-- ============================================================================
DROP POLICY IF EXISTS "cart_items_customer_select" ON cart_items;
DROP POLICY IF EXISTS "cart_items_customer_insert" ON cart_items;
DROP POLICY IF EXISTS "cart_items_customer_update" ON cart_items;
DROP POLICY IF EXISTS "cart_items_customer_delete" ON cart_items;

CREATE POLICY "cart_items_customer_select" ON cart_items FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "cart_items_customer_insert" ON cart_items FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "cart_items_customer_update" ON cart_items FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "cart_items_customer_delete" ON cart_items FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 9. FAVORITES
-- ============================================================================
DROP POLICY IF EXISTS "favorites_customer_select" ON favorites;
DROP POLICY IF EXISTS "favorites_customer_insert" ON favorites;
DROP POLICY IF EXISTS "favorites_customer_delete" ON favorites;

CREATE POLICY "favorites_customer_select" ON favorites FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "favorites_customer_insert" ON favorites FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "favorites_customer_delete" ON favorites FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 10. SUPABASE STORAGE - Bucket product-images
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "product_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_delete" ON storage.objects;

CREATE POLICY "product_images_public_read" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "product_images_admin_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND is_admin())
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "product_images_admin_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND is_admin());

-- ============================================================================
-- FIM DO ARQUIVO 002_admin_rls_policies.sql
-- ============================================================================
