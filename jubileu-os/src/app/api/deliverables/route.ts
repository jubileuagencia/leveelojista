import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { DeliverableStatus, DeliverableType } from '@/types';

const MOCK_DELIVERABLES = [
  {
    id: 'del-001',
    client_id: 'client-001',
    title: 'Pack de Posts Instagram — Março',
    description: '12 peças visuais para feed e stories do Instagram.',
    type: 'design' as DeliverableType,
    status: 'pending_review' as DeliverableStatus,
    file_url: null,
    preview_url: null,
    due_date: new Date(Date.now() + 2 * 86400000).toISOString(),
    submitted_at: new Date().toISOString(),
    reviewed_at: null,
    review_note: null,
    created_by: 'dev-user-001',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    clients: { name: 'Pelicula Sideral', slug: 'pelicula-sideral' },
    profiles: { full_name: 'Karol' },
  },
  {
    id: 'del-002',
    client_id: 'client-001',
    title: 'Copy para Landing Page Decifrando',
    description: 'Textos finais para a LP do curso Decifrando.',
    type: 'copy' as DeliverableType,
    status: 'approved' as DeliverableStatus,
    file_url: null,
    preview_url: null,
    due_date: new Date(Date.now() - 86400000).toISOString(),
    submitted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    reviewed_at: new Date(Date.now() - 86400000).toISOString(),
    review_note: 'Perfeito! Aprovado sem alteracoes.',
    created_by: 'dev-user-001',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    clients: { name: 'Pelicula Sideral', slug: 'pelicula-sideral' },
    profiles: { full_name: 'Gabriel' },
  },
  {
    id: 'del-003',
    client_id: 'client-002',
    title: 'Relatorio Mensal — Fevereiro',
    description: 'Relatorio de performance das redes sociais em fevereiro.',
    type: 'report' as DeliverableType,
    status: 'draft' as DeliverableStatus,
    file_url: null,
    preview_url: null,
    due_date: new Date(Date.now() + 5 * 86400000).toISOString(),
    submitted_at: null,
    reviewed_at: null,
    review_note: null,
    created_by: 'dev-user-001',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    clients: { name: 'Caracol Records', slug: 'caracol-records' },
    profiles: { full_name: 'Fernando (Dev)' },
  },
  {
    id: 'del-004',
    client_id: 'client-001',
    title: 'Video Reels — Tutorial Ascendente',
    description: 'Video curto para Reels ensinando a descobrir o ascendente.',
    type: 'video' as DeliverableType,
    status: 'revision_requested' as DeliverableStatus,
    file_url: null,
    preview_url: null,
    due_date: new Date(Date.now() + 1 * 86400000).toISOString(),
    submitted_at: new Date(Date.now() - 86400000).toISOString(),
    reviewed_at: new Date().toISOString(),
    review_note: 'Ajustar a intro — muito longa. E incluir legenda.',
    created_by: 'dev-user-001',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    clients: { name: 'Pelicula Sideral', slug: 'pelicula-sideral' },
    profiles: { full_name: 'Gabriel' },
  },
];

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const clientId = searchParams.get('clientId');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') ?? '50', 10);

  if (isDevMode()) {
    let filtered = MOCK_DELIVERABLES;
    if (clientId) filtered = filtered.filter((d) => d.client_id === clientId);
    if (status) filtered = filtered.filter((d) => d.status === status);
    return NextResponse.json(filtered.slice(0, limit));
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let query = supabase
    .from('deliverables')
    .select('*, clients(name, slug), profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (clientId) query = query.eq('client_id', clientId);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (isDevMode()) {
    const body = await request.json();
    return NextResponse.json({
      id: `del-${Date.now()}`,
      ...body,
      status: 'draft',
      created_by: 'dev-user-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { status: 201 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'member'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { client_id, title, description, type, file_url, preview_url, due_date } = body;

  if (!client_id || !title) {
    return NextResponse.json({ error: 'client_id and title are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('deliverables')
    .insert({
      client_id,
      title,
      description: description || null,
      type: type || 'other',
      status: 'draft',
      file_url: file_url || null,
      preview_url: preview_url || null,
      due_date: due_date || null,
      created_by: user.id,
    })
    .select('*, clients(name, slug), profiles(full_name)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
