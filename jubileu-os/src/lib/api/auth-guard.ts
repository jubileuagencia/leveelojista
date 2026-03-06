import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Validates auth for API routes. Returns user ID or error response.
 */
export async function apiAuthGuard(): Promise<
  { userId: string } | { error: NextResponse }
> {
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
