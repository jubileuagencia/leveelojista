import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNotification } from '@/lib/notification-sender';

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
}

// Simple in-memory for dev — shared with parent route via module cache
const devExecutions: Record<string, Record<string, unknown>> = {};

// GET /api/workflows/executions/:executionId
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ executionId: string }> }
) {
  const { executionId } = await params;

  if (isDevMode()) {
    const exec = devExecutions[executionId];
    if (!exec) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(exec);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('workflow_executions')
    .select('*')
    .eq('id', executionId)
    .eq('user_id', user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

// PATCH /api/workflows/executions/:executionId — update step statuses
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ executionId: string }> }
) {
  const { executionId } = await params;
  const body = await request.json();

  if (isDevMode()) {
    const exec = devExecutions[executionId];
    if (exec) {
      if (body.step_statuses !== undefined) exec.step_statuses = body.step_statuses;
      if (body.current_step_id !== undefined) exec.current_step_id = body.current_step_id;
      if (body.status !== undefined) exec.status = body.status;
      if (body.completed_at !== undefined) exec.completed_at = body.completed_at;
      exec.updated_at = new Date().toISOString();
    }
    return NextResponse.json(exec ?? { id: executionId, ...body });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const updateData: Record<string, unknown> = {};
  if (body.step_statuses !== undefined) updateData.step_statuses = body.step_statuses;
  if (body.current_step_id !== undefined) updateData.current_step_id = body.current_step_id;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.completed_at !== undefined) updateData.completed_at = body.completed_at;

  const { data, error } = await supabase
    .from('workflow_executions')
    .update(updateData)
    .eq('id', executionId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send notification when workflow is completed
  if (body.status === 'completed' && data) {
    sendNotification({
      userId: user.id,
      title: 'Workflow concluido',
      body: `Workflow "${data.workflow_id}" foi finalizado com sucesso.`,
      module: 'workflow',
      actionUrl: `/workflows/${data.workflow_id}`,
    });
  }

  return NextResponse.json(data);
}
