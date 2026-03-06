'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useClients, useUpdateClient } from '@/hooks/use-clients';
import { ClientCard } from '@/components/features/clients/client-card';
import { CreateClientDialog } from '@/components/features/clients/create-client-dialog';
import { EditClientDialog } from '@/components/features/clients/edit-client-dialog';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { Client } from '@/types';

export default function ClientsPage() {
  const router = useRouter();
  const { data: clients, isLoading } = useClients();
  const updateClient = useUpdateClient();

  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);

  const filtered = (() => {
    let list = clients ?? [];
    if (!showInactive) {
      list = list.filter((c) => c.is_active);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.clickup_tag && c.clickup_tag.toLowerCase().includes(q))
      );
    }
    return list;
  })();

  async function handleToggleActive(client: Client) {
    try {
      await updateClient.mutateAsync({
        clientId: client.id,
        body: { is_active: !client.is_active },
      });
      toast.success(client.is_active ? 'Cliente desativado' : 'Cliente reativado');
    } catch {
      toast.error('Erro ao atualizar cliente');
    }
  }

  function handleClick(client: Client) {
    router.push(`/clients/${client.slug}`);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant={showInactive ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowInactive(!showInactive)}
        >
          {showInactive ? 'Mostrando inativos' : 'Mostrar inativos'}
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            {search ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={setEditClient}
              onToggleActive={handleToggleActive}
              onClick={handleClick}
            />
          ))}
        </div>
      )}

      <CreateClientDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditClientDialog
        client={editClient}
        open={!!editClient}
        onOpenChange={(open) => !open && setEditClient(null)}
      />
    </div>
  );
}
