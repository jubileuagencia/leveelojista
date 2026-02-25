import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ALL_TIERS, getTierLabel } from './TierBadge'
import { ALL_ROLES, getRoleLabel } from './RoleBadge'
import type { UserTier, UserRole } from '@/types/database'

interface ClientFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  selectedTiers: UserTier[]
  onTierToggle: (tier: UserTier) => void
  selectedRoles: UserRole[]
  onRoleToggle: (role: UserRole) => void
  onClearFilters: () => void
}

export function ClientFilters({
  search,
  onSearchChange,
  selectedTiers,
  onTierToggle,
  selectedRoles,
  onRoleToggle,
  onClearFilters,
}: ClientFiltersProps) {
  const hasFilters = selectedTiers.length > 0 || selectedRoles.length > 0

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou CNPJ..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tier chips */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Tier</span>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TIERS.map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => onTierToggle(tier)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                selectedTiers.includes(tier)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted'
              )}
            >
              {getTierLabel(tier)}
            </button>
          ))}
        </div>
      </div>

      {/* Role chips */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Papel</span>
        <div className="flex flex-wrap gap-1.5">
          {ALL_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => onRoleToggle(role)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                selectedRoles.includes(role)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted'
              )}
            >
              {getRoleLabel(role)}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClearFilters}>
          <X className="mr-1 size-3" />
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
