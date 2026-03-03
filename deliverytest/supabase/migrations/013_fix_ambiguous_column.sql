-- ============================================================
-- Fix: Ambiguous Column ID (Phase 13)
-- Description: Fixes 'column reference "id" is ambiguous' error in get_admin_clients.
-- ============================================================

CREATE OR REPLACE FUNCTION get_admin_clients(
    page int DEFAULT 1,
    page_size int DEFAULT 20,
    search_term text DEFAULT ''
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
BEGIN
    -- 1. Security Check
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access Denied: You are not an Admin.';
    END IF;

    v_offset := (page - 1) * page_size;

    -- 2. Return Query
    RETURN QUERY
    WITH filtered_users AS (
        SELECT
            p.id, -- Explicitly p.id (Profiles ID)
            p.company_name,
            p.cnpj,
            p.phone,
            p.tier,
            p.role,
            CAST(u.email AS varchar) as email,
            p.created_at
        FROM public.profiles p
        JOIN auth.users u ON p.id = u.id
        WHERE
            (search_term = '' OR
             p.company_name ILIKE '%' || search_term || '%' OR
             p.cnpj ILIKE '%' || search_term || '%' OR
             u.email ILIKE '%' || search_term || '%')
    )
    SELECT
        f.id,
        f.company_name,
        f.cnpj,
        f.phone,
        f.tier,
        f.role,
        f.email,
        f.created_at,
        (SELECT COUNT(*) FROM filtered_users)::bigint as total_count
    FROM filtered_users f
    ORDER BY f.created_at DESC
    LIMIT page_size OFFSET v_offset;
END;
$$;
