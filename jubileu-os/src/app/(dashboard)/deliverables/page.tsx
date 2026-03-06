'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDeliverables } from '@/hooks/use-deliverables';
import { useClients } from '@/hooks/use-clients';
import { DeliverableCard } from '@/components/features/deliverables/deliverable-card';
import { DeliverableReviewDialog } from '@/components/features/deliverables/deliverable-review-dialog';
import { CreateDeliverableDialog } from '@/components/features/deliverables/create-deliverable-dialog';
import { DELIVERABLE_STATUS_LABELS } from '@/types';
import type { Deliverable, DeliverableStatus } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Inbox, Plus } from 'lucide-react';

const statusFilters: (DeliverableStatus | 'all')[] = [
  'all',
  'pending_review',
  'revision_requested',
  'draft',
  'approved',
];

export default function DeliverablesPage() {
  const [activeStatus, setActiveStatus] = useState<DeliverableStatus | 'all'>('all');
  const [activeClient, setActiveClient] = useState<string>('all');
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: deliverables = [], isLoading } = useDeliverables(
    activeClient !== 'all' ? { clientId: activeClient } : undefined
  );
  const { data: clients = [] } = useClients();

  const filtered =
    activeStatus === 'all'
      ? deliverables
      : deliverables.filter((d) => d.status === activeStatus);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Entregas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie entregas para clientes.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} disabled={clients.length === 0}>
          <Plus className="size-4" />
          Nova Entrega
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={activeClient} onValueChange={setActiveClient}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={activeStatus === status ? 'default' : 'outline'}
              onClick={() => setActiveStatus(status)}
            >
              {status === 'all' ? 'Todos' : DELIVERABLE_STATUS_LABELS[status]}
            </Button>
          ))}
        </div>
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
      />

      {clients.length > 0 && (
        <CreateDeliverableDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          clientId={activeClient !== 'all' ? activeClient : clients[0].id}
        />
      )}
    </div>
  );
}
