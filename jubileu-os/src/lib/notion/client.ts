import type {
  NotionPage,
  NotionBlock,
  NotionSearchResult,
  NotionRichText,
} from './types';

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function getToken(): string {
  const token = process.env.NOTION_API_TOKEN;
  if (!token) throw new Error('NOTION_API_TOKEN not configured');
  return token;
}

function headers() {
  return {
    Authorization: `Bearer ${getToken()}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
}

async function notionFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${NOTION_API}${path}`, {
    ...options,
    headers: { ...headers(), ...options?.headers },
  });

  if (res.status === 429) {
    // Rate limited — wait and retry once
    const retryAfter = parseInt(res.headers.get('retry-after') || '1', 10);
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    const retry = await fetch(`${NOTION_API}${path}`, {
      ...options,
      headers: { ...headers(), ...options?.headers },
    });
    if (!retry.ok) {
      const err = await retry.json().catch(() => ({}));
      throw new Error(err.message || `Notion API error: ${retry.status}`);
    }
    return retry.json();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Notion API error: ${res.status}`);
  }

  return res.json();
}

// Extract title from page properties
function extractTitle(properties: Record<string, unknown>): string {
  for (const prop of Object.values(properties)) {
    const p = prop as { type?: string; title?: NotionRichText[] };
    if (p.type === 'title' && p.title) {
      return p.title.map((t) => t.plain_text).join('');
    }
  }
  return 'Untitled';
}

export const notionClient = {
  async searchPages(query: string, cursor?: string): Promise<{
    results: NotionSearchResult[];
    has_more: boolean;
    next_cursor: string | null;
  }> {
    const body: Record<string, unknown> = {
      query,
      filter: { value: 'page', property: 'object' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
      page_size: 20,
    };
    if (cursor) body.start_cursor = cursor;

    const data = await notionFetch<{
      results: NotionPage[];
      has_more: boolean;
      next_cursor: string | null;
    }>('/search', { method: 'POST', body: JSON.stringify(body) });

    return {
      results: data.results.map((page) => ({
        id: page.id,
        title: extractTitle(page.properties),
        icon: page.icon,
        lastEdited: page.last_edited_time,
        parent: page.parent,
        url: page.url,
      })),
      has_more: data.has_more,
      next_cursor: data.next_cursor,
    };
  },

  async getPage(pageId: string): Promise<NotionPage> {
    return notionFetch<NotionPage>(`/pages/${pageId}`);
  },

  async getBlocks(blockId: string, cursor?: string): Promise<{
    results: NotionBlock[];
    has_more: boolean;
    next_cursor: string | null;
  }> {
    const params = new URLSearchParams({ page_size: '100' });
    if (cursor) params.set('start_cursor', cursor);

    return notionFetch(`/blocks/${blockId}/children?${params.toString()}`);
  },

  async getAllBlocks(blockId: string): Promise<NotionBlock[]> {
    const blocks: NotionBlock[] = [];
    let cursor: string | undefined;

    do {
      const data = await this.getBlocks(blockId, cursor);
      blocks.push(...data.results);
      cursor = data.has_more ? (data.next_cursor ?? undefined) : undefined;
    } while (cursor);

    // Load children for blocks that have them (max 1 level deep for performance)
    for (const block of blocks) {
      if (block.has_children && block.type !== 'child_page' && block.type !== 'child_database') {
        const children = await this.getBlocks(block.id);
        block.children = children.results;
      }
    }

    return blocks;
  },

  async createPage(parentId: string, title: string, parentType: 'page' | 'database' = 'page') {
    const parent =
      parentType === 'database'
        ? { database_id: parentId }
        : { page_id: parentId };

    const properties =
      parentType === 'database'
        ? { title: { title: [{ text: { content: title } }] } }
        : { title: { title: [{ text: { content: title } }] } };

    return notionFetch<NotionPage>('/pages', {
      method: 'POST',
      body: JSON.stringify({ parent, properties }),
    });
  },

  async getChildPages(pageId: string): Promise<NotionSearchResult[]> {
    const data = await this.getAllBlocks(pageId);
    const childPages = data.filter(
      (b) => b.type === 'child_page' || b.type === 'child_database'
    );

    return childPages.map((block) => ({
      id: block.id,
      title: block.child_page?.title || block.child_database?.title || 'Untitled',
      icon: null,
      lastEdited: block.last_edited_time,
      parent: { type: 'page_id' as const, page_id: pageId },
      url: `https://notion.so/${block.id.replace(/-/g, '')}`,
    }));
  },
};
