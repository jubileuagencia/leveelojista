import { cn } from '@/lib/utils'
import type { UserRole } from '@/types/database'

const ROLE_CONFIG: Record<UserRole, { label: string; className: string }> = {
  customer: {
    label: 'Cliente',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  admin: {
    label: 'Admin',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  super_admin: {
    label: 'Super Admin',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
}

export const ALL_ROLES: UserRole[] = ['customer', 'admin', 'super_admin']

export function getRoleLabel(role: UserRole): string {
  return ROLE_CONFIG[role]?.label ?? role
}

export function RoleBadge({ role }: { role: UserRole }) {
  const config = ROLE_CONFIG[role]
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
