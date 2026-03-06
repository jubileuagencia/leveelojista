import { NextRequest, NextResponse } from 'next/server';

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
}

export interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  unread_count: number;
  last_message: string | null;
  last_message_at: string | null;
}

export interface SlackMessage {
  id: string;
  channel_id: string;
  user_name: string;
  user_avatar: string | null;
  text: string;
  timestamp: string;
}

const MOCK_CHANNELS: SlackChannel[] = [
  {
    id: 'ch-geral',
    name: 'geral',
    is_private: false,
    unread_count: 3,
    last_message: 'Fernando: Reuniao de alinhamento amanha 10h',
    last_message_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'ch-pelicula',
    name: 'pelicula-sideral',
    is_private: false,
    unread_count: 1,
    last_message: 'Karol: Artes do feed prontas pra revisao!',
    last_message_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'ch-dev',
    name: 'dev',
    is_private: false,
    unread_count: 0,
    last_message: 'Fernando: Deploy feito na Vercel',
    last_message_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'ch-levee',
    name: 'levee',
    is_private: false,
    unread_count: 5,
    last_message: 'Gabriel: Copy da bio pronta. Aprovam?',
    last_message_at: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: 'ch-random',
    name: 'random',
    is_private: false,
    unread_count: 0,
    last_message: 'Karol: Alguem viu o meme do eclipse? 😂',
    last_message_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

const MOCK_MESSAGES: Record<string, SlackMessage[]> = {
  'ch-geral': [
    { id: 'm1', channel_id: 'ch-geral', user_name: 'Fernando', user_avatar: null, text: 'Reuniao de alinhamento amanha 10h', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
    { id: 'm2', channel_id: 'ch-geral', user_name: 'Karol', user_avatar: null, text: 'Beleza, estarei la!', timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
    { id: 'm3', channel_id: 'ch-geral', user_name: 'Gabriel', user_avatar: null, text: 'Confirmado 👍', timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
    { id: 'm4', channel_id: 'ch-geral', user_name: 'Fernando', user_avatar: null, text: 'Pauta: revisao semanal + planejamento proximo sprint', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  ],
  'ch-pelicula': [
    { id: 'm5', channel_id: 'ch-pelicula', user_name: 'Karol', user_avatar: null, text: 'Artes do feed prontas pra revisao!', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'm6', channel_id: 'ch-pelicula', user_name: 'Fernando', user_avatar: null, text: 'Vou olhar agora', timestamp: new Date(Date.now() - 1.5 * 3600000).toISOString() },
    { id: 'm7', channel_id: 'ch-pelicula', user_name: 'Fernando', user_avatar: null, text: 'Arte 3 precisa ajustar a paleta de cores. As outras estao otimas.', timestamp: new Date(Date.now() - 1.2 * 3600000).toISOString() },
  ],
  'ch-dev': [
    { id: 'm8', channel_id: 'ch-dev', user_name: 'Fernando', user_avatar: null, text: 'Deploy feito na Vercel', timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: 'm9', channel_id: 'ch-dev', user_name: 'Fernando', user_avatar: null, text: 'Todas as rotas funcionando. Zero erros no build.', timestamp: new Date(Date.now() - 4.5 * 3600000).toISOString() },
  ],
  'ch-levee': [
    { id: 'm10', channel_id: 'ch-levee', user_name: 'Gabriel', user_avatar: null, text: 'Copy da bio pronta. Aprovam?', timestamp: new Date(Date.now() - 1 * 3600000).toISOString() },
    { id: 'm11', channel_id: 'ch-levee', user_name: 'Gabriel', user_avatar: null, text: '"Levee — Conectando artistas independentes ao mundo. Musica, arte e comunidade."', timestamp: new Date(Date.now() - 55 * 60000).toISOString() },
  ],
  'ch-random': [
    { id: 'm12', channel_id: 'ch-random', user_name: 'Karol', user_avatar: null, text: 'Alguem viu o meme do eclipse? 😂', timestamp: new Date(Date.now() - 24 * 3600000).toISOString() },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const channelId = searchParams.get('channelId');

  if (isDevMode()) {
    if (channelId) {
      const messages = MOCK_MESSAGES[channelId] ?? [];
      return NextResponse.json({ messages });
    }
    return NextResponse.json({ channels: MOCK_CHANNELS });
  }

  return NextResponse.json({ error: 'Slack not configured' }, { status: 501 });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (isDevMode()) {
    return NextResponse.json({
      id: `msg-${Date.now()}`,
      channel_id: body.channelId,
      user_name: 'Fernando (Dev)',
      user_avatar: null,
      text: body.text,
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  }

  return NextResponse.json({ error: 'Slack not configured' }, { status: 501 });
}
