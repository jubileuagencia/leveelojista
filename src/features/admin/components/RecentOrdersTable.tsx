import type { RecentOrder } from '../services/dashboard'
import type { OrderStatus } from '@/types/database'
import { formatCurrency, formatDate, formatOrderNumber } from '@/lib/format'

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Aprovado', className: 'bg-blue-100 text-blue-800' },
  preparing: { label: 'Preparando', className: 'bg-orange-100 text-orange-800' },
  shipped: { label: 'Enviado', className: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Entregue', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejeitado', className: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Cancelado', className: 'bg-gray-100 text-gray-800' },
}

interface RecentOrdersTableProps {
  orders: RecentOrder[]
  loading?: boolean
}

function SkeletonRow() {
  return (
    <tr className="border-b">
      <td className="px-3 py-3 lg:px-4"><div className="h-4 w-12 animate-pulse rounded bg-muted" /></td>
      <td className="hidden px-3 py-3 sm:table-cell lg:px-4"><div className="h-4 w-24 animate-pulse rounded bg-muted" /></td>
      <td className="px-3 py-3 lg:px-4"><div className="h-4 w-16 animate-pulse rounded bg-muted" /></td>
      <td className="px-3 py-3 lg:px-4"><div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted" /></td>
      <td className="hidden px-3 py-3 md:table-cell lg:px-4"><div className="h-4 w-20 animate-pulse rounded bg-muted" /></td>
    </tr>
  )
}

export function RecentOrdersTable({ orders, loading }: RecentOrdersTableProps) {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-4 py-3 lg:px-6 lg:py-4">
        <h3 className="text-base font-semibold lg:text-lg">Pedidos Recentes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-muted-foreground">
              <th className="whitespace-nowrap px-3 py-3 font-medium lg:px-4"># Pedido</th>
              <th className="hidden whitespace-nowrap px-3 py-3 font-medium sm:table-cell lg:px-4">Empresa</th>
              <th className="whitespace-nowrap px-3 py-3 font-medium lg:px-4">Status</th>
              <th className="whitespace-nowrap px-3 py-3 font-medium text-right lg:px-4">Total</th>
              <th className="hidden whitespace-nowrap px-3 py-3 font-medium md:table-cell lg:px-4">Data</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground lg:px-4">
                  Nenhum pedido encontrado
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const statusCfg = STATUS_CONFIG[order.status]
                return (
                  <tr key={order.id} className="border-b transition-colors hover:bg-muted/30">
                    <td className="whitespace-nowrap px-3 py-3 font-medium lg:px-4">{formatOrderNumber(order.order_number)}</td>
                    <td className="hidden max-w-[200px] truncate px-3 py-3 sm:table-cell lg:px-4">{order.profile?.company_name ?? '—'}</td>
                    <td className="whitespace-nowrap px-3 py-3 lg:px-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-medium lg:px-4">{formatCurrency(order.total)}</td>
                    <td className="hidden whitespace-nowrap px-3 py-3 text-muted-foreground md:table-cell lg:px-4">{formatDate(order.created_at)}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
