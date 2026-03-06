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
    const [page, blocks] = await Promise.all([
      notionClient.getPage(pageId),
      notionClient.getAllBlocks(pageId),
    ]);

    // Extract title
    let title = 'Untitled';
    for (const prop of Object.values(page.properties)) {
      const p = prop as { type?: string; title?: { plain_text: string }[] };
      if (p.type === 'title' && p.title) {
        title = p.title.map((t) => t.plain_text).join('');
        break;
      }
    }

    return NextResponse.json({
      page: {
        id: page.id,
        title,
        icon: page.icon,
        cover: page.cover,
        lastEdited: page.last_edited_time,
        url: page.url,
        parent: page.parent,
      },
      blocks,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch page';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
