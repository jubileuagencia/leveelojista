import { supabase } from '@/lib/supabase'
import { normalizeProduct } from '@/lib/product-utils'
import type { Favorite } from '@/types/database'

function normalizeFavorite(f: Favorite): Favorite {
  if (!f.product) return f
  return { ...f, product: normalizeProduct(f.product as never) }
}

export async function getFavorites(userId: string): Promise<Favorite[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('*, product:products(*, category_links:product_categories(is_primary, category:categories(*)))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error)
    throw new Error(`Falha ao buscar favoritos: ${error.message}`)
  }

  return ((data as Favorite[]) ?? []).map(normalizeFavorite)
}

export async function addFavorite(
  userId: string,
  productId: string
): Promise<Favorite> {
  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, product_id: productId })
    .select('*, product:products(*, category_links:product_categories(is_primary, category:categories(*)))')
    .single()

  if (error) {
    console.error('Error adding favorite:', error)
    throw new Error(`Falha ao adicionar favorito: ${error.message}`)
  }

  return normalizeFavorite(data as Favorite)
}

export async function removeFavorite(
  userId: string,
  productId: string
): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) {
    console.error('Error removing favorite:', error)
    throw new Error(`Falha ao remover favorito: ${error.message}`)
  }
}
