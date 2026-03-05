-- ============================================================================
-- Migration 008: Fix bulk_upsert_products — adiciona setval da sequence
-- ============================================================================
-- Corrige: sincroniza products_display_id_seq apos inserts com display_id
--          explicito, evitando conflito de UNIQUE quando >100 produtos.
-- Autor: @data-engineer (Synkra AIOS)
-- Data: 2026-03-04
-- ============================================================================

CREATE OR REPLACE FUNCTION bulk_upsert_products(p_products JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item JSONB;
  v_inserted INT := 0;
  v_updated INT := 0;
  v_errors JSONB := '[]'::JSONB;
  v_row INT := 0;
  v_display_id INT;
  v_name TEXT;
  v_price NUMERIC;
  v_unit TEXT;
  v_cat_name TEXT;
  v_cat_id UUID;
  v_description TEXT;
  v_is_active BOOLEAN;
  v_existing_id UUID;
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_products)
  LOOP
    BEGIN
      v_display_id := (v_item->>'display_id')::INT;
      v_name := TRIM(v_item->>'name');
      v_price := (v_item->>'price')::NUMERIC;
      v_unit := TRIM(v_item->>'unit');
      v_cat_name := TRIM(v_item->>'category_name');
      v_description := NULLIF(TRIM(v_item->>'description'), '');
      v_is_active := COALESCE((v_item->>'is_active')::BOOLEAN, TRUE);

      IF v_name IS NULL OR LENGTH(v_name) < 2 THEN
        v_errors := v_errors || jsonb_build_object('row', v_row, 'display_id', v_display_id, 'error', 'Nome obrigatorio (min 2 chars)');
        v_row := v_row + 1;
        CONTINUE;
      END IF;

      IF v_price IS NULL OR v_price < 0 THEN
        v_errors := v_errors || jsonb_build_object('row', v_row, 'display_id', v_display_id, 'error', 'Preco deve ser >= 0');
        v_row := v_row + 1;
        CONTINUE;
      END IF;

      IF v_unit NOT IN ('un', 'kg', 'cx', 'maco', 'dz') THEN
        v_errors := v_errors || jsonb_build_object('row', v_row, 'display_id', v_display_id, 'error', 'Unidade invalida: ' || COALESCE(v_unit, 'NULL'));
        v_row := v_row + 1;
        CONTINUE;
      END IF;

      v_cat_id := NULL;
      IF v_cat_name IS NOT NULL AND v_cat_name <> '' THEN
        SELECT id INTO v_cat_id FROM categories WHERE LOWER(name) = LOWER(v_cat_name);
        IF v_cat_id IS NULL THEN
          v_errors := v_errors || jsonb_build_object('row', v_row, 'display_id', v_display_id, 'error', 'Categoria nao encontrada: ' || v_cat_name);
          v_row := v_row + 1;
          CONTINUE;
        END IF;
      END IF;

      IF v_display_id IS NOT NULL THEN
        SELECT id INTO v_existing_id FROM products WHERE display_id = v_display_id AND deleted_at IS NULL;
        IF v_existing_id IS NOT NULL THEN
          UPDATE products SET
            name = v_name, price = v_price, unit = v_unit::product_unit,
            category_id = v_cat_id, description = v_description,
            is_active = v_is_active, updated_at = NOW()
          WHERE id = v_existing_id;
          v_updated := v_updated + 1;
        ELSE
          INSERT INTO products (name, price, unit, category_id, description, is_active, display_id)
          VALUES (v_name, v_price, v_unit::product_unit, v_cat_id, v_description, v_is_active, v_display_id);
          v_inserted := v_inserted + 1;
        END IF;
      ELSE
        INSERT INTO products (name, price, unit, category_id, description, is_active)
        VALUES (v_name, v_price, v_unit::product_unit, v_cat_id, v_description, v_is_active);
        v_inserted := v_inserted + 1;
      END IF;

      v_row := v_row + 1;

    EXCEPTION WHEN OTHERS THEN
      v_errors := v_errors || jsonb_build_object('row', v_row, 'display_id', v_display_id, 'error', SQLERRM);
      v_row := v_row + 1;
    END;
  END LOOP;

  -- Sincronizar sequence apos inserts para evitar conflito de UNIQUE
  IF v_inserted > 0 THEN
    PERFORM setval(
      'products_display_id_seq',
      (SELECT COALESCE(MAX(display_id), 1) FROM products),
      TRUE
    );
  END IF;

  RETURN jsonb_build_object('inserted', v_inserted, 'updated', v_updated, 'errors', v_errors);
END;
$$;
