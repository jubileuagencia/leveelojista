import { cn } from '@/lib/utils'
import type { UserTier } from '@/types/database'

const TIER_CONFIG: Record<UserTier, { label: string; className: string }> = {
  ouro: {
    label: 'Ouro',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  platina: {
    label: 'Platina',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  diamante: {
    label: 'Diamante',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
}

export const ALL_TIERS: UserTier[] = ['ouro', 'platina', 'diamante']

export function getTierLabel(tier: UserTier): string {
  return TIER_CONFIG[tier]?.label ?? tier
}

export function TierBadge({ tier }: { tier: UserTier }) {
  const config = TIER_CONFIG[tier]
  if (!config) return null

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
