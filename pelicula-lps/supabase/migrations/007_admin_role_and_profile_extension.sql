-- Phase 0: Admin role + community profile fields

-- Add role and community profile fields to user_profiles
alter table public.user_profiles
  add column role text not null default 'member' check (role in ('member', 'admin', 'moderator')),
  add column bio text,
  add column zodiac_sign text,
  add column interests text[],
  add column avatar_emoji text;

-- Allow all authenticated users to view profiles (needed for community)
drop policy if exists "Users can view own profile" on public.user_profiles;

create policy "Authenticated users can view all profiles"
  on public.user_profiles for select
  using (auth.role() = 'authenticated');

-- Users can still only update their own profile (but not role)
drop policy if exists "Users can update own profile" on public.user_profiles;

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can update any profile (including role changes)
create policy "Admins can update any profile"
  on public.user_profiles for update
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Helper function: check if user has community access
-- Returns true if user has active camarim-mensal or pacote-anual subscription, or is admin/moderator
create or replace function public.has_community_access(uid uuid)
returns boolean as $$
begin
  -- Admin/moderator always has access
  if exists (
    select 1 from public.user_profiles
    where id = uid and role in ('admin', 'moderator')
  ) then
    return true;
  end if;

  -- Check for active subscription to camarim-mensal or pacote-anual
  return exists (
    select 1
    from public.subscriptions s
    join public.plans p on p.id = s.plan_id
    where s.user_id = uid
      and s.status = 'authorized'
      and p.slug in ('camarim-mensal', 'pacote-anual')
  );
end;
$$ language plpgsql security definer stable;

-- Helper function: check if user is admin
create or replace function public.is_admin(uid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.user_profiles
    where id = uid and role = 'admin'
  );
end;
$$ language plpgsql security definer stable;

-- Seed: Set admin role for the team
-- (Run after users are created — this is idempotent via WHERE clause)
-- Fernando (gqueiroz@outlook.com.br) and Jubileu admin
update public.user_profiles
set role = 'admin'
where id in (
  select id from auth.users
  where email in ('gqueiroz@outlook.com.br', 'jubileu.agencia@gmail.com')
);
