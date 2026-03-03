import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Package,
  Heart,
  ChevronDown,
  Home,
  Grid3X3,
  ClipboardList,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import type { UserTier } from '@/types/database'
import { cn } from '@/lib/utils'

const TIER_CONFIG: Record<UserTier, { label: string; className: string }> = {
  bronze: {
    label: 'Bronze',
    className: 'bg-amber-700/10 text-amber-700 border-amber-700/20',
  },
  silver: {
    label: 'Prata',
    className: 'bg-slate-400/10 text-slate-500 border-slate-400/20',
  },
  gold: {
    label: 'Ouro',
    className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  },
}

interface MobileNavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: 'Inicio', href: '/', icon: <Home className="size-5" /> },
  { label: 'Categorias', href: '/categorias', icon: <Grid3X3 className="size-5" /> },
  { label: 'Pedidos', href: '/pedidos', icon: <ClipboardList className="size-5" /> },
  { label: 'Favoritos', href: '/favoritos', icon: <Heart className="size-5" /> },
  { label: 'Destaques', href: '/destaques', icon: <Star className="size-5" /> },
]

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigate = useNavigate()
  const { profile, logout } = useAuthStore()
  const itemCount = useCartStore((s) => s.getItemCount())

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`)
        setSearchOpen(false)
      }
    },
    [searchQuery, navigate]
  )

  const handleLogout = useCallback(async () => {
    await logout()
    navigate('/login')
  }, [logout, navigate])

  const initials = profile?.company_name
    ? profile.company_name
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase()
    : 'U'

  const tierConfig = profile?.tier ? TIER_CONFIG[profile.tier] : null

  return (
    <>
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur">
        <div className="flex h-14 items-center gap-2 px-4 md:h-16 md:gap-4 md:px-6">
          {/* Hamburger - Mobile only */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </Button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <span className="text-xl font-bold tracking-tight text-emerald-600 md:text-2xl">
              Levee
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="relative mx-4 hidden max-w-md flex-1 md:flex"
          >
            <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 pr-4"
            />
          </form>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label={searchOpen ? 'Fechar busca' : 'Abrir busca'}
            >
              {searchOpen ? (
                <X className="size-5" />
              ) : (
                <Search className="size-5" />
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/carrinho')}
              aria-label={`Carrinho com ${itemCount} itens`}
            >
              <ShoppingCart className="size-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Button>

            {/* User Dropdown - Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden gap-2 pl-2 pr-1 md:flex"
                >
                  <Avatar size="sm">
                    <AvatarFallback className="bg-emerald-600/10 text-xs font-semibold text-emerald-700">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="max-w-[120px] truncate text-sm font-medium leading-tight">
                      {profile?.company_name ?? 'Minha Conta'}
                    </span>
                    {tierConfig && (
                      <span className="text-muted-foreground text-[10px] leading-tight">
                        {tierConfig.label}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="text-muted-foreground size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                      {profile?.company_name ?? 'Minha Conta'}
                    </p>
                    {tierConfig && (
                      <Badge
                        variant="outline"
                        className={cn('w-fit text-[10px]', tierConfig.className)}
                      >
                        {tierConfig.label}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/perfil')}>
                    <User className="size-4" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/pedidos')}>
                    <Package className="size-4" />
                    Meus Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/favoritos')}>
                    <Heart className="size-4" />
                    Favoritos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                    <Settings className="size-4" />
                    Configurações
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar - Mobile (no dropdown, just link) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => navigate('/perfil')}
              aria-label="Meu perfil"
            >
              <Avatar size="sm">
                <AvatarFallback className="bg-emerald-600/10 text-xs font-semibold text-emerald-700">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        {searchOpen && (
          <div className="border-t px-4 pb-3 pt-2 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4"
                autoFocus
              />
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="border-b px-4 py-4">
            <SheetTitle className="text-left">
              <span className="text-xl font-bold tracking-tight text-emerald-600">
                Levee
              </span>
            </SheetTitle>
          </SheetHeader>

          {/* User Info Section */}
          {profile && (
            <div className="border-b px-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-emerald-600/10 font-semibold text-emerald-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {profile.company_name ?? 'Minha Conta'}
                  </span>
                  {tierConfig && (
                    <Badge
                      variant="outline"
                      className={cn(
                        'mt-0.5 w-fit text-[10px]',
                        tierConfig.className
                      )}
                    >
                      {tierConfig.label}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          <ScrollArea className="flex-1">
            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-3">
              {MOBILE_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                >
                  <span className="text-muted-foreground">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <Separator />

            {/* Quick Actions */}
            <div className="flex flex-col gap-1 p-3">
              <Link
                to="/carrinho"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:bg-accent flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="text-muted-foreground size-5" />
                  <span>Carrinho</span>
                </div>
                {itemCount > 0 && (
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                    {itemCount}
                  </Badge>
                )}
              </Link>
              <Link
                to="/configuracoes"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              >
                <Settings className="text-muted-foreground size-5" />
                Configurações
              </Link>
            </div>

            <Separator />

            {/* Logout */}
            <div className="p-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="hover:bg-destructive/10 text-destructive flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              >
                <LogOut className="size-5" />
                Sair
              </button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
