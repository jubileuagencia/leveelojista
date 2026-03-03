-- ============================================================
-- Migration: Super Admin & Role Protection (Phase 14)
-- Description: Enforces hierarchy: Super Admin > Admin > Customer.
-- ============================================================

-- Function: prevent_role_change (Enhanced)
-- Rules:
-- 1. ONLY 'super_admin' or 'admin' can change roles.
-- 2. 'admin' can ONLY promote to 'admin' (cannot create super_admin).
-- 3. 'admin' CANNOT demote/edit another 'admin' or 'super_admin'.
-- 4. 'super_admin' can do anything.

CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_actor_role text;
BEGIN
    -- Check if the 'role' column is being modified
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        
        -- Get the role of the user performing the update (Actor)
        -- IF accessed via Dashboard/SQL Editor, auth.uid() is NULL. Allow it for bootstrapping.
        IF auth.uid() IS NULL THEN
            RETURN NEW;
        END IF;

        SELECT role INTO v_actor_role
        FROM profiles
        WHERE id = auth.uid();

        -- Rule 0: Must be at least Admin to change roles
        IF v_actor_role NOT IN ('admin', 'super_admin') THEN
            RAISE EXCEPTION 'Access Denied: Only Admins can change roles.';
        END IF;

        -- Rule 1: Admin cannot touch Super Admin matches
        IF OLD.role = 'super_admin' AND v_actor_role = 'admin' THEN
             RAISE EXCEPTION 'Access Denied: Admins cannot modify Super Admins.';
        END IF;

        -- Rule 2: Admin cannot touch other Admins (Prevent Insurrection)
        IF OLD.role = 'admin' AND v_actor_role = 'admin' AND OLD.id != auth.uid() THEN
             RAISE EXCEPTION 'Access Denied: You cannot modify other Admins.';
        END IF;

        -- Rule 3: Admin cannot promote someone to Super Admin
        IF NEW.role = 'super_admin' AND v_actor_role = 'admin' THEN
             RAISE EXCEPTION 'Access Denied: Only Super Admins can create new Super Admins.';
        END IF;

    END IF;
    
    RETURN NEW;
END;
$$;

-- Re-apply Trigger (Just to be sure)
DROP TRIGGER IF EXISTS "trg_protect_role" ON profiles;

CREATE TRIGGER "trg_protect_role"
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_role_change();
