'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getPriorityInfo, formatDueDate, isDueOverdue } from './task-utils';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClickUpTask, ClickUpStatus } from '@/lib/clickup/types';

interface TaskKanbanViewProps {
  tasks: ClickUpTask[];
  statuses: ClickUpStatus[];
  loading: boolean;
  onTaskClick: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
}

export function TaskKanbanView({
  tasks,
  statuses,
  loading,
  onTaskClick,
  onStatusChange,
}: TaskKanbanViewProps) {
  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="min-w-[280px] space-y-3 rounded-lg border bg-muted/30 p-3">
            <Skeleton className="h-4 w-24" />
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const columns = statuses
    .filter((s) => s.type !== 'closed')
    .sort((a, b) => a.orderindex - b.orderindex);

  const tasksByStatus = new Map<string, ClickUpTask[]>();
  columns.forEach((col) => {
    tasksByStatus.set(
      col.status.toLowerCase(),
      tasks.filter((t) => t.status.status.toLowerCase() === col.status.toLowerCase())
    );
  });

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 pb-4" style={{ minWidth: columns.length * 296 }}>
        {columns.map((col) => {
          const columnTasks = tasksByStatus.get(col.status.toLowerCase()) || [];
          return (
            <div
              key={col.status}
              className="min-w-[280px] flex-1 rounded-lg border bg-muted/20 p-2"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const taskId = e.dataTransfer.getData('taskId');
                if (taskId) onStatusChange(taskId, col.status);
              }}
            >
              <div className="mb-3 flex items-center gap-2 px-1">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <span className="text-sm font-medium capitalize">{col.status}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-2">
                {columnTasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

function KanbanCard({
  task,
  onClick,
}: {
  task: ClickUpTask;
  onClick: () => void;
}) {
  const priority = getPriorityInfo(task.priority);
  const dueText = formatDueDate(task.due_date);
  const overdue = isDueOverdue(task.due_date);

  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
      onClick={onClick}
      className="cursor-pointer rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <p className="mb-2 text-sm font-medium leading-snug">{task.name}</p>

      <div className="flex items-center gap-2">
        <Flag className={cn('size-3', priority.color)} />

        {task.tags.slice(0, 2).map((tag) => (
          <Badge key={tag.name} variant="outline" className="text-[10px] px-1.5 py-0">
            {tag.name}
          </Badge>
        ))}

        <div className="ml-auto flex items-center gap-1.5">
          {dueText && (
            <span className={cn('text-[10px]', overdue ? 'text-destructive' : 'text-muted-foreground')}>
              {dueText}
            </span>
          )}
          {task.assignees[0] && (
            <Avatar className="size-5">
              <AvatarFallback className="text-[8px]">
                {task.assignees[0].initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
}
