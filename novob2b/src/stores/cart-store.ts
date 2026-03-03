import { create } from 'zustand'
import type { CartItem, Product } from '@/types/database'
import { supabase } from '@/lib/supabase'

interface CartState {
  items: CartItem[]
  loading: boolean

  fetchCart: (userId: string) => Promise<void>
  addItem: (userId: string, product: Product, quantity?: number) => Promise<void>
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
      .select('*, product:products(*)')
      .eq('user_id', userId)

    set({ items: (data as CartItem[]) ?? [], loading: false })
  },

  addItem: async (userId, product, quantity = 1) => {
    const existing = get().items.find(i => i.product_id === product.id)

    if (existing) {
      await get().updateQuantity(existing.id, existing.quantity + quantity)
      return
    }

    // Optimistic update
    const tempItem: CartItem = {
      id: crypto.randomUUID(),
      user_id: userId,
      product_id: product.id,
      quantity,
      created_at: new Date().toISOString(),
      product,
    }
    set(s => ({ items: [...s.items, tempItem] }))

    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id: product.id, quantity })
      .select('*, product:products(*)')
      .single()

    if (error) {
      set(s => ({ items: s.items.filter(i => i.id !== tempItem.id) }))
      throw error
    }

    set(s => ({
      items: s.items.map(i => i.id === tempItem.id ? (data as CartItem) : i),
    }))
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity < 1) {
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
      const price = item.product?.price ?? 0
      return sum + price * item.quantity
    }, 0)
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  },
}))
