import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth';
import { Greeting } from '@/components/features/dashboard/greeting';
import { QuickActions } from '@/components/features/dashboard/quick-actions';
import { MetricCards } from '@/components/features/dashboard/metric-cards';
import { WidgetUrgentTasks } from '@/components/features/dashboard/widget-urgent-tasks';
import { WidgetStatusChart } from '@/components/features/dashboard/widget-status-chart';
import { WidgetActivity } from '@/components/features/dashboard/widget-activity';
import { WidgetCalendar } from '@/components/features/dashboard/widget-calendar';
import { DashboardSkeleton } from '@/components/features/dashboard/dashboard-skeleton';

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Greeting name={user.full_name} />
          <QuickActions />
        </div>

        {/* KPI Metric Cards */}
        <MetricCards />

        {/* Main Widgets */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <WidgetUrgentTasks />
          <WidgetStatusChart />
        </div>

        {/* Secondary Widgets */}
        <div className="grid gap-4 md:grid-cols-2">
          <WidgetActivity />
          <WidgetCalendar />
        </div>
      </div>
    </Suspense>
  );
}
