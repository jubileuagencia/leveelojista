import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const DEV_USER_ID = 'dev-user-001';

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
}

const MOCK_ACTIVITIES = [
  {
    id: 'mock-1',
    user_id: DEV_USER_ID,
    action: 'client.created',
    entity_type: 'client',
    entity_id: null,
    entity_name: 'Pelicula Sideral',
    client_id: null,
    metadata: {},
    created_at: new Date(Date.now() - 5 * 60_000).toISOString(),
    profiles: { full_name: 'Fernando (Dev)', avatar_url: null },
  },
  {
    id: 'mock-2',
    user_id: DEV_USER_ID,
    action: 'task.created',
    entity_type: 'task',
    entity_id: '86afp0pyc',
    entity_name: 'Criar LP Decifrando',
    client_id: null,
    metadata: {},
    created_at: new Date(Date.now() - 15 * 60_000).toISOString(),
    profiles: { full_name: 'Fernando (Dev)', avatar_url: null },
  },
  {
    id: 'mock-3',
    user_id: DEV_USER_ID,
    action: 'agent.chat_started',
    entity_type: 'agent',
    entity_id: 'dev',
    entity_name: 'Dex',
    client_id: null,
    metadata: {},
    created_at: new Date(Date.now() - 60 * 60_000).toISOString(),
    profiles: { full_name: 'Fernando (Dev)', avatar_url: null },
  },
  {
    id: 'mock-4',
    user_id: DEV_USER_ID,
    action: 'document.created',
    entity_type: 'document',
    entity_id: null,
    entity_name: 'PRD Sistema Operacional',
    client_id: null,
    metadata: {},
    created_at: new Date(Date.now() - 2 * 3600_000).toISOString(),
    profiles: { full_name: 'Fernando (Dev)', avatar_url: null },
  },
  {
    id: 'mock-5',
    user_id: DEV_USER_ID,
    action: 'system.login',
    entity_type: 'system',
    entity_id: null,
    entity_name: null,
    client_id: null,
    metadata: {},
    created_at: new Date(Date.now() - 5 * 3600_000).toISOString(),
    profiles: { full_name: 'Fernando (Dev)', avatar_url: null },
  },
];

// GET /api/activity?limit=20&entityType=task&action=task.created&userId=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
  const entityType = searchParams.get('entityType');
  const action = searchParams.get('action');
  const userId = searchParams.get('userId');

  if (isDevMode()) {
    let data = MOCK_ACTIVITIES;
    if (entityType) data = data.filter((a) => a.entity_type === entityType);
    if (action) data = data.filter((a) => a.action === action);
    return NextResponse.json(data.slice(0, limit));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let query = supabase
    .from('activity_logs')
    .select('*, profiles!activity_logs_user_id_fkey(full_name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (entityType) query = query.eq('entity_type', entityType);
  if (action) query = query.eq('action', action);
  if (userId) query = query.eq('user_id', userId);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
