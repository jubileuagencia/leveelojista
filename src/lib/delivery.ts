import { useConfigStore } from '@/stores/config-store'

/**
 * Calcula a data estimada de entrega baseada no horario de corte.
 * - Antes do corte → entrega amanha
 * - Depois do corte → entrega em 2 dias
 */
export function getEstimatedDeliveryDate(cutoffTime: string = '18:00'): Date {
  const now = new Date()

  const [cutoffH, cutoffM] = cutoffTime.split(':').map(Number)
  const currentH = now.getHours()
  const currentM = now.getMinutes()

  const isBeforeCutoff =
    currentH < cutoffH || (currentH === cutoffH && currentM < cutoffM)

  const daysToAdd = isBeforeCutoff ? 1 : 2

  const delivery = new Date(now)
  delivery.setDate(delivery.getDate() + daysToAdd)
  delivery.setHours(0, 0, 0, 0)
  return delivery
}

/**
 * Formata uma data de entrega para exibição: "terça-feira, 19 de março"
 */
export function formatDeliveryDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date + 'T12:00:00') : date
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d)
}

/**
 * Hook que retorna a data estimada de entrega usando a config da store.
 */
export function useEstimatedDelivery() {
  const cutoffTime = useConfigStore((s) => s.delivery.order_cutoff_time)
  const deliveryDate = getEstimatedDeliveryDate(cutoffTime)
  return {
    date: deliveryDate,
    formatted: formatDeliveryDate(deliveryDate),
  }
}
