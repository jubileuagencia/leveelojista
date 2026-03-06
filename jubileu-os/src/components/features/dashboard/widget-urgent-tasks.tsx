'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats } from '@/hooks/use-dashboard';
import { AlertTriangle, Circle } from 'lucide-react';

const priorityColors: Record<string, string> = {
  urgent: 'bg-red-500/10 text-red-500',
  high: 'bg-amber-500/10 text-amber-500',
  normal: 'bg-blue-500/10 text-blue-500',
  low: 'bg-zinc-500/10 text-zinc-400',
};

function statusDotColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('conclu') || s.includes('complete') || s.includes('done')) return 'text-green-500';
  if (s.includes('progress') || s.includes('andamento')) return 'text-blue-500';
  if (s.includes('revis') || s.includes('review')) return 'text-amber-500';
  return 'text-zinc-400';
}

function TaskSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="size-3 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
  );
}

export function WidgetUrgentTasks() {
  const { data: stats, isLoading } = useDashboardStats();

  // Sort by priority: urgent first, then high, etc.
  const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
  const tasks = stats?.recentTasks
    ?.slice()
    .sort((a, b) => {
      const pa = priorityOrder[a.priority ?? 'normal'] ?? 2;
      const pb = priorityOrder[b.priority ?? 'normal'] ?? 2;
      return pa - pb;
    })
    .slice(0, 6) ?? [];

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <AlertTriangle className="size-4 text-amber-500" />
          Tarefas Prioritarias
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <TaskSkeleton key={i} />)
        ) : tasks.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Nenhuma tarefa encontrada
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
            >
              <Circle
                className={`size-3 shrink-0 fill-current ${statusDotColor(task.status)}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{task.name}</p>
                <p className="text-xs text-muted-foreground">
                  {task.listName}
                  {task.assignee && <> &middot; {task.assignee}</>}
                </p>
              </div>
              {task.priority && (
                <Badge
                  variant="secondary"
                  className={priorityColors[task.priority] ?? priorityColors.normal}
                >
                  {task.priority}
                </Badge>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
