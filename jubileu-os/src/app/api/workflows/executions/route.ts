import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const DEV_USER_ID = 'dev-user-001';

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
}

// In-memory store for dev mode
const devExecutions: Record<string, Record<string, unknown>> = {};

// GET /api/workflows/executions?workflowId=xxx&status=running
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get('workflowId');
  const status = searchParams.get('status');

  if (isDevMode()) {
    let results = Object.values(devExecutions);
    if (workflowId) results = results.filter((e) => e.workflow_id === workflowId);
    if (status) results = results.filter((e) => e.status === status);
    return NextResponse.json(results);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let query = supabase
    .from('workflow_executions')
    .select('*')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false });

  if (workflowId) query = query.eq('workflow_id', workflowId);
  if (status) query = query.eq('status', status);

  const { data, error } = await query.limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/workflows/executions — start a new execution
export async function POST(request: Request) {
  const body = await request.json();
  const { workflowId, clientId } = body;

  if (!workflowId) {
    return NextResponse.json({ error: 'workflowId required' }, { status: 400 });
  }

  if (isDevMode()) {
    const id = `dev-exec-${Date.now()}`;
    const execution = {
      id,
      user_id: DEV_USER_ID,
      workflow_id: workflowId,
      client_id: clientId ?? null,
      status: 'running',
      step_statuses: {},
      current_step_id: null,
      started_at: new Date().toISOString(),
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    devExecutions[id] = execution;
    return NextResponse.json(execution, { status: 201 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('workflow_executions')
    .insert({
      user_id: user.id,
      workflow_id: workflowId,
      client_id: clientId ?? null,
      status: 'running',
      step_statuses: {},
      current_step_id: null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
