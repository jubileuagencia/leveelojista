import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ALL_STATUSES, getStatusLabel } from './OrderStatusBadge'
import type { OrderStatus } from '@/types/database'

interface OrderFiltersProps {
  search: string
  onSearchChange: (v: string) => void
  selectedStatuses: OrderStatus[]
  onStatusToggle: (status: OrderStatus) => void
  onClearStatuses: () => void
}

export function OrderFilters({
  search,
  onSearchChange,
  selectedStatuses,
  onStatusToggle,
  onClearStatuses,
}: OrderFiltersProps) {
  const hasFilters = search || selectedStatuses.length > 0

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por #pedido, empresa ou CNPJ..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 shrink-0"
            onClick={() => { onSearchChange(''); onClearStatuses() }}
          >
            <X className="size-3.5" />
            <span className="hidden sm:inline">Limpar</span>
          </Button>
        )}
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-1.5">
        {ALL_STATUSES.map((status) => {
          const isSelected = selectedStatuses.includes(status)
          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusToggle(status)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                isSelected
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted'
              )}
            >
              {getStatusLabel(status)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
