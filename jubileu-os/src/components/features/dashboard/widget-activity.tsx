'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { mockActivities } from './mock-data';
import { Activity } from 'lucide-react';

export function WidgetActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="size-4 text-blue-500" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockActivities.map((a) => (
          <div key={a.id} className="flex items-start gap-3">
            <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
              {a.user[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="font-medium">{a.user}</span>{' '}
                <span className="text-muted-foreground">{a.action}</span>{' '}
                <span className="font-medium">{a.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{a.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
