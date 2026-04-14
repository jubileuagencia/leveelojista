import { supabase } from '@/lib/supabase'
import { normalizeProduct, normalizeProducts } from '@/lib/product-utils'
import type { Product, ProductUnit, ProductVariant } from '@/types/database'

const PRODUCT_SELECT = `
  *,
  category_links:product_categories(is_primary, category:categories(id, name)),
  variants:product_variants(*)
`

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
  /** IDs das categorias (N-N). Primeira = primária por default se primaryCategoryId não for informado. */
  categoryIds?: string[]
  primaryCategoryId?: string
  image_url?: string
  is_active?: boolean
}

export interface UpdateProductInput {
  name?: string
  description?: string
  price?: number
  unit?: ProductUnit
  /** Se definido, substitui TODAS as categorias do produto. */
  categoryIds?: string[]
  primaryCategoryId?: string
  image_url?: string | null
  is_active?: boolean
}

// ── Fetch Products (paginated + filtered) ──────────────

export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const { search, categoryId, isActive, page = 1, pageSize = 20 } = filters

  let filteredIds: string[] | null = null
  if (categoryId) {
    const { data: links, error: linkError } = await supabase
      .from('product_categories')
      .select('product_id')
      .eq('category_id', categoryId)
    if (linkError) {
      throw new Error(`Falha ao filtrar por categoria: ${linkError.message}`)
    }
    filteredIds = (links ?? []).map((l) => l.product_id)
    if (filteredIds.length === 0) {
      return { data: [], total: 0, page, pageSize }
    }
  }

  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .is('deleted_at', null)
    .order('display_id', { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,display_id.eq.${parseInt(search) || 0}`)
  }

  if (filteredIds) {
    query = query.in('id', filteredIds)
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
    data: normalizeProducts(data as never),
    total: count ?? 0,
    page,
    pageSize,
  }
}

// ── Fetch Single Product ───────────────────────────────

export async function fetchProduct(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Falha ao buscar produto: ${error.message}`)
  }

  return normalizeProduct(data as never)
}

// ── Sync categories (dual-write) ───────────────────────

function resolvePrimary(
  categoryIds: string[],
  primaryCategoryId?: string
): string | null {
  if (categoryIds.length === 0) return null
  if (primaryCategoryId && categoryIds.includes(primaryCategoryId)) {
    return primaryCategoryId
  }
  return categoryIds[0]
}

/**
 * Substitui TODAS as categorias de um produto pelas informadas.
 * Fonte única de verdade: tabela product_categories.
 */
async function syncProductCategories(
  productId: string,
  categoryIds: string[],
  primaryCategoryId?: string
): Promise<void> {
  const { error: deleteError } = await supabase
    .from('product_categories')
    .delete()
    .eq('product_id', productId)
  if (deleteError) {
    throw new Error(`Falha ao limpar categorias: ${deleteError.message}`)
  }

  if (categoryIds.length === 0) return

  const primary = resolvePrimary(categoryIds, primaryCategoryId)
  const rows = categoryIds.map((cid) => ({
    product_id: productId,
    category_id: cid,
    is_primary: cid === primary,
  }))
  const { error: insertError } = await supabase
    .from('product_categories')
    .insert(rows)
  if (insertError) {
    throw new Error(`Falha ao gravar categorias: ${insertError.message}`)
  }
}

// ── Create Product ─────────────────────────────────────

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const categoryIds = input.categoryIds ?? []

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      unit: input.unit,
      image_url: input.image_url ?? null,
      is_active: input.is_active ?? true,
    })
    .select('id')
    .single()

  if (error || !data) {
    throw new Error(`Falha ao criar produto: ${error?.message ?? 'sem retorno'}`)
  }

  if (categoryIds.length > 0) {
    await syncProductCategories(data.id, categoryIds, input.primaryCategoryId)
  }

  return fetchProduct(data.id)
}

// ── Update Product ─────────────────────────────────────

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  const { categoryIds, primaryCategoryId, ...scalarInput } = input

  if (Object.keys(scalarInput).length > 0) {
    const { error } = await supabase
      .from('products')
      .update(scalarInput)
      .eq('id', id)
    if (error) {
      throw new Error(`Falha ao atualizar produto: ${error.message}`)
    }
  }

  if (categoryIds !== undefined) {
    await syncProductCategories(id, categoryIds, primaryCategoryId)
  }

  return fetchProduct(id)
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

// ── Variants ──────────────────────────────────────────

export interface VariantInput {
  id?: string
  unit_type: string
  unit_label?: string | null
  unit_price: number
  weight_grams?: number | null
  allows_fractional: boolean
  is_default: boolean
  sort_order: number
}

export async function fetchVariants(productId: string): Promise<ProductVariant[]> {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order')

  if (error) {
    throw new Error(`Falha ao buscar variantes: ${error.message}`)
  }

  return data as ProductVariant[]
}

export async function saveVariants(
  productId: string,
  variants: VariantInput[]
): Promise<void> {
  const existing = await fetchVariants(productId)
  const existingIds = existing.map((v) => v.id)
  const inputIds = variants.filter((v) => v.id).map((v) => v.id!)

  // Delete removed variants
  const toDelete = existingIds.filter((id) => !inputIds.includes(id))
  if (toDelete.length > 0) {
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .in('id', toDelete)

    if (error) {
      throw new Error(`Falha ao remover variantes: ${error.message}`)
    }
  }

  // Upsert remaining
  const rows = variants.map((v) => ({
    ...(v.id ? { id: v.id } : {}),
    product_id: productId,
    unit_type: v.unit_type,
    unit_label: v.unit_label ?? null,
    unit_price: v.unit_price,
    weight_grams: v.weight_grams ?? null,
    allows_fractional: v.allows_fractional,
    is_default: v.is_default,
    sort_order: v.sort_order,
  }))

  const { error } = await supabase
    .from('product_variants')
    .upsert(rows, { onConflict: 'id' })

  if (error) {
    throw new Error(`Falha ao salvar variantes: ${error.message}`)
  }
}
