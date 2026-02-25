-- ============================================================================
-- NOVOB2B - Schema Base Completo
-- ============================================================================
-- Arquivo: 000_base_schema.sql
-- Descricao: Cria todas as tabelas, sequences, enums, triggers e seed data.
--            Deve ser executado PRIMEIRO em um banco Supabase vazio.
-- Autor: @data-engineer (Synkra AIOS)
-- Data: 2026-02-25
-- ============================================================================

-- ============================================================================
-- 1. CUSTOM TYPES (ENUMS)
-- ============================================================================

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_tier') THEN
    CREATE TYPE user_tier AS ENUM ('bronze', 'silver', 'gold');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    CREATE TYPE payment_method AS ENUM ('pix', 'boleto');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('pending', 'approved', 'preparing', 'shipped', 'delivered', 'rejected', 'cancelled');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_unit') THEN
    CREATE TYPE product_unit AS ENUM ('un', 'kg', 'cx', 'maco', 'dz');
  END IF;
END $$;

-- ============================================================================
-- 2. SEQUENCES
-- ============================================================================

CREATE SEQUENCE IF NOT EXISTS orders_order_number_seq START 1;
CREATE SEQUENCE IF NOT EXISTS products_display_id_seq START 1;

-- ============================================================================
-- 3. TABELAS
-- ============================================================================

-- 3.1 PROFILES (vinculada ao auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  cnpj        TEXT,
  phone       TEXT,
  tier        user_tier NOT NULL DEFAULT 'bronze',
  role        user_role NOT NULL DEFAULT 'customer',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  icon        TEXT,
  color       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.3 PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC NOT NULL CHECK (price >= 0),
  unit        product_unit NOT NULL DEFAULT 'un',
  image_url   TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  deleted_at  TIMESTAMPTZ,
  display_id  INTEGER NOT NULL DEFAULT nextval('products_display_id_seq') UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.4 USER_ADDRESSES
CREATE TABLE IF NOT EXISTS user_addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  zip_code    TEXT,
  street      TEXT,
  number      TEXT,
  district    TEXT,
  city        TEXT,
  state       TEXT,
  is_main     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.5 ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    BIGINT NOT NULL DEFAULT nextval('orders_order_number_seq') UNIQUE,
  user_id         UUID NOT NULL REFERENCES profiles(id),
  address_id      UUID REFERENCES user_addresses(id) ON DELETE SET NULL,
  status          order_status NOT NULL DEFAULT 'pending',
  payment_method  payment_method NOT NULL,
  subtotal        NUMERIC NOT NULL CHECK (subtotal >= 0),
  discount        NUMERIC NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total           NUMERIC NOT NULL CHECK (total >= 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.6 ORDER_ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC NOT NULL CHECK (total_price >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.7 CART_ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- 3.8 FAVORITES
CREATE TABLE IF NOT EXISTS favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- 3.9 APP_CONFIG
CREATE TABLE IF NOT EXISTS app_config (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,
  value       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. TRIGGER: Auto-criar profile quando usuario se registra
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, company_name, cnpj, phone, role, tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'company_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'cnpj', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL),
    'customer',
    'bronze'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- 5. SEED DATA
-- ============================================================================

-- Configuracao de desconto por tier
INSERT INTO app_config (key, value)
VALUES ('tier_discounts', '{"bronze": 0, "silver": 4, "gold": 8}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- FIM DO ARQUIVO 000_base_schema.sql
-- ============================================================================
