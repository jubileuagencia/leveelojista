import { NextResponse, type NextRequest } from 'next/server';
import { apiAuthGuard } from '@/lib/api/auth-guard';
import { clickupClient } from '@/lib/clickup/client';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  const { taskId } = await params;

  try {
    const task = await clickupClient.getTask(taskId);
    return NextResponse.json(task);
  } catch (error) {
    console.error('ClickUp task detail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 502 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  const { taskId } = await params;

  try {
    const body = await request.json();
    const task = await clickupClient.updateTask(taskId, body);
    return NextResponse.json(task);
  } catch (error) {
    console.error('ClickUp update task error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 502 }
    );
  }
}
