'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AGENT_CATEGORY_LABELS } from '@/lib/agents/config';
import type { AgentConfig } from '@/lib/agents/config';
import { MessageSquare } from 'lucide-react';

interface AgentCardProps {
  agent: AgentConfig;
  onClick?: (agent: AgentConfig) => void;
}

const categoryColors: Record<string, string> = {
  development: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  product: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  framework: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  design: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
  astrology: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
};

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
      onClick={() => onClick?.(agent)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl leading-none" role="img" aria-label={agent.name}>
            {agent.icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{agent.name}</h3>
              <span className="text-xs text-muted-foreground">@{agent.id}</span>
            </div>
            <p className="text-sm text-muted-foreground">{agent.title}</p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed line-clamp-2">
          {agent.whenToUse}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className={categoryColors[agent.category]}>
              {AGENT_CATEGORY_LABELS[agent.category]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {agent.commands.length} comandos
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/agents/${agent.id}/chat`);
            }}
          >
            <MessageSquare className="size-3.5" />
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
