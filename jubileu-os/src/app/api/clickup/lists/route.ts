import { NextResponse, type NextRequest } from 'next/server';
import { apiAuthGuard } from '@/lib/api/auth-guard';
import { clickupClient } from '@/lib/clickup/client';

export async function GET(request: NextRequest) {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folder_id');
  const spaceId = searchParams.get('space_id');

  try {
    if (folderId) {
      const lists = await clickupClient.getLists(folderId);
      return NextResponse.json(lists);
    }
    if (spaceId) {
      const lists = await clickupClient.getFolderlessLists(spaceId);
      return NextResponse.json(lists);
    }

    return NextResponse.json(
      { error: 'folder_id or space_id required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('ClickUp lists error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
      { status: 502 }
    );
  }
}
