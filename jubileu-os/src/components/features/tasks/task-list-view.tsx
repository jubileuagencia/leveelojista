'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getStatusColor, getPriorityInfo, formatDueDate, isDueOverdue } from './task-utils';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClickUpTask } from '@/lib/clickup/types';

interface TaskListViewProps {
  tasks: ClickUpTask[];
  loading: boolean;
  onTaskClick: (taskId: string) => void;
}

export function TaskListView({ tasks, loading, onTaskClick }: TaskListViewProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-muted-foreground">Nenhuma tarefa encontrada.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <div className="hidden grid-cols-[1fr_100px_40px_36px_70px] items-center gap-3 border-b px-4 py-2 text-xs font-medium text-muted-foreground md:grid">
        <span>Tarefa</span>
        <span>Status</span>
        <span>Pri</span>
        <span>Resp</span>
        <span>Prazo</span>
      </div>

      {tasks.map((task) => {
        const priority = getPriorityInfo(task.priority);
        const dueText = formatDueDate(task.due_date);
        const overdue = isDueOverdue(task.due_date);

        return (
          <div
            key={task.id}
            onClick={() => onTaskClick(task.id)}
            className="grid cursor-pointer grid-cols-1 items-center gap-2 border-b px-4 py-3 transition-colors last:border-0 hover:bg-muted/50 md:grid-cols-[1fr_100px_40px_36px_70px] md:gap-3"
          >
            <p className="truncate text-sm font-medium">{task.name}</p>

            <Badge
              variant="secondary"
              className="w-fit gap-1.5"
            >
              <span className={cn('size-2 rounded-full', getStatusColor(task.status.status))} />
              <span className="truncate text-xs">{task.status.status}</span>
            </Badge>

            <Flag className={cn('hidden size-3.5 md:block', priority.color)} />

            <div className="hidden md:block">
              {task.assignees[0] && (
                <Avatar className="size-6">
                  <AvatarFallback className="text-[9px]">
                    {task.assignees[0].initials}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {dueText && (
              <span className={cn('text-xs', overdue ? 'font-medium text-destructive' : 'text-muted-foreground')}>
                {dueText}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
