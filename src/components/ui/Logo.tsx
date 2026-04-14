import { cn } from '@/lib/utils'

const SIZES = {
  xs: 'size-6',
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-16',
  xl: 'size-24',
} as const

type LogoSize = keyof typeof SIZES

interface LogoProps {
  size?: LogoSize
  withText?: boolean
  textClassName?: string
  className?: string
}

export function Logo({ size = 'md', withText = false, textClassName, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <img
        src="/logo.png"
        alt="Levee"
        className={cn(SIZES[size], 'shrink-0 object-contain')}
      />
      {withText && (
        <span
          className={cn(
            'font-bold tracking-tight text-emerald-600',
            size === 'xs' && 'text-sm',
            size === 'sm' && 'text-base',
            size === 'md' && 'text-xl',
            size === 'lg' && 'text-2xl',
            size === 'xl' && 'text-4xl',
            textClassName
          )}
        >
          Levee
        </span>
      )}
    </span>
  )
}
