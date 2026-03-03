-- ============================================================================
-- Migration 005: Backfill addresses from existing users' raw_user_meta_data
-- ============================================================================
-- Usuários cadastrados antes da migration 004 têm os dados de endereço
-- no raw_user_meta_data do auth.users, mas sem registro em user_addresses.
-- Este script cria o endereço principal para esses usuários.
-- ============================================================================

INSERT INTO public.user_addresses (user_id, zip_code, street, number, district, city, state, is_main)
SELECT
  u.id,
  u.raw_user_meta_data ->> 'cep',
  u.raw_user_meta_data ->> 'street',
  u.raw_user_meta_data ->> 'number',
  u.raw_user_meta_data ->> 'district',
  u.raw_user_meta_data ->> 'city',
  u.raw_user_meta_data ->> 'state',
  TRUE
FROM auth.users u
WHERE
  -- Tem CEP no metadata
  COALESCE(TRIM(u.raw_user_meta_data ->> 'cep'), '') <> ''
  -- Ainda não tem endereço cadastrado
  AND NOT EXISTS (
    SELECT 1 FROM public.user_addresses a WHERE a.user_id = u.id
  );
