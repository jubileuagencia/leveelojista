'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  FileEdit,
  AlertTriangle,
  Palette,
  FileText,
  Video,
  Code2,
  BarChart3,
  Package,
} from 'lucide-react';
import type { Deliverable, DeliverableStatus, DeliverableType } from '@/types';
import { DELIVERABLE_STATUS_LABELS, DELIVERABLE_TYPE_LABELS } from '@/types';

const STATUS_CONFIG: Record<DeliverableStatus, { icon: typeof CheckCircle2; color: string; badgeClass: string }> = {
  draft: { icon: FileEdit, color: 'text-muted-foreground', badgeClass: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400' },
  pending_review: { icon: Clock, color: 'text-amber-500', badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  approved: { icon: CheckCircle2, color: 'text-green-500', badgeClass: 'bg-green-500/10 text-green-700 dark:text-green-400' },
  revision_requested: { icon: AlertTriangle, color: 'text-red-500', badgeClass: 'bg-red-500/10 text-red-700 dark:text-red-400' },
};

const TYPE_ICONS: Record<DeliverableType, typeof Palette> = {
  design: Palette,
  copy: FileText,
  video: Video,
  development: Code2,
  report: BarChart3,
  other: Package,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min atras`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atras`;
  const days = Math.floor(hours / 24);
  return `${days}d atras`;
}

interface DeliverableCardProps {
  deliverable: Deliverable;
  onClick?: () => void;
  showClient?: boolean;
}

export function DeliverableCard({ deliverable, onClick, showClient = false }: DeliverableCardProps) {
  const statusConf = STATUS_CONFIG[deliverable.status];
  const StatusIcon = statusConf.icon;
  const TypeIcon = TYPE_ICONS[deliverable.type];

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/30 ${
        deliverable.status === 'pending_review' ? 'border-amber-500/30' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <TypeIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{deliverable.title}</h3>
            </div>
            {deliverable.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {deliverable.description}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className={statusConf.badgeClass}>
                <StatusIcon className="mr-1 size-3" />
                {DELIVERABLE_STATUS_LABELS[deliverable.status]}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {DELIVERABLE_TYPE_LABELS[deliverable.type]}
              </Badge>
              {showClient && deliverable.clients && (
                <span className="text-xs text-muted-foreground">
                  {deliverable.clients.name}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              {deliverable.profiles && (
                <span>por {deliverable.profiles.full_name}</span>
              )}
              {deliverable.due_date && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {new Date(deliverable.due_date).toLocaleDateString('pt-BR')}
                </span>
              )}
              <span>{timeAgo(deliverable.updated_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
