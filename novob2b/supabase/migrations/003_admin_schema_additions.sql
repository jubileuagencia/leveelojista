-- ============================================================================
-- NOVOB2B - Schema Additions para Admin Panel
-- ============================================================================
-- Arquivo: 003_admin_schema_additions.sql
-- Descricao: Colunas, triggers e indices para suportar o admin panel.
-- Autor: @data-engineer (Synkra AIOS)
-- Data: 2026-02-25
-- IMPORTANTE: Todos os comandos sao idempotentes.
-- ============================================================================

-- ============================================================================
-- 1. CAMPO sort_order NA TABELA CATEGORIES
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'categories' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================================================
-- 2. COLUNA updated_at NAS TABELAS EDITAVEIS
-- ============================================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='updated_at') THEN
    ALTER TABLE products ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    UPDATE products SET updated_at = created_at WHERE updated_at IS NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='updated_at') THEN
    ALTER TABLE orders ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    UPDATE orders SET updated_at = created_at WHERE updated_at IS NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='updated_at') THEN
    ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    UPDATE profiles SET updated_at = created_at WHERE updated_at IS NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='categories' AND column_name='updated_at') THEN
    ALTER TABLE categories ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    UPDATE categories SET updated_at = created_at WHERE updated_at IS NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_addresses' AND column_name='updated_at') THEN
    ALTER TABLE user_addresses ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    UPDATE user_addresses SET updated_at = created_at WHERE updated_at IS NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='app_config' AND column_name='updated_at') THEN
    ALTER TABLE app_config ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    UPDATE app_config SET updated_at = created_at WHERE updated_at IS NULL;
  END IF;
END $$;

-- ============================================================================
-- 3. TRIGGER AUTOMATICO PARA updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON products;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON orders;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON profiles;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON categories;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON user_addresses;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON app_config;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON app_config FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================================
-- 4. INDICES PARA COLUNAS DE FILTRO FREQUENTE
-- ============================================================================

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders (order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders (status, created_at DESC);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_name_lower ON products (LOWER(name));
CREATE INDEX IF NOT EXISTS idx_products_display_id ON products (display_id);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles (tier);
CREATE INDEX IF NOT EXISTS idx_profiles_company_name ON profiles (company_name) WHERE company_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_cnpj ON profiles (cnpj) WHERE cnpj IS NOT NULL;

-- User Addresses
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses (user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_is_main ON user_addresses (user_id, is_main) WHERE is_main = TRUE;

-- Order Items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);

-- Categories
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories (sort_order);

-- Cart & Favorites
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items (user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites (user_id);

-- ============================================================================
-- FIM DO ARQUIVO 003_admin_schema_additions.sql
-- ============================================================================
