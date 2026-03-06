'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useClients } from '@/hooks/use-clients';
import { EditClientDialog } from '@/components/features/clients/edit-client-dialog';
import { ClientTasksWidget } from '@/components/features/clients/client-tasks-widget';
import { ClientInfoTab } from '@/components/features/clients/client-info-tab';
import { Pencil, ExternalLink, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { Client } from '@/types';

type Tab = 'overview' | 'tasks' | 'info';

export default function ClientDetailPage() {
  const params = useParams<{ slug: string }>();
  const { data: clients, isLoading } = useClients();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [editClient, setEditClient] = useState<Client | null>(null);

  const client = clients?.find((c) => c.slug === params.slug);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-4">
        <Link href="/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <p className="text-muted-foreground">Cliente nao encontrado.</p>
      </div>
    );
  }

  const initials = client.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Visao Geral' },
    { id: 'tasks', label: 'Tarefas' },
    { id: 'info', label: 'Informacoes' },
  ];

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Clientes
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="size-14">
          <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{client.name}</h1>
            {!client.is_active && (
              <Badge variant="secondary">Inativo</Badge>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {client.clickup_tag && (
              <Badge variant="outline" className="text-xs">
                {client.clickup_tag}
              </Badge>
            )}
            {Object.entries(client.links ?? {}).slice(0, 3).map(([key, value]) => (
              <a
                key={key}
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs hover:text-foreground"
              >
                <ExternalLink className="size-3" />
                {key}
              </a>
            ))}
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={() => setEditClient(client)}>
          <Pencil className="size-4" />
          Editar
        </Button>
      </div>

      <Separator />

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2',
              activeTab === tab.id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <ClientOverview client={client} />}
      {activeTab === 'tasks' && <ClientTasksWidget client={client} />}
      {activeTab === 'info' && (
        <ClientInfoTab client={client} onEdit={() => setEditClient(client)} />
      )}

      <EditClientDialog
        client={editClient}
        open={!!editClient}
        onOpenChange={(open) => !open && setEditClient(null)}
      />
    </div>
  );
}

function ClientOverview({ client }: { client: Client }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Tasks Widget (compact) */}
      <div className="rounded-lg border bg-card p-4">
        <ClientTasksWidget client={client} compact />
      </div>

      {/* Contacts Widget */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Contatos</h3>
        {client.contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum contato.</p>
        ) : (
          <div className="space-y-2">
            {client.contacts.slice(0, 3).map((c, i) => (
              <div key={i} className="text-sm">
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Links Widget */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Links</h3>
        {Object.keys(client.links ?? {}).length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum link.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(client.links).map(([key, value]) => (
              <a
                key={key}
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-foreground"
              >
                <ExternalLink className="size-3 text-muted-foreground" />
                <span className="font-medium capitalize">{key}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
