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
    const comments = await clickupClient.getComments(taskId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('ClickUp comments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 502 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  const { taskId } = await params;

  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'text required' }, { status: 400 });
    }

    const comment = await clickupClient.addComment(taskId, text);
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('ClickUp add comment error:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 502 }
    );
  }
}
