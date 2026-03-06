import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile, UserRole } from '@/types';

// Dev mode mock user (when Supabase is not configured)
const DEV_MOCK_USER: Profile = {
  id: 'dev-user-001',
  email: 'fernando@jubileu.dev',
  full_name: 'Fernando (Dev)',
  avatar_url: null,
  role: 'admin',
  is_active: true,
  last_login_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return url.includes('supabase.co') || url.includes('supabase.in');
}

/**
 * Get the current authenticated user's profile.
 * Returns null if not authenticated.
 */
export async function getUser(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return DEV_MOCK_USER;

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
