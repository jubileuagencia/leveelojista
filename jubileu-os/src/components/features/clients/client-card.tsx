'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Power, ExternalLink } from 'lucide-react';
import type { Client } from '@/types';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onToggleActive: (client: Client) => void;
  onClick: (client: Client) => void;
}

export function ClientCard({ client, onEdit, onToggleActive, onClick }: ClientCardProps) {
  const initials = client.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const contactCount = client.contacts?.length ?? 0;
  const linkCount = Object.keys(client.links ?? {}).length;

  return (
    <div
      className="group relative cursor-pointer rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
      onClick={() => onClick(client)}
    >
      {/* Top row */}
      <div className="mb-3 flex items-start gap-3">
        <Avatar className="size-10 shrink-0">
          <AvatarFallback className="text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{client.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{client.slug}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(client); }}>
              <Pencil className="mr-2 size-4" />
              Editar
            </DropdownMenuItem>
            {client.clickup_tag && (
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="mr-2 size-4" />
                Ver no ClickUp
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); onToggleActive(client); }}
              className={client.is_active ? 'text-destructive' : 'text-green-600'}
            >
              <Power className="mr-2 size-4" />
              {client.is_active ? 'Desativar' : 'Reativar'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Info row */}
      <div className="flex items-center gap-2">
        {!client.is_active && (
          <Badge variant="secondary" className="text-[10px]">
            Inativo
          </Badge>
        )}
        {client.clickup_tag && (
          <Badge variant="outline" className="text-[10px]">
            {client.clickup_tag}
          </Badge>
        )}
        <span className="ml-auto text-[10px] text-muted-foreground">
          {contactCount} contato{contactCount !== 1 ? 's' : ''}
          {linkCount > 0 && ` · ${linkCount} link${linkCount !== 1 ? 's' : ''}`}
        </span>
      </div>
    </div>
  );
}
