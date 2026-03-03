-- ============================================================
-- Migration: Fix Infinite Recursion (Phase 17)
-- Description: Replaces self-referencing RLS policies with a SECURITY DEFINER function.
-- ============================================================

-- 1. Create a Secure Helper Function
-- This function runs with elevated privileges (SECURITY DEFINER)
-- allowing it to read 'profiles' without triggering the RLS policy loop.

CREATE OR REPLACE FUNCTION auth_get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION auth_get_user_role TO authenticated;


-- 2. Update Profiles Policy (The Recursive Culprit)
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;

-- New Policy: Use the function instead of a subquery
CREATE POLICY "profiles_select_admin" ON profiles
    FOR SELECT USING (
        auth_get_user_role() IN ('admin', 'super_admin')
    );

CREATE POLICY "profiles_update_admin" ON profiles
    FOR UPDATE USING (
        auth_get_user_role() IN ('admin', 'super_admin')
    );


-- 3. Update User Addresses Policy (Safety Fix)
DROP POLICY IF EXISTS "addresses_all_admin" ON user_addresses;

CREATE POLICY "addresses_all_admin" ON user_addresses
    FOR ALL USING (
        auth_get_user_role() IN ('admin', 'super_admin')
    );
