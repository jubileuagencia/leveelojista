'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockTasks } from './mock-data';
import { AlertTriangle, Circle } from 'lucide-react';

const priorityColors = {
  urgent: 'bg-red-500/10 text-red-500',
  high: 'bg-amber-500/10 text-amber-500',
  normal: 'bg-blue-500/10 text-blue-500',
  low: 'bg-zinc-500/10 text-zinc-400',
};

const statusColors = {
  todo: 'text-zinc-400',
  in_progress: 'text-blue-500',
  review: 'text-amber-500',
  done: 'text-green-500',
};

export function WidgetUrgentTasks() {
  const urgentTasks = mockTasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      const p = { urgent: 0, high: 1, normal: 2, low: 3 };
      return p[a.priority] - p[b.priority];
    })
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <AlertTriangle className="size-4 text-amber-500" />
          Tarefas Prioritarias
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {urgentTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
          >
            <Circle className={`size-3 shrink-0 fill-current ${statusColors[task.status]}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{task.name}</p>
              <p className="text-xs text-muted-foreground">
                {task.client} &middot; {task.assignee}
              </p>
            </div>
            <Badge variant="secondary" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
