'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Product, ProductInsert, ProductUpdate } from '@/types';

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  categoryId?: string;
}

export function useProducts(params: ProductsParams = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'active', categoryId = '' } = params;

  const queryParams = new URLSearchParams();
  queryParams.set('page', String(page));
  queryParams.set('pageSize', String(pageSize));
  if (search) queryParams.set('search', search);
  if (status) queryParams.set('status', status);
  if (categoryId) queryParams.set('categoryId', categoryId);

  return useQuery({
    queryKey: ['products', { page, pageSize, search, status, categoryId }],
    queryFn: () => api.get<ProductsResponse>(`/products?${queryParams.toString()}`),
    staleTime: 30 * 1000,
  });
}

export function useProduct(productId: string | null) {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: () => api.get<Product>(`/products/${productId}`),
    enabled: !!productId,
    staleTime: 60 * 1000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ProductInsert) => api.post<Product>('/products', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, body }: { productId: string; body: ProductUpdate }) =>
      api.patch<Product>(`/products/${productId}`, body),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', productId] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => api.delete(`/products/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useBulkProductAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { ids: string[]; action: 'activate' | 'deactivate' | 'delete' }) =>
      api.post('/products/bulk', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
