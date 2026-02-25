-- ============================================================================
-- Migration 004: Fix handle_new_user() to also create address from signup metadata
-- ============================================================================
-- O formulário de cadastro coleta endereço no Step 3, mas o trigger original
-- só salvava company_name, cnpj e phone no profile.
-- Esta migration atualiza o trigger para também inserir em user_addresses.
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1. Criar profile
  INSERT INTO public.profiles (id, company_name, cnpj, phone, role, tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'company_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'cnpj', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL),
    'customer',
    'bronze'
  );

  -- 2. Criar endereço principal (se CEP foi informado no cadastro)
  IF COALESCE(TRIM(NEW.raw_user_meta_data ->> 'cep'), '') <> '' THEN
    INSERT INTO public.user_addresses (user_id, zip_code, street, number, district, city, state, is_main)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'cep',
      NEW.raw_user_meta_data ->> 'street',
      NEW.raw_user_meta_data ->> 'number',
      NEW.raw_user_meta_data ->> 'district',
      NEW.raw_user_meta_data ->> 'city',
      NEW.raw_user_meta_data ->> 'state',
      TRUE
    );
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION handle_new_user() IS
  'Trigger: cria profile + endereço principal automaticamente ao registrar usuario.';
