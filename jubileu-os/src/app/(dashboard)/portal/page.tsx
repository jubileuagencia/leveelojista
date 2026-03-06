'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDeliverables } from '@/hooks/use-deliverables';
import { useActivity } from '@/hooks/use-activity';
import { DeliverableCard } from '@/components/features/deliverables/deliverable-card';
import { DeliverableReviewDialog } from '@/components/features/deliverables/deliverable-review-dialog';
import { DELIVERABLE_STATUS_LABELS } from '@/types';
import type { Deliverable } from '@/types';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const STATUS_METRICS = [
  { key: 'pending_review' as const, icon: Clock, color: 'text-amber-500' },
  { key: 'approved' as const, icon: CheckCircle2, color: 'text-green-500' },
  { key: 'revision_requested' as const, icon: AlertTriangle, color: 'text-red-500' },
];

const ACTION_LABELS: Record<string, string> = {
  'task.created': 'Nova tarefa criada',
  'task.updated': 'Tarefa atualizada',
  'task.status_changed': 'Status alterado',
  'document.created': 'Documento criado',
  'document.edited': 'Documento editado',
  'workflow.started': 'Workflow iniciado',
  'workflow.completed': 'Workflow concluido',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function PortalPage() {
  const { data: deliverables = [], isLoading } = useDeliverables();
  const { data: activities = [] } = useActivity({ limit: 5 });
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);

  const pendingReview = deliverables.filter((d) => d.status === 'pending_review');
  const counts: Record<string, number> = {
    pending_review: deliverables.filter((d) => d.status === 'pending_review').length,
    approved: deliverables.filter((d) => d.status === 'approved').length,
    revision_requested: deliverables.filter((d) => d.status === 'revision_requested').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Portal do Cliente</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe suas entregas e aprove materiais.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {STATUS_METRICS.map(({ key, icon: Icon, color }) => (
          <Card key={key}>
            <CardContent className="flex items-center gap-3 p-4">
              <Icon className={`size-8 ${color}`} />
              <div>
                <p className="text-2xl font-bold">{counts[key]}</p>
                <p className="text-xs text-muted-foreground">
                  {DELIVERABLE_STATUS_LABELS[key]}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCheck className="size-4" />
            Aguardando sua Aprovacao
            {pendingReview.length > 0 && (
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                {pendingReview.length}
              </Badge>
            )}
          </CardTitle>
          <Link href="/portal/deliverables">
            <Button variant="ghost" size="sm">
              Ver todas
              <ArrowRight className="ml-1 size-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : pendingReview.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Inbox className="mb-2 size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Nenhuma entrega aguardando aprovacao.
              </p>
            </div>
          ) : (
            pendingReview.slice(0, 5).map((d) => (
              <DeliverableCard
                key={d.id}
                deliverable={d}
                onClick={() => setSelectedDeliverable(d)}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma atividade recente.</p>
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="flex items-center gap-3 text-sm">
                  <div className="size-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span>{ACTION_LABELS[act.action] ?? act.action}</span>
                    {act.entity_name && (
                      <span className="ml-1 text-muted-foreground">— {act.entity_name}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {timeAgo(act.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DeliverableReviewDialog
        deliverable={selectedDeliverable}
        open={!!selectedDeliverable}
        onOpenChange={(open) => !open && setSelectedDeliverable(null)}
        isClient
      />
    </div>
  );
}
