import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
}

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-001',
    user_id: 'dev-user-001',
    title: 'Nova entrega aguardando aprovacao',
    body: 'Pack de Posts Instagram — Marco foi enviado para revisao.',
    module: 'deliverable' as const,
    action_url: '/deliverables',
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'notif-002',
    user_id: 'dev-user-001',
    title: 'Tarefa atualizada',
    body: 'Karol completou "Criar artes para feed" no ClickUp.',
    module: 'task' as const,
    action_url: '/tasks',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'notif-003',
    user_id: 'dev-user-001',
    title: 'Workflow concluido',
    body: 'Onboarding de Cliente — Levee foi finalizado com sucesso.',
    module: 'workflow' as const,
    action_url: '/workflows',
    is_read: true,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'notif-004',
    user_id: 'dev-user-001',
    title: 'Revisao solicitada',
    body: 'Cliente solicitou revisao no "Video Reels — Tutorial Ascendente".',
    module: 'deliverable' as const,
    action_url: '/deliverables',
    is_read: false,
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: 'notif-005',
    user_id: 'dev-user-001',
    title: 'Novo documento criado',
    body: 'Gabriel criou "Roteiro Reels — Eclipse Lunar" no Notion.',
    module: 'document' as const,
    action_url: '/docs',
    is_read: true,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'notif-006',
    user_id: 'dev-user-001',
    title: 'Evento amanha',
    body: 'Reuniao de Kickoff — Levee amanha as 10:00.',
    module: 'calendar' as const,
    action_url: '/calendar',
    is_read: false,
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const unreadOnly = searchParams.get('unread') === 'true';
  const limit = parseInt(searchParams.get('limit') ?? '30', 10);

  if (isDevMode()) {
    let notifications = MOCK_NOTIFICATIONS;
    if (unreadOnly) notifications = notifications.filter((n) => !n.is_read);
    return NextResponse.json(notifications.slice(0, limit));
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (unreadOnly) query = query.eq('is_read', false);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const body = await request.json();

  if (isDevMode()) {
    return NextResponse.json({ success: true });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Mark specific notification or all as read
  if (body.id) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', body.id)
      .eq('user_id', user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (body.markAllRead) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
