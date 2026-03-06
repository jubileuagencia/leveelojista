import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const DEV_USER_ID = 'dev-user-001';

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
}

// GET /api/chat/sessions?agentId=xxx — list sessions for an agent
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get('agentId');

  if (isDevMode()) {
    // Return empty list in dev mode (no DB)
    return NextResponse.json([]);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let query = supabase
    .from('chat_sessions')
    .select('id, agent_id, title, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (agentId) {
    query = query.eq('agent_id', agentId);
  }

  const { data, error } = await query.limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/chat/sessions — create new session
export async function POST(request: Request) {
  const body = await request.json();
  const { agentId, title } = body;

  if (!agentId) {
    return NextResponse.json({ error: 'agentId required' }, { status: 400 });
  }

  if (isDevMode()) {
    // Return mock session
    return NextResponse.json({
      id: `dev-session-${Date.now()}`,
      user_id: DEV_USER_ID,
      agent_id: agentId,
      title: title || 'Nova conversa',
      messages: [],
      context_refs: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: user.id,
      agent_id: agentId,
      title: title || 'Nova conversa',
      messages: [],
      context_refs: [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
