'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { AGENT_CATEGORY_LABELS, AGENT_CATEGORY_COLORS } from '@/lib/agents/config';
import type { AgentConfig } from '@/lib/agents/config';
import { MessageSquare } from 'lucide-react';

interface AgentCardProps {
  agent: AgentConfig;
}

export function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/agents/${agent.id}/chat`)}
      className="flex flex-col items-start gap-3 rounded-xl border bg-card p-4 text-left transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.98] w-full"
    >
      {/* Top row: icon + name + chat indicator */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-3xl leading-none" role="img" aria-label={agent.name}>
          {agent.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{agent.name}</h3>
            <span className="text-xs text-muted-foreground">@{agent.id}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{agent.title}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <MessageSquare className="size-3.5" />
          <span className="hidden sm:inline">Chat</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {agent.whenToUse}
      </p>

      {/* Footer: category + commands count */}
      <div className="flex items-center gap-2 w-full">
        <Badge
          variant="outline"
          className={AGENT_CATEGORY_COLORS[agent.category]}
        >
          {AGENT_CATEGORY_LABELS[agent.category]}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {agent.commands.length} comandos
        </span>
      </div>
    </button>
  );
}
