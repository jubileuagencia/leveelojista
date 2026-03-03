import { create } from 'zustand'
import type { Favorite } from '@/types/database'
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '@/features/favorites/services/favorites'

interface FavoritesState {
  favorites: Favorite[]
  loading: boolean

  fetchFavorites: (userId: string) => Promise<void>
  toggleFavorite: (userId: string, productId: string) => Promise<void>
  isFavorite: (productId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loading: false,

  fetchFavorites: async (userId) => {
    set({ loading: true })
    try {
      const data = await getFavorites(userId)
      set({ favorites: data, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  toggleFavorite: async (userId, productId) => {
    const existing = get().favorites.find((f) => f.product_id === productId)

    if (existing) {
      // Optimistic remove
      set((s) => ({
        favorites: s.favorites.filter((f) => f.product_id !== productId),
      }))

      try {
        await removeFavorite(userId, productId)
      } catch {
        // Revert on error
        set((s) => ({ favorites: [...s.favorites, existing] }))
      }
    } else {
      // Optimistic add
      const tempFavorite: Favorite = {
        id: crypto.randomUUID(),
        user_id: userId,
        product_id: productId,
        created_at: new Date().toISOString(),
      }
      set((s) => ({ favorites: [...s.favorites, tempFavorite] }))

      try {
        const newFavorite = await addFavorite(userId, productId)
        set((s) => ({
          favorites: s.favorites.map((f) =>
            f.id === tempFavorite.id ? newFavorite : f
          ),
        }))
      } catch {
        // Revert on error
        set((s) => ({
          favorites: s.favorites.filter((f) => f.id !== tempFavorite.id),
        }))
      }
    }
  },

  isFavorite: (productId) => {
    return get().favorites.some((f) => f.product_id === productId)
  },
}))
