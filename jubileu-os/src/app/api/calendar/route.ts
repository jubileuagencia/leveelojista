import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
}

const MOCK_EVENTS = [
  {
    id: 'evt-001',
    user_id: 'dev-user-001',
    title: 'Reuniao de Kickoff — Levee',
    description: 'Primeira reuniao com novo cliente.',
    start_date: new Date(Date.now() + 1 * 86400000).toISOString(),
    end_date: new Date(Date.now() + 1 * 86400000 + 3600000).toISOString(),
    all_day: false,
    color: '#3b82f6',
    source: 'manual' as const,
    source_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'evt-002',
    user_id: 'dev-user-001',
    title: 'Entrega Pack Instagram — Pelicula',
    description: null,
    start_date: new Date(Date.now() + 2 * 86400000).toISOString(),
    end_date: null,
    all_day: true,
    color: '#f59e0b',
    source: 'deliverable' as const,
    source_id: 'del-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'evt-003',
    user_id: 'dev-user-001',
    title: 'Publicar Reels Semanal',
    description: 'Publicacao programada do reels de conteudo semanal.',
    start_date: new Date(Date.now() + 3 * 86400000).toISOString(),
    end_date: null,
    all_day: false,
    color: '#ec4899',
    source: 'task' as const,
    source_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'evt-004',
    user_id: 'dev-user-001',
    title: 'Relatorio Mensal',
    description: 'Compilar e enviar relatorio mensal para todos os clientes.',
    start_date: new Date(Date.now() + 5 * 86400000).toISOString(),
    end_date: null,
    all_day: true,
    color: '#8b5cf6',
    source: 'manual' as const,
    source_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'evt-005',
    user_id: 'dev-user-001',
    title: 'Call semanal equipe',
    description: 'Alinhamento semanal com toda a equipe.',
    start_date: new Date(Date.now() + 4 * 86400000).toISOString(),
    end_date: new Date(Date.now() + 4 * 86400000 + 1800000).toISOString(),
    all_day: false,
    color: '#10b981',
    source: 'manual' as const,
    source_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (isDevMode()) {
    let events = MOCK_EVENTS;
    if (from) events = events.filter((e) => new Date(e.start_date) >= new Date(from));
    if (to) events = events.filter((e) => new Date(e.start_date) <= new Date(to));
    return NextResponse.json(events);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let query = supabase
    .from('calendar_events')
    .select('*')
    .order('start_date', { ascending: true });

  if (from) query = query.gte('start_date', from);
  if (to) query = query.lte('start_date', to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (isDevMode()) {
    return NextResponse.json({
      id: `evt-${Date.now()}`,
      user_id: 'dev-user-001',
      ...body,
      source: body.source || 'manual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { status: 201 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description, start_date, end_date, all_day, color } = body;
  if (!title || !start_date) {
    return NextResponse.json({ error: 'title and start_date are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('calendar_events')
    .insert({
      user_id: user.id,
      title,
      description: description || null,
      start_date,
      end_date: end_date || null,
      all_day: all_day ?? false,
      color: color || null,
      source: 'manual',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
