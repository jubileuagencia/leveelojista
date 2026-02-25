-- ============================================================================
-- NOVOB2B - Seed: Categorias + 30 Produtos de exemplo
-- ============================================================================
-- Executar no SQL Editor do Supabase DEPOIS dos migrations.
-- ============================================================================

-- ============================================================================
-- 1. CATEGORIAS
-- ============================================================================
INSERT INTO categories (name, icon, color, sort_order) VALUES
  ('Bebidas',        'GlassWater',   '#3B82F6', 1),
  ('Mercearia',      'ShoppingBasket','#F59E0B', 2),
  ('Limpeza',        'Sparkles',     '#10B981', 3),
  ('Higiene',        'Heart',        '#EC4899', 4),
  ('Frios e Laticínios', 'Snowflake','#06B6D4', 5),
  ('Hortifruti',     'Apple',        '#84CC16', 6),
  ('Padaria',        'Croissant',    '#D97706', 7),
  ('Carnes',         'Beef',         '#EF4444', 8)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 2. PRODUTOS (30 itens)
-- ============================================================================

-- Bebidas (5)
INSERT INTO products (name, description, price, unit, category_id, is_active, image_url) VALUES
(
  'Coca-Cola 2L',
  'Refrigerante Coca-Cola garrafa PET 2 litros',
  8.99, 'un',
  (SELECT id FROM categories WHERE name = 'Bebidas'),
  true, null
),
(
  'Água Mineral 500ml (Pack 12)',
  'Pack com 12 garrafas de água mineral sem gás 500ml',
  15.90, 'cx',
  (SELECT id FROM categories WHERE name = 'Bebidas'),
  true, null
),
(
  'Suco Del Valle Uva 1L',
  'Suco de uva integral Del Valle caixa 1 litro',
  7.49, 'un',
  (SELECT id FROM categories WHERE name = 'Bebidas'),
  true, null
),
(
  'Cerveja Brahma 350ml (Pack 12)',
  'Pack com 12 latas de cerveja Brahma 350ml',
  42.90, 'cx',
  (SELECT id FROM categories WHERE name = 'Bebidas'),
  true, null
),
(
  'Energético Red Bull 250ml',
  'Bebida energética Red Bull lata 250ml',
  9.99, 'un',
  (SELECT id FROM categories WHERE name = 'Bebidas'),
  true, null
),

-- Mercearia (5)
(
  'Arroz Tio João 5kg',
  'Arroz branco tipo 1 Tio João pacote 5kg',
  24.90, 'un',
  (SELECT id FROM categories WHERE name = 'Mercearia'),
  true, null
),
(
  'Feijão Carioca Camil 1kg',
  'Feijão carioca tipo 1 Camil pacote 1kg',
  8.49, 'un',
  (SELECT id FROM categories WHERE name = 'Mercearia'),
  true, null
),
(
  'Açúcar Refinado União 1kg',
  'Açúcar refinado especial União pacote 1kg',
  5.29, 'un',
  (SELECT id FROM categories WHERE name = 'Mercearia'),
  true, null
),
(
  'Óleo de Soja Liza 900ml',
  'Óleo de soja refinado Liza garrafa 900ml',
  7.99, 'un',
  (SELECT id FROM categories WHERE name = 'Mercearia'),
  true, null
),
(
  'Macarrão Espaguete Barilla 500g',
  'Massa espaguete nº5 Barilla pacote 500g',
  6.79, 'un',
  (SELECT id FROM categories WHERE name = 'Mercearia'),
  true, null
),

-- Limpeza (4)
(
  'Detergente Ypê 500ml',
  'Detergente líquido neutro Ypê 500ml',
  2.49, 'un',
  (SELECT id FROM categories WHERE name = 'Limpeza'),
  true, null
),
(
  'Água Sanitária Qboa 1L',
  'Água sanitária Qboa original 1 litro',
  4.29, 'un',
  (SELECT id FROM categories WHERE name = 'Limpeza'),
  true, null
),
(
  'Desinfetante Pinho Sol 1L',
  'Desinfetante multiuso Pinho Sol original 1 litro',
  6.99, 'un',
  (SELECT id FROM categories WHERE name = 'Limpeza'),
  true, null
),
(
  'Papel Toalha Snob (Pack 2)',
  'Papel toalha folha dupla Snob pack com 2 rolos',
  7.49, 'cx',
  (SELECT id FROM categories WHERE name = 'Limpeza'),
  true, null
),

