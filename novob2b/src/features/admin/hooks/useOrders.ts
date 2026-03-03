import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchOrders,
  fetchOrderDetail,
  updateOrderStatus,
  bulkUpdateOrderStatus,
  type OrderFilters,
} from '../services/orders'
import type { OrderStatus } from '@/types/database'

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: () => fetchOrders(filters),
  })
}

export function useOrderDetail(id: string | null) {
  return useQuery({
    queryKey: ['admin', 'orders', 'detail', id],
    queryFn: () => fetchOrderDetail(id!),
    enabled: !!id,
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
      qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Status atualizado')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useBulkUpdateOrderStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: OrderStatus }) =>
      bulkUpdateOrderStatus(ids, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
      qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Status atualizado em massa')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
