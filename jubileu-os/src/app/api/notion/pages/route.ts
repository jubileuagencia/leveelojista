import { NextResponse } from 'next/server';
import { apiAuthGuard } from '@/lib/api/auth-guard';
import { notionClient } from '@/lib/notion/client';

export async function POST(request: Request) {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  try {
    const body = await request.json();
    const { parentId, title, parentType } = body;

    if (!parentId || !title) {
      return NextResponse.json(
        { error: 'parentId and title are required' },
        { status: 400 },
      );
    }

    const page = await notionClient.createPage(parentId, title, parentType);
    return NextResponse.json(page, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create page';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
