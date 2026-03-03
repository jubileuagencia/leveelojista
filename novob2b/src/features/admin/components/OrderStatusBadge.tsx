import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types/database'

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pendente', className: 'bg-amber-100 text-amber-800 hover:bg-amber-100' },
  approved: { label: 'Aprovado', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  preparing: { label: 'Preparando', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
  shipped: { label: 'Enviado', className: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100' },
  delivered: { label: 'Entregue', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' },
  rejected: { label: 'Rejeitado', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  cancelled: { label: 'Cancelado', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
}

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: '' }

  return (
    <Badge variant="secondary" className={cn('text-[11px] font-medium', config.className, className)}>
      {config.label}
    </Badge>
  )
}

export function getStatusLabel(status: OrderStatus): string {
  return STATUS_CONFIG[status]?.label ?? status
}

export const ALL_STATUSES: OrderStatus[] = [
  'pending', 'approved', 'preparing', 'shipped', 'delivered', 'rejected', 'cancelled',
]
