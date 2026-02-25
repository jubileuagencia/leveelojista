import { useQuery } from '@tanstack/react-query'
import { fetchDashboardMetrics, fetchRecentOrders, fetchOrdersByStatus } from '../services/dashboard'

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'metrics'],
    queryFn: fetchDashboardMetrics,
  })
}

export function useRecentOrders(limit = 5) {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'recent-orders', limit],
    queryFn: () => fetchRecentOrders(limit),
  })
}

export function useOrdersByStatus() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'orders-by-status'],
    queryFn: fetchOrdersByStatus,
  })
}
