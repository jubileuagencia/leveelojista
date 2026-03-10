'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useActivity } from '@/hooks/use-activity';
import { useAppStore } from '@/stores/app-store';
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

const ENTITY_TYPE_LABELS: Record<string, string> = {
  task: 'Tarefa',
  document: 'Documento',
  client: 'Cliente',
  workflow: 'Workflow',
  agent: 'Agente',
  system: 'Sistema',
};

const ENTITY_TYPE_COLORS: Record<string, string> = {
  task: 'bg-green-500/10 text-green-700 dark:text-green-400',
  document: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  client: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  workflow: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  agent: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
  system: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
};

function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ActivityPage() {
  const [entityType, setEntityType] = useState<string>('_all');
  const { activeClientId } = useAppStore();
  const { data: activities, isLoading } = useActivity({
    limit: 50,
    entityType: entityType === '_all' ? undefined : entityType,
    clientId: activeClientId ?? undefined,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Atividade</h1>
        <Select value={entityType} onValueChange={setEntityType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtrar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Todos</SelectItem>
            {Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : !activities || activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Activity className="mb-3 size-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Nenhuma atividade encontrada.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((a) => {
            const userName = a.profiles?.full_name ?? 'Usuario';
            const actionLabel = ACTION_LABELS[a.action] ?? a.action;
            const typeLabel = ENTITY_TYPE_LABELS[a.entity_type] ?? a.entity_type;
            const typeColor = ENTITY_TYPE_COLORS[a.entity_type] ?? '';

            return (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-lg border px-4 py-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
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
                    {formatDateTime(a.created_at)}
                  </p>
                </div>
                <Badge variant="secondary" className={typeColor}>
                  {typeLabel}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
