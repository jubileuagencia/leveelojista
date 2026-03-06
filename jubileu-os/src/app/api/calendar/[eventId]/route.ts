import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const body = await request.json();

  if (isDevMode()) {
    return NextResponse.json({ id: eventId, ...body, updated_at: new Date().toISOString() });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.description !== undefined) update.description = body.description;
  if (body.start_date !== undefined) update.start_date = body.start_date;
  if (body.end_date !== undefined) update.end_date = body.end_date;
  if (body.all_day !== undefined) update.all_day = body.all_day;
  if (body.color !== undefined) update.color = body.color;

  const { data, error } = await supabase
    .from('calendar_events')
    .update(update)
    .eq('id', eventId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  if (isDevMode()) {
    return NextResponse.json({ success: true });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', eventId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
