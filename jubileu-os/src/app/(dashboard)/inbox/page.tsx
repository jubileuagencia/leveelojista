'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInbox, useMarkNotificationRead, useMarkAllRead } from '@/hooks/use-inbox';
import type { Notification } from '@/types';
import {
  Bell,
  CheckSquare,
  FileText,
  FileCheck,
  Zap,
  Calendar,
  Settings,
  CheckCheck,
  Inbox,
} from 'lucide-react';
import Link from 'next/link';

const MODULE_ICONS: Record<string, typeof Bell> = {
  task: CheckSquare,
  document: FileText,
  deliverable: FileCheck,
  workflow: Zap,
  calendar: Calendar,
  system: Settings,
};

const MODULE_COLORS: Record<string, string> = {
  task: 'text-blue-500',
  document: 'text-purple-500',
  deliverable: 'text-amber-500',
  workflow: 'text-green-500',
  calendar: 'text-pink-500',
  system: 'text-muted-foreground',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function InboxPage() {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const { data: notifications = [], isLoading } = useInbox({ unread: showUnreadOnly ? true : undefined });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  function handleClick(notification: Notification) {
    if (!notification.is_read) {
      markRead.mutate(notification.id);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Inbox</h1>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {unreadCount} nova{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Notificacoes de todos os modulos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={showUnreadOnly ? 'default' : 'outline'}
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          >
            Nao lidas
          </Button>
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="size-4" />
              Marcar todas
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="mb-3 size-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            {showUnreadOnly ? 'Nenhuma notificacao nao lida.' : 'Inbox vazio.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const ModuleIcon = MODULE_ICONS[n.module] ?? Bell;
            const color = MODULE_COLORS[n.module] ?? 'text-muted-foreground';

            const content = (
              <Card
                key={n.id}
                className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                  !n.is_read ? 'border-primary/20 bg-primary/[0.02]' : 'opacity-75'
                }`}
                onClick={() => handleClick(n)}
              >
                <CardContent className="flex items-start gap-3 p-3">
                  <div className="mt-0.5 shrink-0">
                    <ModuleIcon className={`size-5 ${color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!n.is_read ? 'font-medium' : ''}`}>
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <div className="size-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    {n.body && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {n.body}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {timeAgo(n.created_at)}
                  </span>
                </CardContent>
              </Card>
            );

            return n.action_url ? (
              <Link key={n.id} href={n.action_url}>
                {content}
              </Link>
            ) : (
              <div key={n.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
