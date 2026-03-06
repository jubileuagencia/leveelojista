import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile, UserRole } from '@/types';

/**
 * Get the current authenticated user's profile.
 * Returns null if not authenticated.
 */
export async function getUser(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile as Profile | null;
}

/**
 * Require authentication. Redirects to /login if not authenticated.
 */
export async function requireAuth(): Promise<Profile> {
  const user = await getUser();
  if (!user) redirect('/login');
  return user;
}

/**
 * Require a specific role. Redirects to /unauthorized if role doesn't match.
 */
export async function requireRole(...roles: UserRole[]): Promise<Profile> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) redirect('/unauthorized');
  return user;
}
