import { useShallow } from 'zustand/react/shallow'
import { useCartStore } from '@/stores/cart-store'

export interface CartQuantityInfo {
  quantity: number
  cartItemId: string | null
}

export function useCartQuantity(
  productId: string,
  variantId: string | null
): CartQuantityInfo {
  return useCartStore(
    useShallow((state) => {
      const item = state.items.find(
        (i) => i.product_id === productId && i.variant_id === variantId
      )
      return {
        quantity: item?.quantity ?? 0,
        cartItemId: item?.id ?? null,
      }
    })
  )
}
