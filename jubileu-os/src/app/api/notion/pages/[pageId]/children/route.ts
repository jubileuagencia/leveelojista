import { NextResponse } from 'next/server';
import { apiAuthGuard } from '@/lib/api/auth-guard';
import { notionClient } from '@/lib/notion/client';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageId: string }> },
) {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  const { pageId } = await params;

  try {
    const children = await notionClient.getChildPages(pageId);
    return NextResponse.json(children);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch children';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
