import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchSeparationDetail,
  fetchSeparationAudit,
  startSeparation,
  finalizeSeparation,
  confirmSeparationItem,
  removeSeparationItem,
  restoreSeparationItem,
  addSeparationItem,
  type SeparationItem,
} from '../services/separation'
import type { Product } from '@/types/database'

const separationKey = (orderId: string | null) =>
  ['admin', 'orders', 'separation', orderId] as const

export function useSeparationDetail(orderId: string | null) {
  return useQuery({
    queryKey: separationKey(orderId),
    queryFn: () => fetchSeparationDetail(orderId!),
    enabled: !!orderId,
  })
}

export function useSeparationAudit(orderId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: [...separationKey(orderId), 'audit'],
    queryFn: () => fetchSeparationAudit(orderId!),
    enabled: !!orderId && enabled,
  })
}

function useInvalidateSeparation(orderId: string | null) {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: separationKey(orderId) })
  }
}

export function useStartSeparation(orderId: string | null) {
  const invalidate = useInvalidateSeparation(orderId)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => startSeparation(id),
    onSuccess: () => {
      invalidate()
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useFinalizeSeparation(orderId: string | null) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => finalizeSeparation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
      qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      qc.invalidateQueries({ queryKey: separationKey(orderId) })
      toast.success('Separação finalizada — cliente será notificado para pagar')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useConfirmSeparationItem(orderId: string | null) {
  const invalidate = useInvalidateSeparation(orderId)

  return useMutation({
    mutationFn: (params: { item: SeparationItem; quantity: number; note: string }) =>
      confirmSeparationItem(params),
    onSuccess: () => {
      invalidate()
      toast.success('Item confirmado')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useRemoveSeparationItem(orderId: string | null) {
  const invalidate = useInvalidateSeparation(orderId)

  return useMutation({
    mutationFn: (item: SeparationItem) => removeSeparationItem(item),
    onSuccess: () => {
      invalidate()
      toast.success('Item removido da separação')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useRestoreSeparationItem(orderId: string | null) {
  const invalidate = useInvalidateSeparation(orderId)

  return useMutation({
    mutationFn: (item: SeparationItem) => restoreSeparationItem(item),
    onSuccess: () => {
      invalidate()
      toast.success('Item restaurado')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useAddSeparationItem(orderId: string | null) {
  const invalidate = useInvalidateSeparation(orderId)

  return useMutation({
    mutationFn: (params: {
      orderId: string
      product: Product
      quantity: number
      substitutedFromItemId?: string | null
    }) => addSeparationItem(params),
    onSuccess: () => {
      invalidate()
      toast.success('Item adicionado à separação')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
