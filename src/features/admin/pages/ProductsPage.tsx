import { useState, useCallback, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductsTable } from '../components/ProductsTable'
import { ProductFormModal } from '../components/ProductFormModal'
import { ProductFilters } from '../components/ProductFilters'
import { BulkActionsBar } from '../components/BulkActionsBar'
import { Pagination } from '../components/Pagination'
import {
  useProducts,
  useToggleProductActive,
  useSoftDeleteProduct,
  useBulkUpdateProducts,
} from '../hooks/useProducts'
import { useDebounce } from '@/hooks/use-debounce'
import type { Product } from '@/types/database'

const PAGE_SIZE = 20

export default function ProductsPage() {
  // ── Filter state ──
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  // ── Modal state ──
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // ── Selection state ──
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Debounce search to avoid excessive queries
  const debouncedSearch = useDebounce(search, 300)

  // ── Queries & mutations ──
  const filters = useMemo(() => ({
    search: debouncedSearch || undefined,
    categoryId: categoryId && categoryId !== 'all' ? categoryId : undefined,
    isActive: status === 'active' ? true : status === 'inactive' ? false : undefined,
    page,
    pageSize: PAGE_SIZE,
  }), [debouncedSearch, categoryId, status, page])

  const { data, isLoading } = useProducts(filters)
  const toggleActive = useToggleProductActive()
  const softDelete = useSoftDeleteProduct()
  const bulkUpdate = useBulkUpdateProducts()

  // Reset page when filters change
  const handleSearchChange = (v: string) => { setSearch(v); setPage(1) }
  const handleCategoryChange = (v: string) => { setCategoryId(v); setPage(1) }
  const handleStatusChange = (v: string) => { setStatus(v); setPage(1) }

  // ── Selection handlers ──
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleToggleSelectAll = useCallback(() => {
    if (!data?.data) return
    setSelectedIds((prev) => {
      const allSelected = data.data.every((p) => prev.has(p.id))
      if (allSelected) return new Set()
      return new Set(data.data.map((p) => p.id))
    })
  }, [data?.data])

  const clearSelection = () => setSelectedIds(new Set())

  // ── Edit handler ──
  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormOpen(true)
  }

  const handleNewProduct = () => {
    setEditingProduct(null)
    setFormOpen(true)
  }

  // ── Bulk action handlers ──
  const selectedArray = Array.from(selectedIds)

  const handleBulkActivate = async () => {
    await bulkUpdate.mutateAsync({ ids: selectedArray, update: { is_active: true } })
    clearSelection()
  }

  const handleBulkDeactivate = async () => {
    await bulkUpdate.mutateAsync({ ids: selectedArray, update: { is_active: false } })
    clearSelection()
  }

  const handleBulkDelete = async () => {
    await bulkUpdate.mutateAsync({
      ids: selectedArray,
      update: { deleted_at: new Date().toISOString(), is_active: false },
    })
    clearSelection()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold lg:text-xl">Gerenciar Produtos</h2>
          <p className="text-sm text-muted-foreground">
            {data?.total ?? 0} produto{(data?.total ?? 0) !== 1 ? 's' : ''} cadastrado{(data?.total ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleNewProduct} className="gap-1.5">
          <Plus className="size-4" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <ProductFilters
        search={search}
        onSearchChange={handleSearchChange}
        categoryId={categoryId}
        onCategoryChange={handleCategoryChange}
        status={status}
        onStatusChange={handleStatusChange}
      />

      {/* Bulk Actions */}
      <BulkActionsBar
        count={selectedIds.size}
        onActivate={handleBulkActivate}
        onDeactivate={handleBulkDeactivate}
        onDelete={handleBulkDelete}
        onClear={clearSelection}
        loading={bulkUpdate.isPending}
      />

      {/* Table */}
      <ProductsTable
        products={data?.data ?? []}
        loading={isLoading}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onEdit={handleEdit}
        onToggleActive={(id, isActive) => toggleActive.mutate({ id, isActive })}
        onDelete={(id) => softDelete.mutate(id)}
      />

      {/* Pagination */}
      {data && (
        <Pagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={setPage}
        />
      )}

      {/* Form Modal */}
      <ProductFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
      />
    </div>
  )
}
