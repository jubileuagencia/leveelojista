'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats } from '@/hooks/use-dashboard';
import {
  ListTodo,
  CheckCircle2,
  Users,
  AlertTriangle,
} from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
}

function MetricCard({ label, value, icon, accent }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <Skeleton className="size-10 rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="h-7 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricCards() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Tarefas Ativas"
        value={stats.activeTasks}
        icon={<ListTodo className="size-5 text-blue-600" />}
        accent="bg-blue-500/10"
      />
      <MetricCard
        label="Concluidas esta Semana"
        value={stats.completedThisWeek}
        icon={<CheckCircle2 className="size-5 text-green-600" />}
        accent="bg-green-500/10"
      />
      <MetricCard
        label="Clientes Ativos"
        value={stats.activeClients}
        icon={<Users className="size-5 text-violet-600" />}
        accent="bg-violet-500/10"
      />
      <MetricCard
        label="Urgentes / Alta"
        value={stats.urgentTasks}
        icon={<AlertTriangle className="size-5 text-amber-600" />}
        accent="bg-amber-500/10"
      />
    </div>
  );
}
