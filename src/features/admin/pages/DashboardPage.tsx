import { useEffect } from 'react'
import { ShoppingCart, CalendarCheck, Users, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/format'
import { MetricCard } from '../components/MetricCard'
import { RecentOrdersTable } from '../components/RecentOrdersTable'
import { useDashboardMetrics, useRecentOrders, useOrdersByStatus } from '../hooks/useDashboard'
import { OrdersByStatusChart } from '../components/OrdersByStatusChart'

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useDashboardMetrics()
  const { data: recentOrders, isLoading: ordersLoading, error: ordersError } = useRecentOrders()
  const { data: statusData, isLoading: statusLoading } = useOrdersByStatus()

  useEffect(() => {
    if (metricsError) toast.error('Erro ao carregar metricas do dashboard')
  }, [metricsError])

  useEffect(() => {
    if (ordersError) toast.error('Erro ao carregar pedidos recentes')
  }, [ordersError])

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da operação</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Pedidos"
          value={metricsLoading ? '...' : String(metrics?.totalOrders ?? 0)}
          icon={ShoppingCart}
          iconColor="text-blue-600"
          loading={metricsLoading}
        />
        <MetricCard
          title="Pedidos Hoje"
          value={metricsLoading ? '...' : String(metrics?.todayOrders ?? 0)}
          icon={CalendarCheck}
          iconColor="text-orange-600"
          loading={metricsLoading}
        />
        <MetricCard
          title="Total de Clientes"
          value={metricsLoading ? '...' : String(metrics?.totalClients ?? 0)}
          icon={Users}
          iconColor="text-green-600"
          loading={metricsLoading}
        />
        <MetricCard
          title="Receita Mensal"
          value={metricsLoading ? '...' : formatCurrency(metrics?.monthlyRevenue ?? 0)}
          icon={DollarSign}
          iconColor="text-emerald-600"
          loading={metricsLoading}
        />
      </div>

      <OrdersByStatusChart data={statusData} loading={statusLoading} />

      <RecentOrdersTable orders={recentOrders ?? []} loading={ordersLoading} />
    </div>
  )
}
