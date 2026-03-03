import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  icon: LucideIcon
  iconColor?: string
  loading?: boolean
}

export function MetricCard({ title, value, icon: Icon, iconColor = 'text-primary', loading }: MetricCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-4 shadow-sm lg:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-muted lg:w-24" />
            <div className="h-7 w-24 animate-pulse rounded bg-muted lg:h-8 lg:w-32" />
          </div>
          <div className="size-10 shrink-0 animate-pulse rounded-lg bg-muted lg:size-12" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground lg:text-sm">{title}</p>
          <p className="mt-1 truncate text-xl font-bold tracking-tight lg:text-2xl">{value}</p>
        </div>
        <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/50 lg:size-12', iconColor)}>
          <Icon className="size-5 lg:size-6" />
        </div>
      </div>
    </div>
  )
}
