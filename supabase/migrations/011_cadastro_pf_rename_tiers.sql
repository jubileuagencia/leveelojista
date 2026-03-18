-- ============================================================================
-- Migration 011: Cadastro PF (CPF) + Renomear Tiers (T5.2)
-- ============================================================================
-- 1. Renomear enum user_tier: bronze→ouro, silver→platina, gold→diamante
-- 2. Adicionar campos PF/PJ em profiles: document_type, document_number, trade_name
-- 3. Backfill dados existentes
-- 4. Atualizar trigger handle_new_user
-- 5. Atualizar app_config tier_discounts
-- Agente: @data-engineer | Data: 2026-03-18
-- ============================================================================

-- 1. Renomear valores do enum user_tier
ALTER TYPE user_tier RENAME VALUE 'bronze' TO 'ouro';
ALTER TYPE user_tier RENAME VALUE 'silver' TO 'platina';
ALTER TYPE user_tier RENAME VALUE 'gold' TO 'diamante';

-- 2. Novos campos em profiles para PF/PJ
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS document_type TEXT NOT NULL DEFAULT 'cnpj',
  ADD COLUMN IF NOT EXISTS document_number TEXT,
  ADD COLUMN IF NOT EXISTS trade_name TEXT;

-- 3. Backfill: copiar cnpj existente para document_number
UPDATE profiles
SET document_number = cnpj,
    document_type = 'cnpj'
WHERE cnpj IS NOT NULL AND cnpj != '';

-- 4. Atualizar trigger handle_new_user para novos campos
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
  RETURN NEW;
END;
$$;

-- 5. Atualizar app_config tier_discounts com novos nomes
UPDATE app_config
SET value = '{"ouro": 0, "platina": 4, "diamante": 8}'::jsonb
WHERE key = 'tier_discounts';

-- 6. Comentarios
COMMENT ON COLUMN profiles.document_type IS 'Tipo de documento: cpf (pessoa fisica) ou cnpj (pessoa juridica)';
COMMENT ON COLUMN profiles.document_number IS 'Numero do documento (CPF ou CNPJ), campo unificado';
COMMENT ON COLUMN profiles.trade_name IS 'Razao social (somente PJ)';

-- ============================================================================
-- FIM Migration 011
-- ============================================================================
