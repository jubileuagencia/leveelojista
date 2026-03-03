import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package,
  Zap,
  TrendingUp,
  RefreshCw,
  SearchX,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import {
  ProductCard,
  ProductCardSkeleton,
} from '@/features/catalog/components/ProductCard'
import { CategoryFilter } from '@/features/catalog/components/CategoryFilter'
import { SearchBar } from '@/features/catalog/components/SearchBar'
import {
  getProducts,
  getCategories,
  getLastOrderItems,
} from '@/features/catalog/services/products'
import { useFavoritesStore } from '@/features/favorites/stores/favorites-store'
import type { Product, Category } from '@/types/database'

const TIER_CONFIG = {
  bronze: {
    label: 'Bronze',
    color: 'bg-amber-700/10 text-amber-700 border-amber-700/20',
    icon: TrendingUp,
  },
  silver: {
    label: 'Silver',
    color: 'bg-slate-400/10 text-slate-600 border-slate-400/30',
    icon: TrendingUp,
  },
  gold: {
    label: 'Gold',
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
    icon: TrendingUp,
  },
}

export default function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const fetchFavorites = useFavoritesStore((s) => s.fetchFavorites)

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [lastOrderItems, setLastOrderItems] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [lastOrderLoading, setLastOrderLoading] = useState(true)

  // Load categories once
  useEffect(() => {
    async function loadCategories() {
      setCategoriesLoading(true)
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }
    loadCategories()
  }, [])

  // Load favorites
  useEffect(() => {
    if (user) {
      fetchFavorites(user.id)
    }
  }, [user, fetchFavorites])

  // Load last order items
  useEffect(() => {
    async function loadLastOrder() {
      if (!user) return
      setLastOrderLoading(true)
      try {
        const data = await getLastOrderItems(user.id)
        setLastOrderItems(data)
      } catch {
        // Silently fail - this is a nice-to-have feature
      } finally {
        setLastOrderLoading(false)
      }
    }
    loadLastOrder()
  }, [user])

  // Load products with filters
  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProducts({
        categoryId: selectedCategory ?? undefined,
        search: searchQuery || undefined,
      })
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId)
  }, [])

  const handleNavigateToProduct = useCallback(
    (productId: string) => {
      navigate(`/produto/${productId}`)
    },
    [navigate]
  )

  const tierInfo = TIER_CONFIG[profile?.tier ?? 'bronze']
  const TierIcon = tierInfo.icon

  const greetingName = profile?.company_name ?? 'Lojista'
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="bg-background pb-4">
      {/* Welcome header */}
      <div className="mx-auto max-w-7xl bg-gradient-to-br from-primary/5 via-background to-background px-4 pt-6 pb-4 md:px-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-sm text-muted-foreground">{greeting},</p>
            <h1 className="text-xl font-bold text-foreground truncate">
              {greetingName}
            </h1>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'shrink-0 gap-1 px-2.5 py-1 text-xs font-semibold',
              tierInfo.color
            )}
          >
            <TierIcon className="size-3" />
            {tierInfo.label}
          </Badge>
        </div>

        {/* Search bar */}
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Category filter */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-3">
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategory}
          onSelect={handleCategorySelect}
          loading={categoriesLoading}
        />
      </div>

      {/* Quick reorder section */}
      {!searchQuery && !selectedCategory && (
        <QuickReorderSection
          items={lastOrderItems}
          loading={lastOrderLoading}
          onNavigate={handleNavigateToProduct}
        />
      )}

      {/* Products section */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 pt-2 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">
            {searchQuery
              ? `Resultados para "${searchQuery}"`
              : selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name ??
                  'Categoria'
                : 'Todos os produtos'}
          </h2>
          {!loading && (
            <span className="text-xs text-muted-foreground">
              {products.length} {products.length === 1 ? 'produto' : 'produtos'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            onClear={() => {
              setSearchQuery('')
              setSelectedCategory(null)
            }}
            onRefresh={loadProducts}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={handleNavigateToProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Quick reorder section
function QuickReorderSection({
  items,
  loading,
  onNavigate,
}: {
  items: Product[]
  loading: boolean
  onNavigate: (id: string) => void
}) {
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="size-4 text-amber-500" />
          <h2 className="text-base font-semibold">Pedido rapido</h2>
        </div>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[140px] rounded-xl border bg-card"
            >
              <div className="aspect-square w-full animate-pulse bg-muted rounded-t-xl" />
              <div className="p-2 space-y-1.5">
                <div className="h-3 w-full animate-pulse bg-muted rounded" />
                <div className="h-3 w-2/3 animate-pulse bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
        <Separator className="mt-4" />
      </div>
    )
  }

  if (items.length === 0) return null

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 pb-2">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="size-4 text-amber-500" />
        <h2 className="text-base font-semibold">Pedido rapido</h2>
        <span className="text-xs text-muted-foreground ml-auto">
          Baseado no ultimo pedido
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mb-1">
        {items.map((product) => (
          <QuickReorderCard
            key={product.id}
            product={product}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <Separator className="mt-4" />
    </div>
  )
}

function QuickReorderCard({
  product,
  onNavigate,
}: {
  product: Product
  onNavigate: (id: string) => void
}) {
  const [imageError, setImageError] = useState(false)

  return (
    <button
      onClick={() => onNavigate(product.id)}
      className="shrink-0 w-[140px] rounded-xl border bg-card overflow-hidden text-left transition-all hover:shadow-md hover:border-primary/20"
    >
      <div className="aspect-square w-full bg-muted/30 overflow-hidden">
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImageError(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted/50">
            <Package className="size-8 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-medium line-clamp-2 leading-tight">
          {product.name}
        </p>
      </div>
    </button>
  )
}

// Empty state
function EmptyState({
  searchQuery,
  onClear,
  onRefresh,
}: {
  searchQuery: string
  onClear: () => void
  onRefresh: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 gap-4">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <SearchX className="size-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold">Nenhum produto encontrado</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {searchQuery
            ? `Nao encontramos resultados para "${searchQuery}". Tente buscar com outros termos.`
            : 'Nao ha produtos disponiveis nesta categoria.'}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onClear} className="gap-1.5">
          Limpar filtros
        </Button>
        <Button variant="outline" size="sm" onClick={onRefresh} className="gap-1.5">
          <RefreshCw className="size-3.5" />
          Atualizar
        </Button>
      </div>
    </div>
  )
}
