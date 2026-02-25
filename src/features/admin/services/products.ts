import { supabase } from '@/lib/supabase'
import type { Product, ProductUnit } from '@/types/database'

// ── Types ──────────────────────────────────────────────

export interface ProductFilters {
  search?: string
  categoryId?: string
  isActive?: boolean
  page?: number
  pageSize?: number
}

export interface ProductsResponse {
  data: Product[]
  total: number
  page: number
  pageSize: number
}

export interface CreateProductInput {
  name: string
  description?: string
  price: number
  unit: ProductUnit
  category_id?: string
  image_url?: string
  is_active?: boolean
}

export interface UpdateProductInput {
  name?: string
  description?: string
  price?: number
  unit?: ProductUnit
  category_id?: string | null
  image_url?: string | null
  is_active?: boolean
}

// ── Fetch Products (paginated + filtered) ──────────────

export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const { search, categoryId, isActive, page = 1, pageSize = 20 } = filters

  let query = supabase
    .from('products')
    .select('*, categories(id, name)', { count: 'exact' })
    .is('deleted_at', null)
    .order('display_id', { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,display_id.eq.${parseInt(search) || 0}`)
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  if (isActive !== undefined) {
    query = query.eq('is_active', isActive)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Falha ao buscar produtos: ${error.message}`)
  }

  return {
    data: (data as unknown as Product[]) ?? [],
    total: count ?? 0,
    page,
    pageSize,
  }
}

// ── Fetch Single Product ───────────────────────────────

export async function fetchProduct(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name)')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Falha ao buscar produto: ${error.message}`)
  }

  return data as unknown as Product
}

// ── Create Product ─────────────────────────────────────

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      unit: input.unit,
      category_id: input.category_id ?? null,
      image_url: input.image_url ?? null,
      is_active: input.is_active ?? true,
    })
    .select('*, categories(id, name)')
    .single()

  if (error) {
    throw new Error(`Falha ao criar produto: ${error.message}`)
  }

  return data as unknown as Product
}

// ── Update Product ─────────────────────────────────────

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(input)
    .eq('id', id)
    .select('*, categories(id, name)')
    .single()

  if (error) {
    throw new Error(`Falha ao atualizar produto: ${error.message}`)
  }

  return data as unknown as Product
}

// ── Toggle Active ──────────────────────────────────────

export async function toggleProductActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    throw new Error(`Falha ao alterar status do produto: ${error.message}`)
  }
}

// ── Soft Delete ────────────────────────────────────────

export async function softDeleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq('id', id)

  if (error) {
    throw new Error(`Falha ao excluir produto: ${error.message}`)
  }
}

// ── Bulk Update Status ─────────────────────────────────

export async function bulkUpdateProducts(
  ids: string[],
  update: { is_active?: boolean; deleted_at?: string | null }
): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update(update)
    .in('id', ids)

  if (error) {
    throw new Error(`Falha na operação em massa: ${error.message}`)
  }
}

// ── Image Upload ───────────────────────────────────────

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${ext}`
  const path = `products/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Falha no upload da imagem: ${uploadError.message}`)
  }

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(path)

  return urlData.publicUrl
}

// ── Image Delete ───────────────────────────────────────

export async function deleteProductImage(imageUrl: string): Promise<void> {
  const path = imageUrl.split('/product-images/')[1]
  if (!path) return

  const { error } = await supabase.storage
    .from('product-images')
    .remove([path])

  if (error) {
    console.error('Falha ao deletar imagem:', error)
  }
}
