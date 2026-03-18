-- ============================================================================
-- Migration 012: Fix handle_new_user — restaurar criação de endereço (T5.3)
-- ============================================================================
-- A migration 011 sobrescreveu handle_new_user mas removeu a lógica de
-- criação do endereço principal (user_addresses) que existia desde migration 004.
-- Esta migration restaura essa funcionalidade junto com os campos PF/PJ.
-- Agente: @dev | Data: 2026-03-18
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1. Criar profile com campos PF/PJ
  INSERT INTO public.profiles (
    id, company_name, trade_name, document_type, document_number, phone, role, tier
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'company_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'trade_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'document_type', 'cpf'),
    COALESCE(NEW.raw_user_meta_data ->> 'document_number', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL),
    'customer',
    'ouro'
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
  'Trigger: cria profile (PF/PJ) + endereço principal automaticamente ao registrar usuario.';

-- ============================================================================
-- FIM Migration 012
-- ============================================================================
