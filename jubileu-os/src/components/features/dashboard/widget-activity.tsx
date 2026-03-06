'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useActivity } from '@/hooks/use-activity';
import { Activity } from 'lucide-react';

const ACTION_LABELS: Record<string, string> = {
  'task.created': 'criou tarefa',
  'task.updated': 'atualizou tarefa',
  'task.status_changed': 'mudou status de',
  'task.commented': 'comentou em',
  'document.viewed': 'visualizou',
  'document.created': 'criou documento',
  'document.edited': 'editou',
  'client.created': 'adicionou cliente',
  'client.updated': 'atualizou cliente',
  'workflow.started': 'iniciou workflow',
  'workflow.step_completed': 'completou step de',
  'workflow.completed': 'finalizou workflow',
  'agent.chat_started': 'iniciou chat com',
  'agent.chat_message': 'enviou mensagem para',
  'system.login': 'fez login',
  'system.logout': 'fez logout',
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min atras`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atras`;
  const days = Math.floor(hours / 24);
  return `${days}d atras`;
}

export function WidgetActivity() {
  const { data: activities, isLoading } = useActivity({ limit: 6 });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="size-4 text-blue-500" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="size-6 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))
        ) : !activities || activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma atividade registrada
          </p>
        ) : (
          activities.map((a) => {
            const userName = a.profiles?.full_name ?? 'Usuario';
            const actionLabel = ACTION_LABELS[a.action] ?? a.action;

            return (
              <div key={a.id} className="flex items-start gap-3">
                <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                  {userName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{userName}</span>{' '}
                    <span className="text-muted-foreground">{actionLabel}</span>
                    {a.entity_name && (
                      <>
                        {' '}
                        <span className="font-medium">{a.entity_name}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {timeAgo(a.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
