import { supabase } from '@/lib/supabase'
import type { Category } from '@/types/database'

// ── Fetch All Categories ───────────────────────────────

export async function fetchAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Falha ao buscar categorias: ${error.message}`)
  }

  return data ?? []
}

// ── Create Category ────────────────────────────────────

export interface CreateCategoryData {
  name: string
  icon?: string
  color?: string
}

export async function createCategory(data: CreateCategoryData): Promise<void> {
  // Get max sort_order to append at end
  const { data: last } = await supabase
    .from('categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const { error } = await supabase
    .from('categories')
    .insert({ ...data, sort_order: (last?.sort_order ?? 0) + 1 })

  if (error) {
    throw new Error(`Falha ao criar categoria: ${error.message}`)
  }
}

// ── Update Category ────────────────────────────────────

export interface UpdateCategoryData {
  name?: string
  icon?: string
  color?: string
}

export async function updateCategory(id: string, data: UpdateCategoryData): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .update(data)
    .eq('id', id)

  if (error) {
    throw new Error(`Falha ao atualizar categoria: ${error.message}`)
  }
}

// ── Delete Category ────────────────────────────────────

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Falha ao excluir categoria: ${error.message}`)
  }
}

// ── Reorder Categories ─────────────────────────────────

export async function reorderCategories(orderedIds: string[]): Promise<void> {
  // Update sort_order for each category based on position
  const updates = orderedIds.map((id, index) =>
    supabase
      .from('categories')
      .update({ sort_order: index + 1 })
      .eq('id', id)
  )

  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)

  if (failed?.error) {
    throw new Error(`Falha ao reordenar categorias: ${failed.error.message}`)
  }
}