-- Higiene (4)
(
  'Papel Higiênico Neve 12 rolos',
  'Papel higiênico folha dupla Neve pacote 12 rolos',
  18.90, 'cx',
  (SELECT id FROM categories WHERE name = 'Higiene'),
  true, null
),
(
  'Sabonete Dove Original 90g',
  'Sabonete em barra Dove original 90g',
  3.99, 'un',
  (SELECT id FROM categories WHERE name = 'Higiene'),
  true, null
),
(
  'Creme Dental Colgate 90g',
  'Creme dental Colgate Máxima Proteção Anticáries 90g',
  4.49, 'un',
  (SELECT id FROM categories WHERE name = 'Higiene'),
  true, null
),
(
  'Shampoo Pantene 400ml',
  'Shampoo Pantene Restauração profunda 400ml',
  19.90, 'un',
  (SELECT id FROM categories WHERE name = 'Higiene'),
  true, null
),

-- Frios e Laticínios (4)
(
  'Leite Integral Italac 1L',
  'Leite UHT integral Italac caixa 1 litro',
  5.49, 'un',
  (SELECT id FROM categories WHERE name = 'Frios e Laticínios'),
  true, null
),
(
  'Queijo Mussarela Fatiado 200g',
  'Queijo mussarela fatiado bandeja 200g',
  12.90, 'un',
  (SELECT id FROM categories WHERE name = 'Frios e Laticínios'),
  true, null
),
(
  'Presunto Cozido Sadia 200g',
  'Presunto cozido fatiado Sadia bandeja 200g',
  9.99, 'un',
  (SELECT id FROM categories WHERE name = 'Frios e Laticínios'),
  true, null
),
(
  'Iogurte Grego Vigor 100g (Pack 4)',
  'Iogurte grego tradicional Vigor pack 4 unidades 100g cada',
  11.90, 'cx',
  (SELECT id FROM categories WHERE name = 'Frios e Laticínios'),
  true, null
),

-- Hortifruti (4)
(
  'Banana Nanica',
  'Banana nanica fresca - preço por kg',
  5.99, 'kg',
  (SELECT id FROM categories WHERE name = 'Hortifruti'),
  true, null
),
(
  'Tomate Italiano',
  'Tomate italiano fresco - preço por kg',
  8.99, 'kg',
  (SELECT id FROM categories WHERE name = 'Hortifruti'),
  true, null
),
(
  'Batata Inglesa',
  'Batata inglesa lavada - preço por kg',
  6.49, 'kg',
  (SELECT id FROM categories WHERE name = 'Hortifruti'),
  true, null
),
(
  'Alface Crespa (Maço)',
  'Alface crespa fresca - unidade',
  3.49, 'maco',
  (SELECT id FROM categories WHERE name = 'Hortifruti'),
  true, null
),

-- Padaria (2)
(
  'Pão Francês (Dúzia)',
  'Pão francês tradicional - dúzia com 12 unidades',
  9.99, 'dz',
  (SELECT id FROM categories WHERE name = 'Padaria'),
  true, null
),
(
  'Bolo de Chocolate Fatia',
  'Bolo de chocolate caseiro - fatia individual',
  7.90, 'un',
  (SELECT id FROM categories WHERE name = 'Padaria'),
  true, null
),

-- Carnes (2)
(
  'Peito de Frango Congelado 1kg',
  'Peito de frango sem osso congelado pacote 1kg',
  19.90, 'kg',
  (SELECT id FROM categories WHERE name = 'Carnes'),
  true, null
),
(
  'Carne Moída Patinho 500g',
  'Carne moída de patinho resfriada bandeja 500g',
  16.90, 'un',
  (SELECT id FROM categories WHERE name = 'Carnes'),
  true, null
);

-- ============================================================================
-- 3. SEED APP_CONFIG (garante tier_discounts)
-- ============================================================================
INSERT INTO app_config (key, value)
VALUES ('tier_discounts', '{"bronze": 0, "silver": 4, "gold": 8}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- Verificação
-- ============================================================================
SELECT 'Categorias: ' || COUNT(*) FROM categories;
SELECT 'Produtos: ' || COUNT(*) FROM products;
