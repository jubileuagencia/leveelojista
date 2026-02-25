import { Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCNPJ, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { TierBadge } from './TierBadge'
import { RoleBadge } from './RoleBadge'
import type { AdminClient } from '../services/clients'

interface ClientsTableProps {
  clients: AdminClient[]
  loading?: boolean
  onViewDetail: (id: string) => void
}

export function ClientsTable({ clients, loading, onViewDetail }: ClientsTableProps) {
  if (loading) return <ClientsTableSkeleton />

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="size-12 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Nenhum cliente encontrado</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Tente ajustar os filtros</p>
      </div>
    )
  }

  return (
    <>
      {/* ── Mobile: Card List ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {clients.map((client) => (
          <div
            key={client.id}
            className="rounded-lg border p-3 transition-colors active:bg-muted/50"
            onClick={() => onViewDetail(client.id)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold truncate">
                {client.company_name ?? 'Sem nome'}
              </span>
              <TierBadge tier={client.tier} />
              <RoleBadge role={client.role} />
            </div>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {client.email ?? '—'}
            </p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {client.cnpj ? formatCNPJ(client.cnpj) : '—'}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(client.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: Table ── */}
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-3 text-left font-medium">Empresa</th>
              <th className="px-3 py-3 text-left font-medium">Email</th>
              <th className="px-3 py-3 text-left font-medium">CNPJ</th>
              <th className="px-3 py-3 text-center font-medium">Tier</th>
              <th className="px-3 py-3 text-center font-medium">Papel</th>
              <th className="px-3 py-3 text-left font-medium">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className={cn(
                  'border-b transition-colors hover:bg-muted/30 cursor-pointer'
                )}
                onClick={() => onViewDetail(client.id)}
              >
                <td className="px-3 py-2.5 font-medium">
                  <p className="truncate max-w-[200px]">
                    {client.company_name ?? 'Sem nome'}
                  </p>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  <p className="truncate max-w-[200px]">{client.email ?? '—'}</p>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground tabular-nums">
                  {client.cnpj ? formatCNPJ(client.cnpj) : '—'}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <TierBadge tier={client.tier} />
                </td>
                <td className="px-3 py-2.5 text-center">
                  <RoleBadge role={client.role} />
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {formatDate(client.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function ClientsTableSkeleton() {
  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-40" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-3"><Skeleton className="h-4 w-20" /></th>
              <th className="px-3 py-3"><Skeleton className="h-4 w-24" /></th>
              <th className="px-3 py-3"><Skeleton className="h-4 w-28" /></th>
              <th className="px-3 py-3"><Skeleton className="mx-auto h-4 w-12" /></th>
              <th className="px-3 py-3"><Skeleton className="mx-auto h-4 w-12" /></th>
              <th className="px-3 py-3"><Skeleton className="h-4 w-16" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b">
                <td className="px-3 py-2.5"><Skeleton className="h-4 w-28" /></td>
                <td className="px-3 py-2.5"><Skeleton className="h-4 w-36" /></td>
                <td className="px-3 py-2.5"><Skeleton className="h-4 w-32" /></td>
                <td className="px-3 py-2.5"><Skeleton className="mx-auto h-5 w-14 rounded-full" /></td>
                <td className="px-3 py-2.5"><Skeleton className="mx-auto h-5 w-14 rounded-full" /></td>
                <td className="px-3 py-2.5"><Skeleton className="h-4 w-20" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
