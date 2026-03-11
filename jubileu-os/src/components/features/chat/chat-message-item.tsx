'use client';

import { cn } from '@/lib/utils';
import { Markdown } from '@/components/ui/markdown';
import { Bot, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageItemProps {
  role: 'user' | 'assistant';
  content: string;
  agentIcon?: string;
}

export function ChatMessageItem({ role, content, agentIcon }: ChatMessageItemProps) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn('group flex gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
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

      {/* Message bubble */}
      <div className="max-w-[85%] min-w-0 relative">
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2.5 text-sm',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted rounded-tl-sm'
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <Markdown>{content}</Markdown>
          )}
        </div>

        {/* Copy button for assistant messages */}
        {!isUser && content && (
          <button
            onClick={handleCopy}
            className="absolute -bottom-6 left-2 flex items-center gap-1 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="size-3" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="size-3" />
                Copiar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
