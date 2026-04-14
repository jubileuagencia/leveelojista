import { create } from 'zustand'
import type { CartItem, Product, ProductVariant } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { normalizeProduct } from '@/lib/product-utils'

function normalizeCartItem<T extends { product?: unknown }>(item: T): T {
  if (!item.product) return item
  return { ...item, product: normalizeProduct(item.product as never) }
}

interface CartState {
  items: CartItem[]
  loading: boolean

  fetchCart: (userId: string) => Promise<void>
  addItem: (userId: string, product: Product, quantity?: number, variant?: ProductVariant) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: (userId: string) => Promise<void>
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async (userId) => {
    set({ loading: true })
    const { data } = await supabase
      .from('cart_items')
      .select('*, product:products(*, category_links:product_categories(is_primary, category:categories(*)), variants:product_variants(*)), variant:product_variants(*)')
      .eq('user_id', userId)

    const items = ((data as CartItem[]) ?? []).map(normalizeCartItem)
    set({ items, loading: false })
  },

  addItem: async (userId, product, quantity = 1, variant) => {
    const variantId = variant?.id ?? null

    // Find existing item with same product + variant
    const existing = get().items.find(
      i => i.product_id === product.id && i.variant_id === variantId
    )

    if (existing) {
      await get().updateQuantity(existing.id, existing.quantity + quantity)
      return
    }

    // Optimistic update
    const tempItem: CartItem = {
      id: crypto.randomUUID(),
      user_id: userId,
      product_id: product.id,
      variant_id: variantId,
      quantity,
      created_at: new Date().toISOString(),
      product,
      variant: variant ?? undefined,
    }
    set(s => ({ items: [...s.items, tempItem] }))

    const insertData: Record<string, unknown> = {
      user_id: userId,
      product_id: product.id,
      quantity,
    }
    if (variantId) {
      insertData.variant_id = variantId
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert(insertData)
      .select('*, product:products(*, category_links:product_categories(is_primary, category:categories(*)), variants:product_variants(*)), variant:product_variants(*)')
      .single()

    if (error) {
      set(s => ({ items: s.items.filter(i => i.id !== tempItem.id) }))
      throw error
    }

    const normalized = normalizeCartItem(data as CartItem)
    set(s => ({
      items: s.items.map(i => i.id === tempItem.id ? normalized : i),
    }))
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity <= 0) {
      await get().removeItem(itemId)
      return
    }

    set(s => ({
      items: s.items.map(i => i.id === itemId ? { ...i, quantity } : i),
    }))

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)

    if (error) throw error
  },

  removeItem: async (itemId) => {
    const prev = get().items
    set(s => ({ items: s.items.filter(i => i.id !== itemId) }))

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (error) {
      set({ items: prev })
      throw error
    }
  },

  clearCart: async (userId) => {
    set({ items: [] })
    await supabase.from('cart_items').delete().eq('user_id', userId)
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => {
      const price = item.variant?.unit_price ?? item.product?.price ?? 0
      return sum + price * item.quantity
    }, 0)
  },

  getItemCount: () => {
    return get().items.length
  },
}))
