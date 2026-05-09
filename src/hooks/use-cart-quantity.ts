import { useShallow } from 'zustand/react/shallow'
import { useCartStore } from '@/stores/cart-store'

export interface CartQuantityInfo {
  quantity: number
  cartItemId: string | null
}

// Read the cart entry for a specific product+variant combo. Accepts null/undefined
// productId so consumers can call the hook before the product has loaded
// (returns empty state in that case — hooks cannot be called conditionally).
export function useCartQuantity(
  productId: string | null | undefined,
  variantId: string | null,
): CartQuantityInfo {
  return useCartStore(
    useShallow((state) => {
      if (!productId) return { quantity: 0, cartItemId: null }
      const item = state.items.find(
        (i) => i.product_id === productId && i.variant_id === variantId,
      )
      return {
        quantity: item?.quantity ?? 0,
        cartItemId: item?.id ?? null,
      }
    }),
  )
}

export interface ProductCartTotals {
  totalQuantity: number
  hasInCart: boolean
}

// Sum across ALL variants of a product. Used in contexts without a selected
// variant (ex: QuickReorderCard) where we only need a "is in cart" signal.
export function useCartQuantityForProduct(productId: string): ProductCartTotals {
  return useCartStore(
    useShallow((state) => {
      const items = state.items.filter((i) => i.product_id === productId)
      const total = items.reduce((sum, i) => sum + (i.quantity || 0), 0)
      return {
        totalQuantity: total,
        hasInCart: total > 0,
      }
    }),
  )
}
