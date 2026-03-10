'use client';

import { useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { useCalendarEvents } from '@/hooks/use-calendar';
import { useDashboardStats } from '@/hooks/use-dashboard';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarDay {
  date: number;
  dayOfWeek: string;
  fullDate: string;
  events: number;
  isToday: boolean;
  hasUrgent: boolean;
}

const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export function WidgetCalendar() {
  const today = new Date();
  const from = today.toISOString().split('T')[0];
  const toDate = new Date(today);
  toDate.setDate(today.getDate() + 6);
  const to = toDate.toISOString().split('T')[0];

  const { data: events } = useCalendarEvents({ from, to });
  const { data: stats } = useDashboardStats();

  const days = useMemo<CalendarDay[]>(() => {
    const result: CalendarDay[] = [];

    // Build event count map from calendar events
    const eventsByDate: Record<string, number> = {};
    const urgentByDate: Record<string, boolean> = {};

    // Count calendar events
    if (events) {
      for (const ev of events) {
        const dateKey = ev.start_date.split('T')[0];
        eventsByDate[dateKey] = (eventsByDate[dateKey] || 0) + 1;
      }
    }

    // Count ClickUp task due dates from dashboard stats
    if (stats?.recentTasks) {
      for (const task of stats.recentTasks) {
        if (task.dueDate) {
          const d = new Date(parseInt(task.dueDate, 10));
          const dateKey = d.toISOString().split('T')[0];
          eventsByDate[dateKey] = (eventsByDate[dateKey] || 0) + 1;
          if (task.priority === 'urgent' || task.priority === 'high') {
            urgentByDate[dateKey] = true;
          }
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateKey = d.toISOString().split('T')[0];

      result.push({
        date: d.getDate(),
        dayOfWeek: DAYS_PT[d.getDay()],
        fullDate: dateKey,
        events: eventsByDate[dateKey] || 0,
        isToday: i === 0,
        hasUrgent: !!urgentByDate[dateKey],
      });
    }

    return result;
  }, [events, stats, today.toDateString()]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Calendar className="size-4 text-green-500" />
          Proximos 7 Dias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div
              key={day.fullDate}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors',
                day.isToday && 'bg-primary/10 ring-1 ring-primary/30'
              )}
            >
              <span className="text-[10px] uppercase text-muted-foreground">
                {day.dayOfWeek}
              </span>
              <span
                className={cn(
                  'text-sm font-semibold',
                  day.isToday && 'text-primary'
                )}
              >
                {day.date}
              </span>
              {day.events > 0 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: Math.min(day.events, 3) }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'size-1.5 rounded-full',
                        day.hasUrgent ? 'bg-amber-500' : 'bg-primary'
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
