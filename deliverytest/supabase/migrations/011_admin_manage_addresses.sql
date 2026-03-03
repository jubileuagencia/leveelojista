-- ============================================================
-- Migration: Admin Manage Addresses & Profiles (Phase 11)
-- Description: Grants Admins full CRUD on profiles and user_addresses.
-- ============================================================

-- 1. PROFILES: Allow Admin to UPDATE any profile (Tier/Phone/etc)
-- (Assuming SELECT is already public or authenticated)

DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;

CREATE POLICY "profiles_update_admin" ON profiles
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

-- 2. USER_ADDRESSES: Allow Admin full control
-- (Admins can Add/Edit/Delete addresses for other users)

ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Cleanup potential conflicting policies
DROP POLICY IF EXISTS "addresses_all_admin" ON user_addresses;

-- Unified Policy (CRUD)
CREATE POLICY "addresses_all_admin" ON user_addresses
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

-- 3. HELPER: Function to safely update client email (Optional Future)
-- Note: Updating auth.users requires Service Role, so we won't do it via RLS.
-- This migration focuses on business data (Profiles/Addresses).
