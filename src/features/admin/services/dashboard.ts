import { supabase } from '@/lib/supabase'
import type { Order, OrderStatus } from '@/types/database'

export interface DashboardMetrics {
  totalOrders: number
  todayOrders: number
  totalClients: number
  monthlyRevenue: number
}

export interface RecentOrder {
  id: string
  order_number: number
  status: OrderStatus
  total: number
  created_at: string
  profile: { company_name: string | null } | null
}

export interface OrdersByStatus {
  status: OrderStatus
  count: number
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [ordersRes, todayRes, clientsRes, revenueRes] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase
      .from('orders')
      .select('total')
      .gte('created_at', monthStart)
      .not('status', 'in', '("cancelled","rejected")'),
  ])

  if (ordersRes.error) throw new Error(`Falha ao buscar total de pedidos: ${ordersRes.error.message}`)
  if (todayRes.error) throw new Error(`Falha ao buscar pedidos de hoje: ${todayRes.error.message}`)
  if (clientsRes.error) throw new Error(`Falha ao buscar total de clientes: ${clientsRes.error.message}`)
  if (revenueRes.error) throw new Error(`Falha ao buscar receita mensal: ${revenueRes.error.message}`)

  const monthlyRevenue = (revenueRes.data as Pick<Order, 'total'>[]).reduce(
    (sum, order) => sum + (order.total ?? 0),
    0
  )

  return {
    totalOrders: ordersRes.count ?? 0,
    todayOrders: todayRes.count ?? 0,
    totalClients: clientsRes.count ?? 0,
    monthlyRevenue,
  }
}

export async function fetchRecentOrders(limit = 5): Promise<RecentOrder[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at, profile:profiles(company_name)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent orders:', error)
    throw new Error(`Falha ao buscar pedidos recentes: ${error.message}`)
  }

  return (data as unknown as RecentOrder[]) ?? []
}

export async function fetchOrdersByStatus(): Promise<OrdersByStatus[]> {
  const { data, error } = await supabase.from('orders').select('status')

  if (error) {
    console.error('Error fetching orders by status:', error)
    throw new Error(`Falha ao buscar pedidos por status: ${error.message}`)
  }

  const statusMap = new Map<OrderStatus, number>()
  for (const order of data ?? []) {
    const s = order.status as OrderStatus
    statusMap.set(s, (statusMap.get(s) ?? 0) + 1)
  }

  return Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }))
}
