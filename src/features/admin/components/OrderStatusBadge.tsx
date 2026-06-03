import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ORDER_STATUS_CONFIG, ALL_STATUSES, PAID_PILL_CLASS, getStatusLabel } from '@/lib/order-status'
import type { OrderStatus } from '@/types/database'

export { ALL_STATUSES, getStatusLabel }

interface OrderStatusBadgeProps {
  status: OrderStatus
  paidAt?: string | null
  className?: string
}

export function OrderStatusBadge({ status, paidAt, className }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] ?? { label: status, className: '' }

  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge
        variant="secondary"
        className={cn('text-[11px] font-medium hover:opacity-90', config.className, className)}
      >
        {config.label}
      </Badge>
      {paidAt && (
        <Badge variant="secondary" className={cn('text-[11px]', PAID_PILL_CLASS)}>
          ✓ Pago
        </Badge>
      )}
    </span>
  )
}
