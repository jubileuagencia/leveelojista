'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTasks } from '@/hooks/use-clickup';
import { getPriorityInfo, formatDueDate, isDueOverdue } from '@/components/features/tasks/task-utils';
import { Flag, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Client } from '@/types';

// All workspace list IDs to search across
const LIST_IDS = [
  '901325668059', // Gestao de Campanhas
  '901325668055', // Publicacao
  '901325668052', // Planejamento
  '901325668054', // Design/Audiovisual
  '901325668053', // Redacao/Copy
  '901325668065', // Lab IA
];

interface ClientTasksWidgetProps {
  client: Client;
  compact?: boolean;
}

export function ClientTasksWidget({ client, compact = false }: ClientTasksWidgetProps) {
  // Use the first list as primary, filter by tag
  const { data, isLoading } = useTasks(LIST_IDS[0], {
    tags: client.clickup_tag ? [client.clickup_tag] : undefined,
  });

  const tasks = data?.tasks ?? [];
  const displayTasks = compact ? tasks.slice(0, 5) : tasks;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <h3 className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <CheckSquare className="size-3.5" />
          Tarefas
        </h3>
        {Array.from({ length: compact ? 3 : 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <CheckSquare className="size-3.5" />
        Tarefas {tasks.length > 0 && `(${tasks.length})`}
      </h3>

      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {client.clickup_tag
            ? `Nenhuma tarefa com tag "${client.clickup_tag}".`
            : 'Configure a tag ClickUp para ver tarefas.'}
        </p>
      ) : (
        <div className="space-y-1.5">
          {displayTasks.map((task) => {
            const priority = getPriorityInfo(task.priority);
            const dueText = formatDueDate(task.due_date);
            const overdue = isDueOverdue(task.due_date);

            return (
              <div key={task.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50">
                <Flag className={cn('size-3 shrink-0', priority.color)} />
                <span className="min-w-0 flex-1 truncate text-sm">{task.name}</span>
                {dueText && (
                  <span className={cn('shrink-0 text-[10px]', overdue ? 'text-destructive' : 'text-muted-foreground')}>
                    {dueText}
                  </span>
                )}
                <Badge variant="outline" className="shrink-0 text-[10px] px-1.5 py-0">
                  {task.status.status}
                </Badge>
              </div>
            );
          })}
          {compact && tasks.length > 5 && (
            <p className="text-xs text-muted-foreground pl-2">
              +{tasks.length - 5} mais
            </p>
          )}
        </div>
      )}
    </div>
  );
}
