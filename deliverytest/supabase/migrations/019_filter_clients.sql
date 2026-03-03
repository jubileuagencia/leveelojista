-- ============================================================
-- Migration: Add Filtering to Admin Clients (Phase 19)
-- Description: Updates get_admin_clients to support filtering by Tier and Role.
--              Includes data backfilling to prevent "Visual Lies" (NULL tiers appearing as Bronze but not filtering).
-- ============================================================

-- 1. Data Consistency Fix (Backfilling)
-- Ensure all profiles have a valid Tier and Role to start with.
UPDATE public.profiles SET tier = 'bronze' WHERE tier IS NULL;
UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;

-- 2. Drop Old Function Signature
DROP FUNCTION IF EXISTS get_admin_clients(int, int, text);

-- 3. Create New Function with Filters
CREATE OR REPLACE FUNCTION get_admin_clients(
    page int DEFAULT 1,
    page_size int DEFAULT 20,
    search_term text DEFAULT '',
    filter_tier text DEFAULT NULL, -- 'bronze', 'silver', 'gold' OR NULL
    filter_role text DEFAULT NULL  -- 'customer', 'admin', 'super_admin' OR NULL
)
RETURNS TABLE (
    id uuid,
    company_name text,
    cnpj text,
    phone text,
    tier text,
    role text,
    email varchar,
    created_at timestamptz,
    total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_offset int;
    v_user_role text;
BEGIN
    -- Security Check: Allow 'admin' OR 'super_admin'
    SELECT p.role INTO v_user_role FROM public.profiles p WHERE p.id = auth.uid();
    
    IF v_user_role NOT IN ('admin', 'super_admin') THEN
        RAISE EXCEPTION 'Access Denied: You are not an Admin.';
    END IF;

    v_offset := (page - 1) * page_size;

    RETURN QUERY
    WITH filtered_users AS (
        SELECT
            p.id,
            p.company_name,
            p.cnpj,
            p.phone,
            p.tier,
            p.role,
            u.email::varchar,
            p.created_at
        FROM public.profiles p
        JOIN auth.users u ON p.id = u.id
        WHERE
            -- Search Term Logic (Name, CNPJ, Email)
            (search_term = '' OR
             p.company_name ILIKE '%' || search_term || '%' OR
             p.cnpj ILIKE '%' || search_term || '%' OR
             u.email ILIKE '%' || search_term || '%')
            
            -- Filter Logic (Tier)
            AND (filter_tier IS NULL OR filter_tier = '' OR p.tier = filter_tier)
            
            -- Filter Logic (Role)
            AND (filter_role IS NULL OR filter_role = '' OR p.role = filter_role)
    )
    SELECT
        f.*,
        (SELECT COUNT(*) FROM filtered_users)::bigint as total_count
    FROM filtered_users f
    ORDER BY f.created_at DESC
    LIMIT page_size OFFSET v_offset;
END;
$$;
