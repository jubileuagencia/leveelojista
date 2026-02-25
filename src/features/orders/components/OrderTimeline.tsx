import {
  Clock,
  CheckCircle2,
  PackageCheck,
  Truck,
  CircleDot,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types/database'

interface OrderTimelineProps {
  status: OrderStatus
  createdAt: string
}

interface TimelineStep {
  status: OrderStatus
  label: string
  icon: React.ReactNode
}

const NORMAL_STEPS: TimelineStep[] = [
  {
    status: 'pending',
    label: 'Pedido realizado',
    icon: <Clock className="size-4" />,
  },
  {
    status: 'approved',
    label: 'Pedido aprovado',
    icon: <CheckCircle2 className="size-4" />,
  },
  {
    status: 'preparing',
    label: 'Em preparo',
    icon: <PackageCheck className="size-4" />,
  },
  {
    status: 'shipped',
    label: 'Enviado',
    icon: <Truck className="size-4" />,
  },
  {
    status: 'delivered',
    label: 'Entregue',
    icon: <CheckCircle2 className="size-4" />,
  },
]

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: 0,
  approved: 1,
  preparing: 2,
  shipped: 3,
  delivered: 4,
  rejected: -1,
  cancelled: -1,
}

export function OrderTimeline({ status, createdAt }: OrderTimelineProps) {
  const isTerminal = status === 'rejected' || status === 'cancelled'

  // For terminal statuses, find the last normal step reached before termination
  // We show the normal flow up to the point where it was rejected/cancelled
  const currentStepIndex = isTerminal
    ? 0 // Only the first step (pending) is guaranteed completed
    : STATUS_ORDER[status]

  const formatStepDate = (stepIndex: number) => {
    // We only know the created_at date. For the first step, we show the date.
    // For other steps we don't have exact timestamps, so we omit them.
    if (stepIndex === 0) {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(createdAt))
    }
    return null
  }

  return (
    <div className="space-y-0">
      {NORMAL_STEPS.map((step, index) => {
        const isCompleted = index < currentStepIndex
        const isCurrent = index === currentStepIndex && !isTerminal
        const isFuture = index > currentStepIndex || (isTerminal && index > 0)
        const isLast = index === NORMAL_STEPS.length - 1

        const stepDate = isCompleted || isCurrent ? formatStepDate(index) : null

        return (
          <div key={step.status} className="flex gap-3">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full transition-colors',
                  isCompleted && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
                  isCurrent && 'bg-primary text-primary-foreground',
                  isFuture && 'bg-muted text-muted-foreground/50'
                )}
              >
                {isCurrent ? (
                  <CircleDot className="size-4 animate-pulse" />
                ) : (
                  step.icon
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-[24px]',
                    index < currentStepIndex
                      ? 'bg-emerald-300 dark:bg-emerald-800'
                      : 'bg-muted'
                  )}
                />
              )}
            </div>

            {/* Step content */}
            <div className={cn('pb-4', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-sm font-medium leading-8',
                  isCompleted && 'text-emerald-700 dark:text-emerald-400',
                  isCurrent && 'text-foreground font-semibold',
                  isFuture && 'text-muted-foreground/50'
                )}
              >
                {step.label}
              </p>
              {stepDate && (
                <p className="text-xs text-muted-foreground -mt-1">
                  {stepDate}
                </p>
              )}
            </div>
          </div>
        )
      })}

      {/* Terminal step (rejected/cancelled) */}
      {isTerminal && (
        <div className="flex gap-3 mt-0">
          {/* Connector from last rendered step */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-3 bg-red-300 dark:bg-red-800" />
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <XCircle className="size-4" />
            </div>
          </div>
          <div className="pt-3">
            <p className="text-sm font-semibold text-red-600 dark:text-red-400 leading-8">
              {status === 'rejected' ? 'Pedido rejeitado' : 'Pedido cancelado'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
