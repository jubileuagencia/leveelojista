-- ============================================================
-- Migration: Admin Client Access (Phase 10)
-- Description: Creates a secure RPC function for Admins to fetch clients + emails
-- ============================================================

-- Function: get_admin_clients
-- Purpose: Bypasses auth.users RLS (via SECURITY DEFINER) to let Admins seeing emails.
-- Includes: Pagination, Search (Name/CNPJ/Email), Total Count.

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
SECURITY DEFINER -- CRITICAL: Allows reading auth.users
SET search_path = public, auth
AS $$
DECLARE
    v_offset int;
BEGIN
    -- 1. Security Check: Block non-admins
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access Denied: You are not an Admin.';
    END IF;

    v_offset := (page - 1) * page_size;

    -- 2. Return Query
    RETURN QUERY
    WITH filtered_users AS (
        SELECT
            p.id,
            p.company_name,
            p.cnpj,
            p.phone,
            p.tier,
            p.role,
            -- Cast email to varchar to match return type
            u.email::varchar,
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
        f.*,
        (SELECT COUNT(*) FROM filtered_users)::bigint as total_count
    FROM filtered_users f
    ORDER BY f.created_at DESC
    LIMIT page_size OFFSET v_offset;
END;
$$;

-- Grant execution to authenticated users (Logic inside blocks non-admins)
GRANT EXECUTE ON FUNCTION get_admin_clients TO authenticated;
