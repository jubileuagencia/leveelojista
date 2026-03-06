'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { getMockCalendar } from './mock-data';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WidgetCalendar() {
  const days = getMockCalendar();

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
              key={day.date}
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
                      className="size-1.5 rounded-full bg-primary"
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
