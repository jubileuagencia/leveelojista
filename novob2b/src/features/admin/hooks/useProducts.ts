import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  toggleProductActive,
  softDeleteProduct,
  bulkUpdateProducts,
  uploadProductImage,
  deleteProductImage,
  type ProductFilters,
  type CreateProductInput,
  type UpdateProductInput,
} from '../services/products'
import { fetchAllCategories } from '../services/categories'

// ── Queries ────────────────────────────────────────────

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: () => fetchProducts(filters),
  })
}

export function useProduct(id: string | null) {
  return useQuery({
    queryKey: ['admin', 'products', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: fetchAllCategories,
    staleTime: 60_000,
  })
}

// ── Mutations ──────────────────────────────────────────

export function useCreateProduct() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] })
      toast.success('Produto criado com sucesso')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) =>
      updateProduct(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] })
      toast.success('Produto atualizado com sucesso')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useToggleProductActive() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleProductActive(id, isActive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] })
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useSoftDeleteProduct() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => softDeleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] })
      toast.success('Produto excluído com sucesso')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useBulkUpdateProducts() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      ids,
      update,
    }: {
      ids: string[]
      update: { is_active?: boolean; deleted_at?: string | null }
    }) => bulkUpdateProducts(ids, update),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] })
      toast.success('Operação em massa realizada com sucesso')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useUploadProductImage() {
  return useMutation({
    mutationFn: (file: File) => uploadProductImage(file),
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useDeleteProductImage() {
  return useMutation({
    mutationFn: (imageUrl: string) => deleteProductImage(imageUrl),
  })
}
