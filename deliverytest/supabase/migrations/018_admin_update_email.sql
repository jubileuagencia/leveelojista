-- Secure Function to allow Admins to update User Emails
-- Only 'admin' and 'super_admin' can execute this.

create or replace function update_admin_user_email(
  target_user_id uuid,
  new_email text
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_actor_role text;
begin
  -- 1. Check permissions utilizing our secure helper
  v_actor_role := auth_get_user_role();
  
  if v_actor_role not in ('admin', 'super_admin') then
    raise exception 'Access Denied: Only Administrators can update emails.';
  end if;

  -- 2. Validation
  if new_email is null or trim(new_email) = '' then
    raise exception 'Email cannot be empty.';
  end if;

  -- 3. Perform Update on auth.users (System Table)
  update auth.users
  set email = new_email,
      updated_at = now(),
      email_confirmed_at = now() -- Auto-confirm if admin changes it
  where id = target_user_id;

  if not found then
    raise exception 'User not found.';
  end if;
end;
$$;
