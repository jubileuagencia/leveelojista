import { NextResponse } from 'next/server';
import { apiAuthGuard } from '@/lib/api/auth-guard';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', auth.userId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(profile);
}

export async function PATCH(request: Request) {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  const body = await request.json();

  // Only allow editing own name and avatar
  const allowedFields: Record<string, unknown> = {};
  if (body.full_name !== undefined) allowedFields.full_name = body.full_name;
  if (body.avatar_url !== undefined) allowedFields.avatar_url = body.avatar_url;

  if (Object.keys(allowedFields).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  allowedFields.updated_at = new Date().toISOString();

  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from('profiles')
    .update(allowedFields)
    .eq('id', auth.userId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(updated);
}
