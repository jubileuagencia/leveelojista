import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { OrdersTable } from '../components/OrdersTable'
import { OrderFilters } from '../components/OrderFilters'
import { OrderDetailsModal } from '../components/OrderDetailsModal'
import { Pagination } from '../components/Pagination'
import { ALL_STATUSES, getStatusLabel } from '../components/OrderStatusBadge'
import { useOrders, useBulkUpdateOrderStatus } from '../hooks/useOrders'
import { useDebounce } from '@/hooks/use-debounce'
import type { OrderStatus } from '@/types/database'

const PAGE_SIZE = 20

export default function OrdersPage() {
  const [search, setSearch] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([])
  const [page, setPage] = useState(1)

  const [detailOrderId, setDetailOrderId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkStatus, setBulkStatus] = useState<string>('')
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  const filters = useMemo(() => ({
    search: debouncedSearch || undefined,
    statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    page,
    pageSize: PAGE_SIZE,
  }), [debouncedSearch, selectedStatuses, page])

  const { data, isLoading } = useOrders(filters)
  const bulkUpdate = useBulkUpdateOrderStatus()

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1) }

  const handleStatusToggle = (status: OrderStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    )
    setPage(1)
  }

  const handleClearStatuses = () => {
    setSelectedStatuses([])
    setPage(1)
  }

  const handleViewDetail = (id: string) => {
    setDetailOrderId(id)
    setDetailOpen(true)
  }

  // Selection
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
      const allSelected = data.data.every((o) => prev.has(o.id))
      if (allSelected) return new Set()
      return new Set(data.data.map((o) => o.id))
    })
  }, [data?.data])

  const handleBulkConfirm = () => {
    if (!bulkStatus || selectedIds.size === 0) return
    setBulkConfirmOpen(true)
  }

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedIds.size === 0) return
    await bulkUpdate.mutateAsync({
      ids: Array.from(selectedIds),
      status: bulkStatus as OrderStatus,
    })
    setSelectedIds(new Set())
    setBulkStatus('')
    setBulkConfirmOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold lg:text-xl">Gerenciar Pedidos</h2>
        <p className="text-sm text-muted-foreground">
          {data?.total ?? 0} pedido{(data?.total ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <OrderFilters
        search={search}
        onSearchChange={handleSearchChange}
        selectedStatuses={selectedStatuses}
        onStatusToggle={handleStatusToggle}
        onClearStatuses={handleClearStatuses}
      />

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm">
          <span className="font-medium">
            {selectedIds.size} selecionado{selectedIds.size > 1 ? 's' : ''}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Select value={bulkStatus} onValueChange={setBulkStatus}>
              <SelectTrigger className="h-7 w-[140px] text-xs">
                <SelectValue placeholder="Novo status" />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleBulkConfirm}
              disabled={!bulkStatus || bulkUpdate.isPending}
            >
              Aplicar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => { setSelectedIds(new Set()); setBulkStatus('') }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <OrdersTable
        orders={data?.data ?? []}
        loading={isLoading}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onViewDetail={handleViewDetail}
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

      {/* Detail Modal */}
      <OrderDetailsModal
        orderId={detailOrderId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      {/* Bulk update confirmation */}
      <AlertDialog open={bulkConfirmOpen} onOpenChange={setBulkConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alteracao em massa</AlertDialogTitle>
            <AlertDialogDescription>
              Alterar o status de {selectedIds.size} pedido{selectedIds.size > 1 ? 's' : ''} para{' '}
              <strong>{bulkStatus ? getStatusLabel(bulkStatus as OrderStatus) : ''}</strong>?
              Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkUpdate} disabled={bulkUpdate.isPending}>
              {bulkUpdate.isPending ? 'Aplicando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
