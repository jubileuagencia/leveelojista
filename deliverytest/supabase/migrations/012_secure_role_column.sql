-- ============================================================
-- Migration: Secure Role Column (Phase 12)
-- Description: Prevent users from self-promoting to Admin via API.
-- ============================================================

-- Strategy: Use a BEFORE UPDATE Trigger.
-- Why? RLS policies on specific columns are tricky in Postgres.
-- A trigger is the most robust way to say: "If current user is NOT admin, they cannot touch 'role'".

CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if the 'role' column is being modified
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        -- Allow if the ACTOR is an Admin
        -- (We check the role of the user performing the request)
        IF NOT EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        ) THEN
            RAISE EXCEPTION 'Access Denied: You cannot change your own role.';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Apply Trigger to profiles table
DROP TRIGGER IF EXISTS "trg_protect_role" ON profiles;

CREATE TRIGGER "trg_protect_role"
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_role_change();

-- Note: This trigger runs for EVERY update on profiles.
-- If a normal user updates their name, the trigger sees role didn't change -> OK.
-- If a normal user tries to send {role: 'admin'}, trigger sees role changed -> BLOCKED.
