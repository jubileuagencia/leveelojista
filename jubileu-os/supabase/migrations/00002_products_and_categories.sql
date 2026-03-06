-- ============================================================
-- Jubileu OS — Products & Categories Schema
-- Story 2.2: Admin Produtos CRUD
-- ============================================================

-- Enum for product units
CREATE TYPE product_unit AS ENUM ('un', 'kg', 'cx', 'maco', 'dz');

-- ============================================================
-- TABLES
-- ============================================================

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  unit product_unit NOT NULL DEFAULT 'un',
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  deleted_at TIMESTAMPTZ,
  display_id SERIAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_products_active ON products(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_category ON products(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_display_id ON products(display_id);
CREATE INDEX idx_products_name ON products USING gin(name gin_trgm_ops);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Categories: readable by all authenticated, writable by admin
CREATE POLICY "Authenticated users can view categories"
  ON categories FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Products: readable by admin/member, writable by admin
CREATE POLICY "Admins and members can view products"
  ON products FOR SELECT
  USING (
    deleted_at IS NULL AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'member'))
  );

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- STORAGE
-- ============================================================

-- Create bucket for product images (run in Supabase dashboard if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policy: admin can upload
-- CREATE POLICY "Admins can upload product images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'product-images' AND
--     EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
--   );

-- Storage policy: public read
-- CREATE POLICY "Product images are publicly readable"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'product-images');

-- ============================================================
-- SEED: Default categories
-- ============================================================

INSERT INTO categories (name, slug) VALUES
  ('Geral', 'geral'),
  ('Servicos', 'servicos'),
  ('Digital', 'digital'),
  ('Consultoria', 'consultoria');
