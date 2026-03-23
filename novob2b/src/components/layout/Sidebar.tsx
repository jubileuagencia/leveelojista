import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Grid3X3,
  ClipboardList,
  Heart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '/', icon: <Home className="size-5" /> },
  { label: 'Categorias', href: '/categorias', icon: <Grid3X3 className="size-5" /> },
  { label: 'Pedidos', href: '/pedidos', icon: <ClipboardList className="size-5" /> },
  { label: 'Favoritos', href: '/favoritos', icon: <Heart className="size-5" /> },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
      <aside
        className={cn(
          'bg-background relative hidden h-[calc(100vh-4rem)] sticky top-[4rem] flex-col border-r transition-all duration-300 md:flex',
          collapsed ? 'w-[68px]' : 'w-[240px]'
        )}
      >
        {/* Toggle Button */}
        <Button
          variant="outline"
          size="icon-xs"
          className="absolute -right-3 top-6 z-10 rounded-full shadow-sm"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? (
            <ChevronRight className="size-3" />
          ) : (
            <ChevronLeft className="size-3" />
          )}
        </Button>

        <ScrollArea className="flex-1 py-4">
          {/* Main Navigation */}
          <nav className="flex flex-col gap-1 px-3">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href)

              const linkContent = (
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-emerald-600/10 text-emerald-700'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    collapsed && 'justify-center px-0'
                  )}
                >
                  <span
                    className={cn(
                      'shrink-0',
                      active ? 'text-emerald-600' : ''
                    )}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                )
              }

              return <div key={item.href}>{linkContent}</div>
            })}
          </nav>
        </ScrollArea>

        {/* Footer - Version */}
        {!collapsed && (
          <div className="border-t px-4 py-3">
            <p className="text-muted-foreground text-[11px]">
              Levee B2B v1.0
            </p>
          </div>
        )}
      </aside>
  )
}
