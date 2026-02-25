import { supabase } from '@/lib/supabase'
import type { Product, Category } from '@/types/database'

interface ProductFilters {
  categoryId?: string
  search?: string
  isActive?: boolean
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, categories(*)')
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (filters?.isActive !== false) {
    query = query.eq('is_active', true)
  }

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    throw new Error(`Falha ao buscar produtos: ${error.message}`)
  }

  return (data as Product[]) ?? []
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching product:', error)
    throw new Error(`Falha ao buscar produto: ${error.message}`)
  }

  return data as Product
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error(`Falha ao buscar categorias: ${error.message}`)
  }

  return data ?? []
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return []

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .is('deleted_at', null)
    .eq('is_active', true)
    .ilike('name', `%${query.trim()}%`)
    .order('name', { ascending: true })
    .limit(20)

  if (error) {
    console.error('Error searching products:', error)
    throw new Error(`Falha ao pesquisar produtos: ${error.message}`)
  }

  return (data as Product[]) ?? []
}

export async function getLastOrderItems(userId: string): Promise<Product[]> {
  const { data: lastOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!lastOrder) return []

  const { data: orderItems, error } = await supabase
    .from('order_items')
    .select('product:products(*, categories(*))')
    .eq('order_id', lastOrder.id)

  if (error) {
    console.error('Error fetching last order items:', error)
    return []
  }

  return (orderItems
    ?.map((item) => (item as unknown as { product: Product }).product)
    .filter(Boolean) ?? []) as Product[]
}
