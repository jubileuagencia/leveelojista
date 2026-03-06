'use client';

import { use, useRef, useEffect, useState } from 'react';
import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChatMessageItem } from '@/components/features/chat/chat-message-item';
import { ChatInput } from '@/components/features/chat/chat-input';
import { SessionSidebar } from '@/components/features/chat/session-sidebar';
import { useChatSessions, useDeleteChatSession } from '@/hooks/use-chat-sessions';
import { getAgentById } from '@/lib/agents/config';
import { ArrowLeft, PanelLeftClose, PanelLeft, Bot } from 'lucide-react';

export default function AgentChatPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = use(params);
  const router = useRouter();
  const agent = getAgentById(agentId);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessions = [], isLoading: sessionsLoading } = useChatSessions(agentId);
  const deleteSession = useDeleteChatSession();

  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { agentId },
    }),
  });

  const isStreaming = status === 'streaming' || status === 'submitted';

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput('');
    sendMessage({ text });
  }

  function handleNewSession() {
    setActiveSessionId(null);
    setMessages([]);
    setInput('');
  }

  function handleSelectSession(id: string) {
    setActiveSessionId(id);
    setMessages([]);
    setInput('');
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

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-4 sm:-m-6">
      {/* Session Sidebar */}
      {sidebarOpen && (
        <div className="w-64 shrink-0">
          <SessionSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelect={handleSelectSession}
            onNew={handleNewSession}
            onDelete={handleDeleteSession}
            loading={sessionsLoading}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-4 py-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeft className="size-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => router.push('/agents')}
          >
            <ArrowLeft className="size-4" />
          </Button>

          <span className="text-xl">{agent.icon}</span>
          <div className="min-w-0">
            <h2 className="font-semibold truncate">{agent.name}</h2>
            <p className="text-xs text-muted-foreground truncate">{agent.title}</p>
          </div>

          {isStreaming && (
            <span className="ml-auto text-xs text-muted-foreground animate-pulse">
              digitando...
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-5xl mb-4">{agent.icon}</span>
              <h3 className="text-lg font-semibold">{agent.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {agent.role}
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Envie uma mensagem para comecar a conversa
              </p>
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
        <div className="border-t px-4 py-3">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSend}
            isLoading={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}
