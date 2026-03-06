import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth';
import { Greeting } from '@/components/features/dashboard/greeting';
import { QuickActions } from '@/components/features/dashboard/quick-actions';
import { WidgetUrgentTasks } from '@/components/features/dashboard/widget-urgent-tasks';
import { WidgetActivity } from '@/components/features/dashboard/widget-activity';
import { WidgetCalendar } from '@/components/features/dashboard/widget-calendar';
import { DashboardSkeleton } from '@/components/features/dashboard/dashboard-skeleton';

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Greeting name={user.full_name} />
          <QuickActions />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <WidgetUrgentTasks />
          <WidgetActivity />
          <WidgetCalendar />
        </div>
      </div>
    </Suspense>
  );
}
