-- ============================================================
-- Migration: Fix Admin Client Access for Super Admins (Phase 15)
-- Description: Updates get_admin_clients to allow 'super_admin' access.
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
    v_user_role text;
BEGIN
    -- 1. Security Check: Allow 'admin' OR 'super_admin'
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
        JOIN auth.users u ON p.id = u.id -- Ambiguity Fixed: u.id explicitly joins p.id
        WHERE
            (search_term = '' OR
             p.company_name ILIKE '%' || search_term || '%' OR
             p.cnpj ILIKE '%' || search_term || '%' OR
             u.email ILIKE '%' || search_term || '%')
    )
    SELECT
        *,
        (SELECT COUNT(*) FROM filtered_users)::bigint as total_count
    FROM filtered_users
    ORDER BY created_at DESC
    LIMIT page_size OFFSET v_offset;
END;
$$;
