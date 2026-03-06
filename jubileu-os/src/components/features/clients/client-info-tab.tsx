'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Pencil, Mail, Phone, ExternalLink } from 'lucide-react';
import type { Client } from '@/types';

interface ClientInfoTabProps {
  client: Client;
  onEdit: () => void;
}

export function ClientInfoTab({ client, onEdit }: ClientInfoTabProps) {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Basic Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Dados Basicos</h3>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="size-3" />
            Editar
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoField label="Nome" value={client.name} />
          <InfoField label="Slug" value={client.slug} />
          <InfoField label="Tag ClickUp" value={client.clickup_tag || 'Nao configurada'} />
          <InfoField label="Notion Page ID" value={client.notion_root_page_id || 'Nao configurado'} />
          <InfoField label="Status" value={client.is_active ? 'Ativo' : 'Inativo'} />
          <InfoField
            label="Criado em"
            value={new Date(client.created_at).toLocaleDateString('pt-BR')}
          />
        </div>
      </div>

      <Separator />

      {/* Contacts */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Contatos ({client.contacts.length})</h3>
        {client.contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum contato cadastrado.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {client.contacts.map((contact, i) => (
              <div key={i} className="rounded-md border p-3 space-y-1">
                <p className="text-sm font-medium">{contact.name}</p>
                <Badge variant="outline" className="text-[10px]">{contact.role}</Badge>
                {contact.email && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="size-3" />
                    {contact.email}
                  </p>
                )}
                {contact.phone && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="size-3" />
                    {contact.phone}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Links */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Links ({Object.keys(client.links ?? {}).length})</h3>
        {Object.keys(client.links ?? {}).length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum link cadastrado.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(client.links).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-sm font-medium capitalize">{key}</span>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground truncate"
                >
                  <ExternalLink className="size-3 shrink-0" />
                  {value}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
