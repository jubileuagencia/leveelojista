import type { OrderStatus } from '@/types/database'

export interface StatusConfig {
  label: string
  className: string
}

// Paleta unificada — usada por orders/ e admin/ para garantir consistência visual
export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-900',
  },
  separating: {
    label: 'Em separação',
    className: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-900',
  },
  awaiting_payment: {
    label: 'Aguardando pagamento',
    className: 'bg-amber-200 text-amber-900 border-amber-400 font-semibold dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-700',
  },
  approved: {
    label: 'Aprovado',
    className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900',
  },
  preparing: {
    label: 'Preparando',
    className: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-900',
  },
  shipped: {
    label: 'Enviado',
    className: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-900',
  },
  delivered: {
    label: 'Entregue',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900',
  },
  rejected: {
    label: 'Rejeitado',
    className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/50 dark:text-gray-400 dark:border-gray-900',
  },
}

export const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'separating',
  'awaiting_payment',
  'approved',
  'preparing',
  'shipped',
  'delivered',
  'rejected',
  'cancelled',
]

export function getStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_CONFIG[status]?.label ?? status
}

// Classes da pílula auxiliar "✓ Pago" (renderizada ao lado do badge quando paid_at != null)
export const PAID_PILL_CLASS =
  'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900'
