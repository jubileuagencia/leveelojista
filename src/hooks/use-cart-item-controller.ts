import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/cart-store'

export const FRACTIONAL_STEP = 0.1
export const CART_DEBOUNCE_MS = 300

export interface CartItemController {
  // Optimistic value to render — may differ from quantityInCart between
  // user click and the debounced server commit.
  displayQty: number
  // Increment/decrement the cart quantity. Negative deltas decrement.
  // Hitting 0 schedules a removeItem instead of an update.
  handleStep: (delta: number) => void
  // Remove the cart item immediately (bypasses debounce). No-op if cart is empty.
  handleRemove: () => Promise<void>
}

// Centralizes the optimistic-stepper + debounced-commit pattern reused by
// ProductCard and ProductPage when a cart item is in the cart. Keeps a useRef
// accumulator so rapid bursts in the same React tick read the latest target
// (regular setState batching would otherwise let all clicks see stale state).
export function useCartItemController(
  cartItemId: string | null,
  quantityInCart: number,
  isFractional: boolean,
): CartItemController {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const [pendingQty, setPendingQty] = useState<number | null>(null)
  const [lastServerQty, setLastServerQty] = useState(quantityInCart)
  const pendingRef = useRef<number | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Drop optimistic state when the cart store changes externally (server
  // confirmation, action from another component, etc). Derived-state-during-render
  // pattern — avoids the cascading-renders cost of doing this in a useEffect.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (lastServerQty !== quantityInCart) {
    setLastServerQty(quantityInCart)
    setPendingQty(null)
  }

  // Ref reset stays in an effect — React forbids ref mutation during render.
  useEffect(() => {
    pendingRef.current = null
  }, [quantityInCart])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const commit = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      if (!cartItemId) return
      const target = pendingRef.current
      if (target == null) return
      try {
        if (target <= 0) {
          await removeItem(cartItemId)
        } else {
          const rounded = isFractional
            ? Math.round(target * 10) / 10
            : Math.max(1, Math.round(target))
          await updateQuantity(cartItemId, rounded)
        }
      } catch {
        toast.error('Erro ao atualizar carrinho')
        setPendingQty(null)
        pendingRef.current = null
      }
    }, CART_DEBOUNCE_MS)
  }, [cartItemId, isFractional, removeItem, updateQuantity])

  const handleStep = useCallback(
    (delta: number) => {
      const step = isFractional ? FRACTIONAL_STEP : 1
      const base = pendingRef.current ?? quantityInCart
      const next = Math.max(0, Math.round((base + delta * step) * 10) / 10)
      pendingRef.current = next
      setPendingQty(next)
      commit()
    },
    [isFractional, quantityInCart, commit],
  )

  const handleRemove = useCallback(async () => {
    if (!cartItemId) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setPendingQty(0)
    pendingRef.current = 0
    try {
      await removeItem(cartItemId)
    } catch {
      toast.error('Erro ao remover do carrinho')
      setPendingQty(null)
      pendingRef.current = null
    }
  }, [cartItemId, removeItem])

  return {
    displayQty: pendingQty ?? quantityInCart,
    handleStep,
    handleRemove,
  }
}
