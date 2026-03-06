import { NextResponse } from 'next/server';
import { apiAuthGuard } from '@/lib/api/auth-guard';
import { notionClient } from '@/lib/notion/client';

export async function GET(request: Request) {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const cursor = searchParams.get('cursor') ?? undefined;

  try {
    const data = await notionClient.searchPages(query, cursor);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Notion search failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
