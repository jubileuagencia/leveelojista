import { supabase } from '@/lib/supabase'
import { normalizeProduct, normalizeProducts } from '@/lib/product-utils'
import type { Product, Category } from '@/types/database'

const PRODUCT_SELECT = `
  *,
  category_links:product_categories(is_primary, category:categories(*)),
  variants:product_variants(*)
`

interface ProductFilters {
  categoryId?: string
  search?: string
  isActive?: boolean
  limit?: number
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  // Filtro por categoria usa product_categories (N-N). Resolve IDs antes
  // para evitar o problema de filtros em nested relations do Supabase
  // (que retornariam só o vínculo filtrado, perdendo as outras categorias).
  let filteredIds: string[] | null = null
  if (filters?.categoryId) {
    const { data: links, error: linkError } = await supabase
      .from('product_categories')
      .select('product_id')
      .eq('category_id', filters.categoryId)

    if (linkError) {
      console.error('Error resolving category links:', linkError)
      throw new Error(`Falha ao filtrar por categoria: ${linkError.message}`)
    }

    filteredIds = (links ?? []).map((l) => l.product_id)
    if (filteredIds.length === 0) return []
  }

  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (filters?.isActive !== false) {
    query = query.eq('is_active', true)
  }

  if (filteredIds) {
    query = query.in('id', filteredIds)
  }

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    throw new Error(`Falha ao buscar produtos: ${error.message}`)
  }

  return normalizeProducts(data as never)
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching product:', error)
    throw new Error(`Falha ao buscar produto: ${error.message}`)
  }

  return normalizeProduct(data as never)
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error(`Falha ao buscar categorias: ${error.message}`)
  }

  return data ?? []
}

export async function getFeaturedCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching featured categories:', error)
    throw new Error(`Falha ao buscar categorias destaque: ${error.message}`)
  }

  return data ?? []
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return []

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .is('deleted_at', null)
    .eq('is_active', true)
    .ilike('name', `%${query.trim()}%`)
    .order('name', { ascending: true })
    .limit(20)

  if (error) {
    console.error('Error searching products:', error)
    throw new Error(`Falha ao pesquisar produtos: ${error.message}`)
  }

  return normalizeProducts(data as never)
}

export async function getLastOrderItems(userId: string): Promise<Product[]> {
  const { data: lastOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!lastOrder) return []

  const { data: orderItems, error } = await supabase
    .from('order_items')
    .select(`product:products!inner(${PRODUCT_SELECT})`)
    .eq('order_id', lastOrder.id)

  if (error) {
    console.error('Error fetching last order items:', error)
    return []
  }

  const products = (orderItems ?? [])
    .map((item) => (item as unknown as { product: unknown }).product)
    .filter((p): p is Record<string, unknown> => !!p)

  return normalizeProducts(products as never).filter(
    (p) => p.is_active && p.deleted_at === null
  )
}
