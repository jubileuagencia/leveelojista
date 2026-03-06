import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, createUIMessageStreamResponse, createUIMessageStream } from 'ai';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAgentById } from '@/lib/agents/config';

function isAnthropicConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

function buildSystemPrompt(agentId: string): string {
  const agent = getAgentById(agentId);
  if (!agent) return 'Voce e um assistente util.';

  return [
    `Voce e ${agent.name} (${agent.icon}), ${agent.title}.`,
    `Seu papel: ${agent.role}.`,
    `Quando usar: ${agent.whenToUse}`,
    `Comandos disponiveis: ${agent.commands.map((c) => '*' + c).join(', ')}.`,
    'Responda sempre em portugues. Use markdown para formatacao.',
  ].join('\n');
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Dev mode bypass
  const isDevMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.in');

  if (!user && !isDevMode) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { messages, agentId } = await request.json();

  if (!agentId || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'agentId and messages required' }, { status: 400 });
  }

  const agent = getAgentById(agentId);
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  // Dev mode mock response
  if (!isAnthropicConfigured()) {
    const lastUserMsg = messages.findLast(
      (m: { role: string }) => m.role === 'user'
    );
    const lastText =
      lastUserMsg?.parts
        ?.filter((p: { type: string }) => p.type === 'text')
        .map((p: { text: string }) => p.text)
        .join('') ??
      lastUserMsg?.content ??
      '';

    const mockContent = [
      `${agent.icon} **${agent.name}** aqui! (modo dev — sem API key)`,
      '',
      `Recebi sua mensagem: "${String(lastText).slice(0, 100)}"`,
      '',
      `Como **${agent.title}**, eu posso ajudar com:`,
      ...agent.commands.slice(0, 5).map((c) => `- \`*${c}\``),
      '',
      '_Configure ANTHROPIC_API_KEY no .env para respostas reais._',
    ].join('\n');

    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        execute: async ({ writer }) => {
          writer.write({ type: 'text-delta', delta: mockContent, id: 'mock-msg' });
          writer.write({
            type: 'finish',
            finishReason: 'stop',
          });
        },
      }),
    });
  }

  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: buildSystemPrompt(agentId),
    messages,
    maxOutputTokens: 4096,
  });

  return result.toUIMessageStreamResponse();
}
