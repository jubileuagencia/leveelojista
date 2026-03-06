'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  useSlackChannels,
  useSlackMessages,
  useSendSlackMessage,
} from '@/hooks/use-messages';
import { Hash, Lock, Send, MessageSquare, User } from 'lucide-react';

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function MessagesPage() {
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: channelData, isLoading: channelsLoading } = useSlackChannels();
  const { data: messageData } = useSlackMessages(activeChannel);
  const sendMessage = useSendSlackMessage();

  const channels = channelData?.channels ?? [];
  const messages = messageData?.messages ?? [];
  const messagesLength = messages.length;
  const activeChannelData = channels.find((c) => c.id === activeChannel);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesLength]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim() || !activeChannel) return;
    sendMessage.mutate({ channelId: activeChannel, text: messageText.trim() });
    setMessageText('');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Mensagens</h1>
        <p className="text-sm text-muted-foreground">Slack da equipe.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-[280px_1fr] h-[calc(100vh-220px)]">
        {/* Channel List */}
        <Card className="overflow-auto">
          <CardContent className="p-2">
            {channelsLoading ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : (
              <div className="space-y-0.5">
                {channels.map((ch) => (
                  <button
                    key={ch.id}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
                      activeChannel === ch.id ? 'bg-accent font-medium' : ''
                    }`}
                    onClick={() => setActiveChannel(ch.id)}
                  >
                    {ch.is_private ? (
                      <Lock className="size-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <Hash className="size-3.5 text-muted-foreground shrink-0" />
                    )}
                    <span className="flex-1 truncate">{ch.name}</span>
                    {ch.unread_count > 0 && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] px-1.5 py-0">
                        {ch.unread_count}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="flex flex-col overflow-hidden">
          {!activeChannel ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <MessageSquare className="mb-3 size-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Selecione um canal para ver as mensagens.
              </p>
            </div>
          ) : (
            <>
              {/* Channel Header */}
              <div className="border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <Hash className="size-4 text-muted-foreground" />
                  <span className="font-medium">{activeChannelData?.name}</span>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{msg.user_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="border-t p-3">
                <div className="flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Mensagem em #${activeChannelData?.name ?? ''}`}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!messageText.trim() || sendMessage.isPending}>
                    <Send className="size-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
