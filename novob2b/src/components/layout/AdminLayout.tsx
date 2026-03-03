import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Tag,
  BarChart3,
  LogOut,
  ArrowLeft,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

interface AdminNavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard className="size-5" />,
  },
  {
    label: 'Produtos',
    href: '/admin/produtos',
    icon: <Package className="size-5" />,
  },
  {
    label: 'Pedidos',
    href: '/admin/pedidos',
    icon: <ClipboardList className="size-5" />,
  },
  {
    label: 'Clientes',
    href: '/admin/clientes',
    icon: <Users className="size-5" />,
  },
  {
    label: 'Categorias',
    href: '/admin/categorias',
    icon: <Tag className="size-5" />,
  },
  {
    label: 'Relatórios',
    href: '/admin/relatorios',
    icon: <BarChart3 className="size-5" />,
  },
  {
    label: 'Configurações',
    href: '/admin/configuracoes',
    icon: <Settings className="size-5" />,
  },
]

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, loading, initialized, initialize, logout } =
    useAuthStore()

  // Initialize auth
  useEffect(() => {
    initialize()
  }, [initialize])

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (initialized && !loading) {
      if (!user) {
        navigate('/login', { replace: true })
        return
      }
      if (profile && profile.role !== 'admin' && profile.role !== 'super_admin') {
        navigate('/', { replace: true })
      }
    }
  }, [initialized, loading, user, profile, navigate])

  // Close mobile sheet on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(href)
  }

  const initials = profile?.company_name
    ? profile.company_name
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase()
    : 'A'

  // Loading state
  if (!initialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-2xl font-bold tracking-tight text-emerald-600">
            Levee
          </span>
          <span className="text-muted-foreground text-sm">
            Carregando painel administrativo...
          </span>
          <div className="size-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <p className="text-xs text-muted-foreground/60">Verificando permissoes de acesso</p>
        </div>
      </div>
    )
  }

  // Not authorized
  if (
    !user ||
    !profile ||
    (profile.role !== 'admin' && profile.role !== 'super_admin')
  ) {
    return null
  }

  // Shared sidebar content (used in both desktop aside and mobile Sheet)
  const sidebarNav = (
    <nav className="flex flex-col gap-1 px-3">
      {ADMIN_NAV_ITEMS.map((item) => {
        const active = isActive(item.href)

        const linkContent = (
          <Link
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-emerald-600/10 text-emerald-700'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              collapsed && 'lg:justify-center lg:px-0'
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
            <span className={cn('flex-1', collapsed && 'lg:hidden')}>
              {item.label}
            </span>
            {item.badge && (
              <Badge className={cn('bg-emerald-600 text-white hover:bg-emerald-600', collapsed && 'lg:hidden')}>
                {item.badge}
              </Badge>
            )}
          </Link>
        )

        if (collapsed) {
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
              <TooltipContent side="right" className="hidden lg:block">
                {item.label}
              </TooltipContent>
            </Tooltip>
          )
        }

        return <div key={item.href}>{linkContent}</div>
      })}
    </nav>
  )

  const sidebarFooter = (
    <div className="border-t">
      {/* User Section */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3',
          collapsed && 'lg:justify-center lg:px-2'
        )}
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-emerald-600/10 text-xs font-semibold text-emerald-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className={cn('flex min-w-0 flex-1 flex-col', collapsed && 'lg:hidden')}>
          <span className="truncate text-sm font-medium">
            {profile.company_name ?? 'Admin'}
          </span>
          <span className="text-muted-foreground text-[11px]">
            {profile.role === 'super_admin'
              ? 'Super Admin'
              : 'Administrador'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleLogout}
          aria-label="Sair"
          className={cn('text-muted-foreground hover:text-destructive shrink-0', collapsed && 'lg:hidden')}
        >
          <LogOut className="size-3.5" />
        </Button>
      </div>
    </div>
  )

  return (
    <TooltipProvider delayDuration={0}>
      <div className="bg-muted/30 flex min-h-screen">
        {/* ── Mobile Sidebar (Sheet) ── */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[280px] p-0 lg:hidden" showCloseButton={false}>
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            {/* Header */}
            <div className="flex h-16 items-center gap-3 border-b px-4">
              <span className="text-xl font-bold tracking-tight text-emerald-600">
                Levee
              </span>
              <Badge
                variant="secondary"
                className="text-[10px] font-semibold uppercase"
              >
                Admin
              </Badge>
            </div>

            {/* Back to Store */}
            <div className="border-b px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground w-full justify-start gap-2"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="size-4" />
                Voltar à loja
              </Button>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-3">
              {sidebarNav}
            </ScrollArea>

            {/* Footer */}
            {sidebarFooter}
          </SheetContent>
        </Sheet>

        {/* ── Desktop Sidebar (fixed) ── */}
        <aside
          className={cn(
            'bg-background fixed inset-y-0 left-0 z-30 hidden flex-col border-r transition-all duration-300 lg:flex',
            collapsed ? 'w-[68px]' : 'w-[260px]'
          )}
        >
          {/* Header */}
          <div
            className={cn(
              'flex h-16 items-center border-b px-4',
              collapsed ? 'justify-center' : 'gap-3'
            )}
          >
            {!collapsed && (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-emerald-600">
                  Levee
                </span>
                <Badge
                  variant="secondary"
                  className="text-[10px] font-semibold uppercase"
                >
                  Admin
                </Badge>
              </div>
            )}
            {collapsed && (
              <span className="text-lg font-bold text-emerald-600">L</span>
            )}
          </div>

          {/* Back to Store */}
          <div className="border-b px-3 py-2">
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="w-full"
                    onClick={() => navigate('/')}
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Voltar à loja</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground w-full justify-start gap-2"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="size-4" />
                Voltar à loja
              </Button>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-3">
            {sidebarNav}
          </ScrollArea>

          {/* Footer */}
          {sidebarFooter}

          <Separator />

          {/* Collapse Toggle */}
          <div className="flex items-center justify-center py-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              {collapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main
          className={cn(
            'min-w-0 flex-1 overflow-x-hidden transition-all duration-300',
            collapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]'
          )}
        >
          {/* Top Bar */}
          <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-20 flex h-14 items-center border-b px-4 backdrop-blur lg:h-16 lg:px-6">
            <div className="flex flex-1 items-center gap-3">
              {/* Mobile hamburger */}
              <Button
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu className="size-5" />
              </Button>

              <h1 className="text-base font-semibold lg:text-lg">
                {getPageTitle(location.pathname)}
              </h1>

              <div className="text-muted-foreground ml-auto hidden text-sm sm:block">
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}

function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/produtos': 'Produtos',
    '/admin/pedidos': 'Pedidos',
    '/admin/clientes': 'Clientes',
    '/admin/categorias': 'Categorias',
    '/admin/relatorios': 'Relatórios',
    '/admin/configuracoes': 'Configurações',
  }

  // Check exact matches first
  if (titles[pathname]) return titles[pathname]

  // Check prefix matches for nested routes
  for (const [path, title] of Object.entries(titles)) {
    if (pathname.startsWith(path + '/')) return title
  }

  return 'Painel Administrativo'
}
