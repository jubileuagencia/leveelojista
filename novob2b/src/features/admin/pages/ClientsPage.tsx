import { useState, useMemo } from 'react'
import { ClientsTable } from '../components/ClientsTable'
import { ClientFilters } from '../components/ClientFilters'
import { ClientDetailsModal } from '../components/ClientDetailsModal'
import { Pagination } from '../components/Pagination'
import { useClients } from '../hooks/useClients'
import { useDebounce } from '@/hooks/use-debounce'
import type { UserTier, UserRole } from '@/types/database'

const PAGE_SIZE = 20

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [selectedTiers, setSelectedTiers] = useState<UserTier[]>([])
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([])
  const [page, setPage] = useState(1)

  const [detailClientId, setDetailClientId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  const filters = useMemo(() => ({
    search: debouncedSearch || undefined,
    tiers: selectedTiers.length > 0 ? selectedTiers : undefined,
    roles: selectedRoles.length > 0 ? selectedRoles : undefined,
    page,
    pageSize: PAGE_SIZE,
  }), [debouncedSearch, selectedTiers, selectedRoles, page])

  const { data, isLoading } = useClients(filters)

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1) }

  const handleTierToggle = (tier: UserTier) => {
    setSelectedTiers((prev) =>
      prev.includes(tier)
        ? prev.filter((t) => t !== tier)
        : [...prev, tier]
    )
    setPage(1)
  }

  const handleRoleToggle = (role: UserRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    )
    setPage(1)
  }

  const handleClearFilters = () => {
    setSelectedTiers([])
    setSelectedRoles([])
    setPage(1)
  }

  const handleViewDetail = (id: string) => {
    setDetailClientId(id)
    setDetailOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold lg:text-xl">Gerenciar Clientes</h2>
        <p className="text-sm text-muted-foreground">
          {data?.total ?? 0} cliente{(data?.total ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <ClientFilters
        search={search}
        onSearchChange={handleSearchChange}
        selectedTiers={selectedTiers}
        onTierToggle={handleTierToggle}
        selectedRoles={selectedRoles}
        onRoleToggle={handleRoleToggle}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <ClientsTable
        clients={data?.data ?? []}
        loading={isLoading}
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
      <ClientDetailsModal
        clientId={detailClientId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
