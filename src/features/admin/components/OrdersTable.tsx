import { ClipboardList } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate, formatOrderNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { OrderStatusBadge } from './OrderStatusBadge'
import type { AdminOrder } from '../services/orders'

interface OrdersTableProps {
  orders: AdminOrder[]
  loading?: boolean
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onViewDetail: (id: string) => void
}

export function OrdersTable({
  orders,
  loading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetail,
}: OrdersTableProps) {
  if (loading) return <OrdersTableSkeleton />

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ClipboardList className="size-12 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Nenhum pedido encontrado</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Tente ajustar os filtros</p>
      </div>
    )
  }

  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.has(o.id))

  return (
    <>
      {/* ── Mobile: Card List ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border p-3 transition-colors active:bg-muted/50',
              selectedIds.has(order.id) && 'bg-emerald-50/50 border-emerald-200'
            )}
            onClick={() => onViewDetail(order.id)}
            role="button"
            tabIndex={0}
          >
            <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedIds.has(order.id)}
                onCheckedChange={() => onToggleSelect(order.id)}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{formatOrderNumber(order.order_number)}</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {order.company_name ?? 'Cliente'}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{formatDate(order.created_at)}</span>
                <span className="text-sm font-semibold tabular-nums">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: Table ── */}
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-10 px-3 py-3">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onToggleSelectAll}
                  aria-label="Selecionar todos"
                />
              </th>
              <th className="px-3 py-3 text-left font-medium">Pedido</th>
              <th className="px-3 py-3 text-left font-medium">Cliente</th>
              <th className="px-3 py-3 text-center font-medium">Status</th>
              <th className="px-3 py-3 text-left font-medium">Data</th>
              <th className="px-3 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={cn(
                  'border-b transition-colors hover:bg-muted/30 cursor-pointer',
                  selectedIds.has(order.id) && 'bg-emerald-50/50'
                )}
                onClick={() => onViewDetail(order.id)}
              >
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(order.id)}
                    onCheckedChange={() => onToggleSelect(order.id)}
                  />
                </td>
                <td className="px-3 py-2.5 font-medium">
                  {formatOrderNumber(order.order_number)}
                </td>
                <td className="px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate max-w-[200px]">{order.company_name ?? '—'}</p>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                  {formatCurrency(order.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function OrdersTableSkeleton() {
  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
            <Skeleton className="size-4 mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-32" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-10 px-3 py-3"><Skeleton className="size-4" /></th>
              <th className="px-3 py-3"><Skeleton className="h-4 w-14" /></th>
              <th className="px-3 py-3"><Skeleton className="h-4 w-20" /></th>
              <th className="px-3 py-3"><Skeleton className="mx-auto h-4 w-16" /></th>
              <th className="px-3 py-3"><Skeleton className="h-4 w-16" /></th>
              <th className="px-3 py-3"><Skeleton className="ml-auto h-4 w-14" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b">
                <td className="px-3 py-2.5"><Skeleton className="size-4" /></td>
                <td className="px-3 py-2.5"><Skeleton className="h-4 w-14" /></td>
                <td className="px-3 py-2.5"><Skeleton className="h-4 w-28" /></td>
                <td className="px-3 py-2.5"><Skeleton className="mx-auto h-5 w-16 rounded-full" /></td>
                <td className="px-3 py-2.5"><Skeleton className="h-4 w-20" /></td>
                <td className="px-3 py-2.5"><Skeleton className="ml-auto h-4 w-16" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
