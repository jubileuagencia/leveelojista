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

export interface ProductCartTotals {
  totalQuantity: number
  hasInCart: boolean
  variantCount: number
}

// Sum across ALL variants of a product. Used in contexts without a selected
// variant (ex: QuickReorderCard) where we only need to flag "is in cart".
export function useCartQuantityForProduct(productId: string): ProductCartTotals {
  return useCartStore(
    useShallow((state) => {
      const items = state.items.filter((i) => i.product_id === productId)
      const total = items.reduce((sum, i) => sum + (i.quantity || 0), 0)
      return {
        totalQuantity: total,
        hasInCart: total > 0,
        variantCount: items.length,
      }
    })
  )
}
