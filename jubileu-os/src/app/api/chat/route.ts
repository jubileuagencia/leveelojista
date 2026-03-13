import { createOpenAI } from '@ai-sdk/openai';
import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  createUIMessageStream,
} from 'ai';
import type { UIMessage } from 'ai';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAgentById } from '@/lib/agents/config';

function isLLMConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
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

function createErrorStream(message: string) {
  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: async ({ writer }) => {
        const id = `error-${Date.now()}`;
        writer.write({ type: 'text-start', id });
        writer.write({ type: 'text-delta', id, delta: message });
        writer.write({ type: 'text-end', id });
      },
    }),
  });
}

// Use OpenAI-compatible provider pointing to OpenRouter API
function getOpenRouterProvider() {
  return createOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY?.trim(),
    baseURL: 'https://openrouter.ai/api/v1',
    headers: {
      'X-Title': 'Jubileu OS',
      'HTTP-Referer':
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  });
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !isDevMode()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages: rawMessages, agentId, model: requestedModel } = await request.json();

    if (!agentId || !Array.isArray(rawMessages)) {
      return NextResponse.json(
        { error: 'agentId and messages required' },
        { status: 400 },
      );
    }

    const messages = await convertToModelMessages(rawMessages as UIMessage[]);

    const agent = getAgentById(agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    console.log('[chat] agent=%s, devMode=%s, llmConfigured=%s, user=%s',
      agentId, isDevMode(), isLLMConfigured(), user?.id ?? 'none');

    if (!isLLMConfigured()) {
      const lastUserMsg = rawMessages.findLast(
        (m: { role: string }) => m.role === 'user',
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
        '_Configure OPENROUTER\\_API\\_KEY no .env para respostas reais._',
      ].join('\n');

      return createErrorStream(mockContent);
    }

    const openrouter = getOpenRouterProvider();
    const modelId = (
      requestedModel ||
      process.env.DEFAULT_MODEL ||
      'anthropic/claude-sonnet-4.5'
    ).trim();

    try {
      console.log('[chat] calling OpenRouter model=%s', modelId);
      const result = streamText({
        model: openrouter(modelId),
        system: buildSystemPrompt(agentId),
        messages,
        maxOutputTokens: 4096,
        onError: ({ error }) => {
          console.error('[chat] stream error:', error);
        },
      });

      return result.toUIMessageStreamResponse();
    } catch (llmError) {
      console.error('[chat] LLM error:', llmError);
      const errorMsg =
        llmError instanceof Error ? llmError.message : 'Erro desconhecido';
      return createErrorStream(
        `**Erro ao chamar o modelo** (\`${modelId}\`):\n\n\`${errorMsg}\`\n\n_Verifique a API key e o modelo configurado._`,
      );
    }
  } catch (error) {
    console.error('[chat] Unhandled error:', error);
    return createErrorStream(
      '**Erro interno do servidor.** Tente novamente em alguns segundos.',
    );
  }
}
