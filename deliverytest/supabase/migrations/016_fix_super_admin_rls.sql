-- ============================================================
-- Migration: Fix Super Admin RLS (Phase 16)
-- Description: Updates RLS policies to include 'super_admin' in CRUD operations.
-- ============================================================

-- 1. PROFILES: Update Policy
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;

CREATE POLICY "profiles_update_admin" ON profiles
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin'))
    );

-- Ensure Admins can SELECT any profile (if not already covered by public policy)
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;

CREATE POLICY "profiles_select_admin" ON profiles
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin'))
    );


-- 2. USER_ADDRESSES: Update Policy for Unified Admin Access
DROP POLICY IF EXISTS "addresses_all_admin" ON user_addresses;

CREATE POLICY "addresses_all_admin" ON user_addresses
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin'))
    );
