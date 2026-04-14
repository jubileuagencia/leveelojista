import type { Category, Product } from '@/types/database'

type RawCategoryLink = {
  is_primary: boolean
  category: Category | null
}

type RawProduct = Omit<Product, 'categories' | 'primaryCategory'> & {
  category_links?: RawCategoryLink[] | null
}

/**
 * Normaliza um produto retornado do Supabase (com `category_links` aninhado
 * via product_categories) em um objeto com `categories: Category[]` e
 * `primaryCategory: Category | null`.
 *
 * Ver ADR LV-117 seção 6.
 */
export function normalizeProduct(raw: RawProduct): Product {
  const links = raw.category_links ?? []
  const categories = links
    .map((l) => l.category)
    .filter((c): c is Category => c !== null)
  const primary =
    links.find((l) => l.is_primary)?.category ?? categories[0] ?? null

  const { category_links, ...rest } = raw
  void category_links
  return {
    ...rest,
    categories,
    primaryCategory: primary,
  }
}

export function normalizeProducts(rows: RawProduct[] | null | undefined): Product[] {
  return (rows ?? []).map(normalizeProduct)
}
