'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats } from '@/hooks/use-dashboard';
import { BarChart3 } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  'to do': 'bg-zinc-400',
  'a fazer': 'bg-zinc-400',
  'pendente': 'bg-zinc-400',
  'em progresso': 'bg-blue-500',
  'in progress': 'bg-blue-500',
  'em andamento': 'bg-blue-500',
  'em revisao': 'bg-amber-500',
  'review': 'bg-amber-500',
  'aprovado': 'bg-emerald-500',
  'concluido': 'bg-green-600',
  'complete': 'bg-green-600',
  'done': 'bg-green-600',
};

function getBarColor(status: string): string {
  const key = status.toLowerCase();
  return STATUS_COLORS[key] ?? 'bg-zinc-300';
}

export function WidgetStatusChart() {
  const { data: stats, isLoading } = useDashboardStats();

  const entries = Object.entries(stats?.tasksByStatus ?? {}).sort(
    ([, a], [, b]) => b - a
  );
  const maxCount = entries.length > 0 ? Math.max(...entries.map(([, v]) => v)) : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart3 className="size-4 text-blue-500" />
          Tarefas por Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full rounded-full" />
            </div>
          ))
        ) : entries.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Sem dados
          </p>
        ) : (
          entries.map(([status, count]) => (
            <div key={status} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="capitalize text-muted-foreground">{status}</span>
                <span className="font-medium">{count}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${getBarColor(status)}`}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
