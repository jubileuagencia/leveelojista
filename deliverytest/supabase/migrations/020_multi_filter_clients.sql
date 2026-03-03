-- ============================================================
-- Migration: Multi-Select Filters for Admin Clients (Phase 20)
-- Description: Updates get_admin_clients to support filtering by Multiple Tiers and Roles via Arrays.
-- ============================================================

-- Drop old signature (with single text params) to avoid ambiguity
DROP FUNCTION IF EXISTS get_admin_clients(int, int, text, text, text);

CREATE OR REPLACE FUNCTION get_admin_clients(
    page int DEFAULT 1,
    page_size int DEFAULT 20,
    search_term text DEFAULT '',
    filter_tiers text[] DEFAULT NULL, -- Array of tiers: ['bronze', 'silver']
    filter_roles text[] DEFAULT NULL  -- Array of roles: ['customer', 'admin']
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
            -- Search Term Logic
            (search_term = '' OR
             p.company_name ILIKE '%' || search_term || '%' OR
             p.cnpj ILIKE '%' || search_term || '%' OR
             u.email ILIKE '%' || search_term || '%')
            
            -- Filter Logic (Multi-Select Tier)
            -- If array is null or empty, return TRUE (show all)
            AND (filter_tiers IS NULL OR cardinality(filter_tiers) = 0 OR p.tier = ANY(filter_tiers))
            
            -- Filter Logic (Multi-Select Role)
            AND (filter_roles IS NULL OR cardinality(filter_roles) = 0 OR p.role = ANY(filter_roles))
    )
    SELECT
        f.*,
        (SELECT COUNT(*) FROM filtered_users)::bigint as total_count
    FROM filtered_users f
    ORDER BY f.created_at DESC
    LIMIT page_size OFFSET v_offset;
END;
$$;
