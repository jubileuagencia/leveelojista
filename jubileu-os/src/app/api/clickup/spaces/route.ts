import { NextResponse } from 'next/server';
import { apiAuthGuard } from '@/lib/api/auth-guard';
import { clickupClient } from '@/lib/clickup/client';

export async function GET() {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  try {
    const spaces = await clickupClient.getSpaces();
    return NextResponse.json(spaces);
  } catch (error) {
    console.error('ClickUp spaces error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch spaces' },
      { status: 502 }
    );
  }
}
