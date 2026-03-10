'use client';

import { use, useRef, useEffect, useState } from 'react';
import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ChatMessageItem } from '@/components/features/chat/chat-message-item';
import { ChatInput } from '@/components/features/chat/chat-input';
import { SessionSidebar } from '@/components/features/chat/session-sidebar';
import {
  useChatSessions,
  useChatSession,
  useCreateChatSession,
  useUpdateChatSession,
  useDeleteChatSession,
} from '@/hooks/use-chat-sessions';
import type { ChatMessage } from '@/types';
import { getAgentById, getSkillById } from '@/lib/agents/config';
import {
  ArrowLeft,
  PanelLeftClose,
  PanelLeft,
  Bot,
  History,
} from 'lucide-react';

export default function AgentChatPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const agent = getAgentById(agentId);

  const skillId = searchParams.get('skill');
  const skillPrompt = searchParams.get('prompt');
  const skill = skillId ? getSkillById(skillId) : null;

  const [sidebarOpen, setSidebarOpen] = useState(false); // closed by default on mobile
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessions = [], isLoading: sessionsLoading } = useChatSessions(agentId);
  const { data: sessionData } = useChatSession(activeSessionId);
  const createSession = useCreateChatSession();
  const updateSession = useUpdateChatSession();
  const deleteSession = useDeleteChatSession();

  const {
    messages,
    sendMessage,
    status,
    setMessages,
    stop,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { agentId },
    }),
  });

  const isStreaming = status === 'streaming' || status === 'submitted';

  // Load messages from session when selected
  const loadedSessionRef = useRef<string | null>(null);
  useEffect(() => {
    if (
      sessionData?.messages &&
      sessionData.messages.length > 0 &&
      loadedSessionRef.current !== sessionData.id
    ) {
      loadedSessionRef.current = sessionData.id;
      const uiMessages = sessionData.messages.map((msg: ChatMessage) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        parts: [{ type: 'text' as const, text: msg.content }],
      }));
      // Defer to avoid synchronous setState in effect
      queueMicrotask(() => setMessages(uiMessages));
    }
  }, [sessionData, setMessages]);

  // Save messages to session when streaming finishes
  const prevStatusRef = useRef(status);
  useEffect(() => {
    const wasStreaming = prevStatusRef.current === 'streaming' || prevStatusRef.current === 'submitted';
    const nowReady = status === 'ready';
    prevStatusRef.current = status;

    if (wasStreaming && nowReady && activeSessionId && messages.length > 0) {
      const chatMessages: ChatMessage[] = messages.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.parts
          .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
          .map((p) => p.text)
          .join(''),
        timestamp: new Date().toISOString(),
      }));
      updateSession.mutate({ sessionId: activeSessionId, body: { messages: chatMessages } });
    }
  }, [status, activeSessionId, messages, updateSession]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-send skill prompt if present
  const autoSentRef = useRef(false);
  useEffect(() => {
    if (skillPrompt && !autoSentRef.current && messages.length === 0) {
      autoSentRef.current = true;
      sendMessage({ text: skillPrompt });
    }
  }, [skillPrompt, messages.length, sendMessage]);

  async function ensureSession(): Promise<string | null> {
    if (activeSessionId) return activeSessionId;
    try {
      const session = await createSession.mutateAsync({ agentId, title: 'Nova conversa' });
      setActiveSessionId(session.id);
      return session.id;
    } catch {
      return null;
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput('');
    await ensureSession();
    sendMessage({ text });
  }

  async function handleSuggestion(text: string) {
    if (isStreaming) return;
    await ensureSession();
    sendMessage({ text });
  }

  function handleNewSession() {
    setActiveSessionId(null);
    setMessages([]);
    setInput('');
    setMobileSheetOpen(false);
  }

  function handleSelectSession(id: string) {
    setActiveSessionId(id);
    setMessages([]);
    setInput('');
    setMobileSheetOpen(false);
  }

  function handleDeleteSession(id: string) {
    deleteSession.mutate(id);
    if (activeSessionId === id) {
      setActiveSessionId(null);
      setMessages([]);
    }
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Bot className="mb-3 size-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">Agente nao encontrado.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/agents')}>
          Voltar
        </Button>
      </div>
    );
  }

  const suggestions = agent.suggestions ?? [];

  return (
    <div className="flex h-[calc(100dvh-4rem)] -m-4 md:-m-6">
      {/* Desktop Session Sidebar */}
      <div
        className={`hidden lg:block shrink-0 transition-all duration-200 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <SessionSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelect={handleSelectSession}
          onNew={handleNewSession}
          onDelete={handleDeleteSession}
          loading={sessionsLoading}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 border-b px-3 py-2 shrink-0">
          {/* Back button */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => router.push('/agents')}
          >
            <ArrowLeft className="size-4" />
          </Button>

          {/* Agent info */}
          <span className="text-xl">{agent.icon}</span>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-sm truncate">
              {skill ? skill.name : agent.name}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {skill ? `via ${agent.name}` : agent.title}
            </p>
          </div>

          {/* Streaming indicator */}
          {isStreaming && (
            <span className="text-xs text-muted-foreground animate-pulse hidden sm:block">
              digitando...
            </span>
          )}

          {/* Desktop sidebar toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 hidden lg:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeft className="size-4" />
            )}
          </Button>

          {/* Mobile history sheet */}
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 lg:hidden">
                <History className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SessionSidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelect={handleSelectSession}
                onNew={handleNewSession}
                onDelete={handleDeleteSession}
                loading={sessionsLoading}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {messages.length === 0 && !skillPrompt && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <span className="text-5xl mb-4">{agent.icon}</span>
              <h3 className="text-lg font-semibold">{agent.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {agent.role}
              </p>

              {/* Suggestion chips */}
              {suggestions.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-lg">
                  {suggestions.map((text) => (
                    <button
                      key={text}
                      onClick={() => handleSuggestion(text)}
                      className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              role={msg.role as 'user' | 'assistant'}
              content={
                msg.parts
                  .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                  .map((p) => p.text)
                  .join('')
              }
              agentIcon={agent.icon}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSend}
            onStop={stop}
            isLoading={isStreaming}
            placeholder={skill ? `Fale com ${agent.name}...` : `Mensagem para ${agent.name}...`}
          />
        </div>
      </div>
    </div>
  );
}
