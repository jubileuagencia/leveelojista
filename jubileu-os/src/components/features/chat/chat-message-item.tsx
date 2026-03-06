'use client';

import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageItemProps {
  role: 'user' | 'assistant';
  content: string;
  agentIcon?: string;
}

export function ChatMessageItem({ role, content, agentIcon }: ChatMessageItemProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? (
          <User className="size-4" />
        ) : agentIcon ? (
          <span className="text-sm">{agentIcon}</span>
        ) : (
          <Bot className="size-4" />
        )}
      </div>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-3 py-2 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
}
