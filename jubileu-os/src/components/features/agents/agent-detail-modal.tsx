'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AGENT_CATEGORY_LABELS } from '@/lib/agents/config';
import type { AgentConfig } from '@/lib/agents/config';
import { MessageSquare } from 'lucide-react';

interface AgentDetailModalProps {
  agent: AgentConfig | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentDetailModal({ agent, open, onOpenChange }: AgentDetailModalProps) {
  const router = useRouter();

  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{agent.icon}</span>
            <div>
              <div className="text-lg">{agent.name}</div>
              <div className="text-sm font-normal text-muted-foreground">
                @{agent.id}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Titulo</h4>
            <p className="mt-1">{agent.title}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Papel</h4>
            <p className="mt-1 text-sm">{agent.role}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Quando usar</h4>
            <p className="mt-1 text-sm">{agent.whenToUse}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Categoria</h4>
            <Badge variant="secondary" className="mt-1">
              {AGENT_CATEGORY_LABELS[agent.category]}
            </Badge>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Comandos ({agent.commands.length})
            </h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {agent.commands.map((cmd) => (
                <code
                  key={cmd}
                  className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono"
                >
                  *{cmd}
                </code>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              onOpenChange(false);
              router.push(`/agents/${agent.id}/chat`);
            }}
          >
            <MessageSquare className="size-4" />
            Iniciar Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
