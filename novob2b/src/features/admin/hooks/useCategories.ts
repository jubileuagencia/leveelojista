import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  type CreateCategoryData,
  type UpdateCategoryData,
} from '../services/categories'

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: fetchAllCategories,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryData) => createCategory(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'categories'] })
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Categoria criada')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'categories'] })
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Categoria atualizada')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'categories'] })
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Categoria excluída')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useReorderCategories() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (orderedIds: string[]) => reorderCategories(orderedIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'categories'] })
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Ordem atualizada')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
