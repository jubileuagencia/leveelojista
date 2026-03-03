import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchTierDiscounts,
  updateTierDiscounts,
  type TierDiscountsConfig,
} from '../services/config'

export function useTierDiscounts() {
  return useQuery({
    queryKey: ['admin', 'config', 'tier_discounts'],
    queryFn: fetchTierDiscounts,
  })
}

export function useUpdateTierDiscounts() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (discounts: TierDiscountsConfig) => updateTierDiscounts(discounts),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'config'] })
      toast.success('Descontos atualizados')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
