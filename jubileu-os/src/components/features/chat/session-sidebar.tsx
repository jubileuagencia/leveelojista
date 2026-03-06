'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  title: string;
  updated_at: string;
}

interface SessionSidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function SessionSidebar({
  sessions,
  activeSessionId,
  onSelect,
  onNew,
  onDelete,
  loading,
}: SessionSidebarProps) {
  return (
    <div className="flex h-full flex-col border-r">
      <div className="p-3 border-b">
        <Button size="sm" className="w-full" onClick={onNew}>
          <Plus className="size-4" />
          Nova conversa
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground">
            Nenhuma conversa
          </div>
        ) : (
          <div className="space-y-0.5 p-1">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={cn(
                  'group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent',
                  activeSessionId === s.id && 'bg-accent'
                )}
                onClick={() => onSelect(s.id)}
              >
                <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(s.updated_at)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(s.id);
                  }}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
