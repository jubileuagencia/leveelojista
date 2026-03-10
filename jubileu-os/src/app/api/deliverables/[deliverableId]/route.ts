import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNotification } from '@/lib/notification-sender';

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ deliverableId: string }> }
) {
  const { deliverableId } = await params;

  if (isDevMode()) {
    return NextResponse.json({
      id: deliverableId,
      client_id: 'client-001',
      title: 'Mock Deliverable',
      description: 'Dev mode mock.',
      type: 'other',
      status: 'draft',
      file_url: null,
      preview_url: null,
      due_date: null,
      submitted_at: null,
      reviewed_at: null,
      review_note: null,
      created_by: 'dev-user-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      clients: { name: 'Mock Client', slug: 'mock' },
      profiles: { full_name: 'Fernando (Dev)' },
    });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('deliverables')
    .select('*, clients(name, slug), profiles(full_name)')
    .eq('id', deliverableId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ deliverableId: string }> }
) {
  const { deliverableId } = await params;
  const body = await request.json();

  if (isDevMode()) {
    return NextResponse.json({ id: deliverableId, ...body, updated_at: new Date().toISOString() });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  // Build update object
  const update: Record<string, unknown> = {};

  // Client users can only approve or request revision
  if (profile.role === 'client') {
    if (body.status && !['approved', 'revision_requested'].includes(body.status)) {
      return NextResponse.json({ error: 'Clients can only approve or request revision' }, { status: 403 });
    }
    if (body.status) {
      update.status = body.status;
      update.reviewed_at = new Date().toISOString();
    }
    if (body.review_note !== undefined) update.review_note = body.review_note;
  } else {
    // Admin/member can update any field
    if (body.title !== undefined) update.title = body.title;
    if (body.description !== undefined) update.description = body.description;
    if (body.type !== undefined) update.type = body.type;
    if (body.status !== undefined) {
      update.status = body.status;
      if (body.status === 'pending_review') {
        update.submitted_at = new Date().toISOString();
      }
    }
    if (body.file_url !== undefined) update.file_url = body.file_url;
    if (body.preview_url !== undefined) update.preview_url = body.preview_url;
    if (body.due_date !== undefined) update.due_date = body.due_date;
    if (body.review_note !== undefined) update.review_note = body.review_note;
  }

  const { data, error } = await supabase
    .from('deliverables')
    .update(update)
    .eq('id', deliverableId)
    .select('*, clients(name, slug), profiles(full_name)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Auto-generate notifications on status changes
  if (body.status && data) {
    const title = data.title ?? 'Entrega';
    if (body.status === 'pending_review') {
      // Notify the deliverable creator that it's pending review
      sendNotification({
        userId: data.created_by,
        title: 'Entrega enviada para revisao',
        body: `"${title}" foi enviada para aprovacao.`,
        module: 'deliverable',
        actionUrl: `/deliverables`,
      });
    } else if (body.status === 'approved') {
      sendNotification({
        userId: data.created_by,
        title: 'Entrega aprovada',
        body: `"${title}" foi aprovada pelo cliente.`,
        module: 'deliverable',
        actionUrl: `/deliverables`,
      });
    } else if (body.status === 'revision_requested') {
      sendNotification({
        userId: data.created_by,
        title: 'Revisao solicitada',
        body: `Cliente solicitou revisao em "${title}".`,
        module: 'deliverable',
        actionUrl: `/deliverables`,
      });
    }
  }

  return NextResponse.json(data);
}
