'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useClients } from '@/hooks/use-clients';
import { useAppStore } from '@/stores/app-store';
import { Building2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ClientSelector() {
  const { data: clients } = useClients();
  const { activeClientId, setActiveClient } = useAppStore();

  const activeClient = clients?.find((c) => c.id === activeClientId);

  if (!clients || clients.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'gap-1.5 max-w-[180px]',
            activeClient && 'border-primary/50 bg-primary/5'
          )}
        >
          {activeClient ? (
            <>
              <Avatar className="size-4">
                <AvatarFallback className="text-[8px]">
                  {activeClient.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{activeClient.name}</span>
            </>
          ) : (
            <>
              <Building2 className="size-3.5" />
              <span>Todos</span>
            </>
          )}
          <ChevronDown className="size-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem onClick={() => setActiveClient(null)}>
          <Building2 className="mr-2 size-4" />
          Todos os clientes
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {clients
          .filter((c) => c.is_active)
          .map((client) => (
            <DropdownMenuItem
              key={client.id}
              onClick={() => setActiveClient(client.id)}
              className={cn(activeClientId === client.id && 'bg-accent')}
            >
              <Avatar className="mr-2 size-5">
                <AvatarFallback className="text-[8px]">
                  {client.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {client.name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
