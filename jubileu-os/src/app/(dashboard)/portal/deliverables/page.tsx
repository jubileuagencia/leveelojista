'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDeliverables } from '@/hooks/use-deliverables';
import { DeliverableCard } from '@/components/features/deliverables/deliverable-card';
import { DeliverableReviewDialog } from '@/components/features/deliverables/deliverable-review-dialog';
import { DELIVERABLE_STATUS_LABELS } from '@/types';
import type { Deliverable, DeliverableStatus } from '@/types';
import { Inbox } from 'lucide-react';

const statusFilters: (DeliverableStatus | 'all')[] = [
  'all',
  'pending_review',
  'approved',
  'revision_requested',
  'draft',
];

export default function PortalDeliverablesPage() {
  const { data: deliverables = [], isLoading } = useDeliverables();
  const [activeFilter, setActiveFilter] = useState<DeliverableStatus | 'all'>('all');
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);

  const filtered =
    activeFilter === 'all'
      ? deliverables
      : deliverables.filter((d) => d.status === activeFilter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Entregas</h1>
        <p className="text-sm text-muted-foreground">
          {deliverables.length} entrega{deliverables.length !== 1 ? 's' : ''} no total
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {statusFilters.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={activeFilter === status ? 'default' : 'outline'}
            onClick={() => setActiveFilter(status)}
          >
            {status === 'all' ? 'Todas' : DELIVERABLE_STATUS_LABELS[status]}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="mb-3 size-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Nenhuma entrega encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <DeliverableCard
              key={d.id}
              deliverable={d}
              onClick={() => setSelectedDeliverable(d)}
              showClient
            />
          ))}
        </div>
      )}

      <DeliverableReviewDialog
        deliverable={selectedDeliverable}
        open={!!selectedDeliverable}
        onOpenChange={(open) => !open && setSelectedDeliverable(null)}
        isClient
      />
    </div>
  );
}
