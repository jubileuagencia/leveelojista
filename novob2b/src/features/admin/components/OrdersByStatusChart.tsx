import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import type { OrderStatus } from '@/types/database'
import type { OrdersByStatus } from '../services/dashboard'

const STATUS_CHART: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: '#f59e0b' },
  approved: { label: 'Aprovado', color: '#3b82f6' },
  preparing: { label: 'Preparando', color: '#a855f7' },
  shipped: { label: 'Enviado', color: '#06b6d4' },
  delivered: { label: 'Entregue', color: '#10b981' },
  rejected: { label: 'Rejeitado', color: '#ef4444' },
  cancelled: { label: 'Cancelado', color: '#6b7280' },
}

const ORDERED_STATUSES: OrderStatus[] = [
  'pending', 'approved', 'preparing', 'shipped', 'delivered', 'rejected', 'cancelled',
]

interface OrdersByStatusChartProps {
  data: OrdersByStatus[] | undefined
  loading: boolean
}

export function OrdersByStatusChart({ data, loading }: OrdersByStatusChartProps) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-4 lg:p-6">
        <Skeleton className="mb-4 h-5 w-48" />
        <Skeleton className="h-[250px] w-full" />
      </div>
    )
  }

  const chartData = ORDERED_STATUSES.map((status) => {
    const found = data?.find((d) => d.status === status)
    return {
      status,
      label: STATUS_CHART[status].label,
      color: STATUS_CHART[status].color,
      count: found?.count ?? 0,
    }
  })

  const total = chartData.reduce((sum, d) => sum + d.count, 0)

  if (total === 0) {
    return (
      <div className="rounded-lg border bg-card p-4 lg:p-6">
        <h3 className="text-sm font-medium text-muted-foreground">Pedidos por Status</h3>
        <div className="flex h-[250px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Nenhum pedido registrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-4 lg:p-6">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">Pedidos por Status</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: number | undefined) => [value ?? 0, 'Pedidos']}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--card))',
              fontSize: '13px',
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {chartData.map((entry) => (
              <Cell key={entry.status} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
