'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts, useBulkProductAction } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { ProductFilters } from '@/components/features/products/product-filters';
import { ProductsTable } from '@/components/features/products/products-table';
import { ProductFormModal } from '@/components/features/products/product-form-modal';
import { BulkActionsBar } from '@/components/features/products/bulk-actions-bar';
import type { Product } from '@/types';

export default function ProductsPage() {
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'all'>('active');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Data
  const { data, isLoading } = useProducts({ page, search, status, categoryId });
  const { data: categories } = useCategories();
  const bulkAction = useBulkProductAction();

  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  // Reset page when filters change
  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
    setSelectedIds(new Set());
  }, []);

  const handleStatusChange = useCallback((v: 'active' | 'inactive' | 'all') => {
    setStatus(v);
    setPage(1);
    setSelectedIds(new Set());
  }, []);

  const handleCategoryChange = useCallback((v: string) => {
    setCategoryId(v);
    setPage(1);
    setSelectedIds(new Set());
  }, []);

  async function handleBulkAction(action: 'activate' | 'deactivate' | 'delete') {
    const ids = Array.from(selectedIds);
    const labels = { activate: 'ativados', deactivate: 'desativados', delete: 'excluidos' };

    try {
      await bulkAction.mutateAsync({ ids, action });
      toast.success(`${ids.length} produto(s) ${labels[action]}`);
      setSelectedIds(new Set());
    } catch {
      toast.error('Erro na operacao em massa');
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          {!isLoading && (
            <p className="text-sm text-muted-foreground">{total} produto(s) encontrado(s)</p>
          )}
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <ProductFilters
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        categoryId={categoryId}
        onCategoryChange={handleCategoryChange}
        categories={categories ?? []}
      />

      {/* Table */}
      <ProductsTable
        products={products}
        loading={isLoading}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={setEditProduct}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Pagina {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Proxima
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProductFormModal open={createOpen} onOpenChange={setCreateOpen} />
      <ProductFormModal
        product={editProduct}
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
      />

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        count={selectedIds.size}
        onActivate={() => handleBulkAction('activate')}
        onDeactivate={() => handleBulkAction('deactivate')}
        onDelete={() => handleBulkAction('delete')}
        onClear={() => setSelectedIds(new Set())}
        loading={bulkAction.isPending}
      />
    </div>
  );
}
