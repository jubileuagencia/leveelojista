import { useMemo } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useConfigStore } from '@/stores/config-store'

export function useTierPrice(basePrice: number) {
  const profile = useAuthStore(s => s.profile)
  const tierDiscounts = useConfigStore(s => s.tierDiscounts)

  return useMemo(() => {
    const tier = profile?.tier ?? 'bronze'
    const discountRate = tier === 'bronze' ? 0 : (tierDiscounts[tier] ?? 0)
    const discountAmount = basePrice * discountRate
    const finalPrice = basePrice - discountAmount

    return {
      finalPrice,
      originalPrice: basePrice,
      discountRate,
      discountAmount,
      tier,
      hasDiscount: discountRate > 0,
    }
  }, [basePrice, profile?.tier, tierDiscounts])
}
