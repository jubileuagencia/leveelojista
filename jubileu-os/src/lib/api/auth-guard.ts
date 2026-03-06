import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return url.includes('supabase.co') || url.includes('supabase.in');
}

/**
 * Validates auth for API routes. Returns user ID or error response.
 * In dev mode (no Supabase), returns mock user ID.
 */
export async function apiAuthGuard(): Promise<
  { userId: string } | { error: NextResponse }
> {
  if (!isSupabaseConfigured()) {
    return { userId: 'dev-user-001' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  // Check if user is active
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_active, role')
    .eq('id', user.id)
    .single();

  if (!profile?.is_active) {
    return {
      error: NextResponse.json({ error: 'Account deactivated' }, { status: 403 }),
    };
  }

  return { userId: user.id };
}
