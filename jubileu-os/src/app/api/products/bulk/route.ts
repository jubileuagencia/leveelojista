import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { ids, action } = body as { ids: string[]; action: 'activate' | 'deactivate' | 'delete' };

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'IDs obrigatorios' }, { status: 400 });
  }

  if (!['activate', 'deactivate', 'delete'].includes(action)) {
    return NextResponse.json({ error: 'Acao invalida' }, { status: 400 });
  }

  let updates: Record<string, unknown> = {};
  if (action === 'activate') {
    updates = { is_active: true };
  } else if (action === 'deactivate') {
    updates = { is_active: false };
  } else if (action === 'delete') {
    updates = { deleted_at: new Date().toISOString() };
  }

  const { error } = await supabase
    .from('products')
    .update(updates)
    .in('id', ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, count: ids.length });
}
