import { NextRequest, NextResponse } from 'next/server';

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number | null;
  modifiedTime: string;
  iconLink: string | null;
  thumbnailLink: string | null;
  webViewLink: string | null;
  parents: string[];
}

const MOCK_FILES: DriveFile[] = [
  {
    id: 'folder-clients',
    name: 'Clientes',
    mimeType: 'application/vnd.google-apps.folder',
    size: null,
    modifiedTime: new Date(Date.now() - 86400000).toISOString(),
    iconLink: null,
    thumbnailLink: null,
    webViewLink: null,
    parents: ['root'],
  },
  {
    id: 'folder-pelicula',
    name: 'Pelicula Sideral',
    mimeType: 'application/vnd.google-apps.folder',
    size: null,
    modifiedTime: new Date(Date.now() - 2 * 86400000).toISOString(),
    iconLink: null,
    thumbnailLink: null,
    webViewLink: null,
    parents: ['folder-clients'],
  },
  {
    id: 'folder-levee',
    name: 'Levee',
    mimeType: 'application/vnd.google-apps.folder',
    size: null,
    modifiedTime: new Date(Date.now() - 3 * 86400000).toISOString(),
    iconLink: null,
    thumbnailLink: null,
    webViewLink: null,
    parents: ['folder-clients'],
  },
  {
    id: 'folder-templates',
    name: 'Templates',
    mimeType: 'application/vnd.google-apps.folder',
    size: null,
    modifiedTime: new Date(Date.now() - 5 * 86400000).toISOString(),
    iconLink: null,
    thumbnailLink: null,
    webViewLink: null,
    parents: ['root'],
  },
  {
    id: 'doc-briefing',
    name: 'Briefing Template',
    mimeType: 'application/vnd.google-apps.document',
    size: null,
    modifiedTime: new Date(Date.now() - 86400000).toISOString(),
    iconLink: null,
    thumbnailLink: null,
    webViewLink: 'https://docs.google.com',
    parents: ['folder-templates'],
  },
  {
    id: 'sheet-kpis',
    name: 'KPIs Dashboard 2026',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    size: null,
    modifiedTime: new Date(Date.now() - 2 * 86400000).toISOString(),
    iconLink: null,
    thumbnailLink: null,
    webViewLink: 'https://sheets.google.com',
    parents: ['root'],
  },
  {
    id: 'img-logo',
    name: 'Logo Pelicula.png',
    mimeType: 'image/png',
    size: 245000,
    modifiedTime: new Date(Date.now() - 4 * 86400000).toISOString(),
    iconLink: null,
    thumbnailLink: null,
    webViewLink: null,
    parents: ['folder-pelicula'],
  },
  {
    id: 'pdf-relatorio',
    name: 'Relatorio Fevereiro.pdf',
    mimeType: 'application/pdf',
    size: 1250000,
    modifiedTime: new Date(Date.now() - 86400000).toISOString(),
    iconLink: null,
    thumbnailLink: null,
    webViewLink: null,
    parents: ['folder-pelicula'],
  },
  {
    id: 'video-reels',
    name: 'Reels Eclipse Lunar.mp4',
    mimeType: 'video/mp4',
    size: 15600000,
    modifiedTime: new Date(Date.now() - 3 * 86400000).toISOString(),
    iconLink: null,
    thumbnailLink: null,
    webViewLink: null,
    parents: ['folder-pelicula'],
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const folderId = searchParams.get('folderId') || 'root';

  if (isDevMode()) {
    const files = MOCK_FILES.filter((f) => f.parents.includes(folderId));
    // Sort: folders first, then by name
    files.sort((a, b) => {
      const aIsFolder = a.mimeType === 'application/vnd.google-apps.folder' ? 0 : 1;
      const bIsFolder = b.mimeType === 'application/vnd.google-apps.folder' ? 0 : 1;
      if (aIsFolder !== bIsFolder) return aIsFolder - bIsFolder;
      return a.name.localeCompare(b.name);
    });
    return NextResponse.json({ files, folderId });
  }

  // Production: Use Google Drive API
  // This requires GOOGLE_SERVICE_ACCOUNT_KEY env var
  return NextResponse.json({ error: 'Google Drive not configured' }, { status: 501 });
}
