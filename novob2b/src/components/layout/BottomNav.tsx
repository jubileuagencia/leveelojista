import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Grid3X3,
  ShoppingCart,
  ClipboardList,
  User,
} from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { cn } from '@/lib/utils'

interface BottomNavItem {
  label: string
  href: string
  icon: React.ReactNode
  showBadge?: boolean
}

const NAV_ITEMS: BottomNavItem[] = [
  {
    label: 'Inicio',
    href: '/',
    icon: <Home className="size-5" />,
  },
  {
    label: 'Categorias',
    href: '/categorias',
    icon: <Grid3X3 className="size-5" />,
  },
  {
    label: 'Carrinho',
    href: '/carrinho',
    icon: <ShoppingCart className="size-5" />,
    showBadge: true,
  },
  {
    label: 'Pedidos',
    href: '/pedidos',
    icon: <ClipboardList className="size-5" />,
  },
  {
    label: 'Perfil',
    href: '/perfil',
    icon: <User className="size-5" />,
  },
]

export function BottomNav() {
  const location = useLocation()
  const itemCount = useCartStore((s) => s.getItemCount())

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/80 fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur md:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'relative flex min-w-[56px] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors',
                active
                  ? 'text-emerald-600'
                  : 'text-muted-foreground active:text-foreground'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <span className="relative">
                <span
                  className={cn(
                    'flex items-center justify-center rounded-full p-1 transition-colors',
                    active && 'bg-emerald-600/10'
                  )}
                >
                  {item.icon}
                </span>

                {/* Cart Badge */}
                {item.showBadge && itemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold leading-none text-white">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </span>

              <span className="leading-none">{item.label}</span>

              {/* Active Indicator */}
              {active && (
                <span className="absolute -bottom-1.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-emerald-600" />
              )}
            </Link>
          )
        })}
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
