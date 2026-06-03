import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ORDER_STATUS_CONFIG, PAID_PILL_CLASS } from '@/lib/order-status'
import type { OrderStatus } from '@/types/database'

interface OrderStatusBadgeProps {
  status: OrderStatus
  paidAt?: string | null
  className?: string
}

export function OrderStatusBadge({ status, paidAt, className }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status]

  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge variant="outline" className={cn(config.className, className)}>
        {config.label}
      </Badge>
      {paidAt && (
        <Badge variant="outline" className={PAID_PILL_CLASS}>
          ✓ Pago
        </Badge>
      )}
    </span>
  )
}
