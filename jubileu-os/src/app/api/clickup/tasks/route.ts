import { NextResponse, type NextRequest } from 'next/server';
import { apiAuthGuard } from '@/lib/api/auth-guard';
import { clickupClient } from '@/lib/clickup/client';

export async function GET(request: NextRequest) {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const listId = searchParams.get('list_id');

  if (!listId) {
    return NextResponse.json({ error: 'list_id required' }, { status: 400 });
  }

  try {
    const statuses = searchParams.getAll('statuses[]');
    const assignees = searchParams.getAll('assignees[]').map(Number);
    const tags = searchParams.getAll('tags[]');
    const page = parseInt(searchParams.get('page') || '0', 10);

    const result = await clickupClient.getTasks({
      listId,
      statuses: statuses.length ? statuses : undefined,
      assignees: assignees.length ? assignees : undefined,
      tags: tags.length ? tags : undefined,
      page,
      subtasks: true,
      include_closed: searchParams.get('include_closed') === 'true',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('ClickUp tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const listId = searchParams.get('list_id');

  if (!listId) {
    return NextResponse.json({ error: 'list_id required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const task = await clickupClient.createTask(listId, body);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('ClickUp create task error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 502 }
    );
  }
}
