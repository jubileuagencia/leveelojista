import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, RefreshCw, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ProductCard,
  ProductCardSkeleton,
} from '@/features/catalog/components/ProductCard'
import { getCategories, getProducts } from '@/features/catalog/services/products'
import type { Category, Product } from '@/types/database'

export default function CategoriesPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState(false)
  const [productsError, setProductsError] = useState(false)

  const activeTabId = searchParams.get('categoria') ?? null
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLButtonElement>(null)

  // ── Load all categories ──
  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true)
    setCategoriesError(false)
    try {
      const data = await getCategories()
      setCategories(data)
    } catch {
      setCategoriesError(true)
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  // ── Load products for active tab ──
  const loadProducts = useCallback(async () => {
    setProductsLoading(true)
    setProductsError(false)
    try {
      const data = await getProducts({
        categoryId: activeTabId ?? undefined,
      })
      setProducts(data)
    } catch {
      setProductsError(true)
    } finally {
      setProductsLoading(false)
    }
  }, [activeTabId])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // ── Scroll active tab into view ──
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [activeTabId, categoriesLoading])

  const handleTabSelect = useCallback(
    (categoryId: string | null) => {
      if (categoryId) {
        setSearchParams({ categoria: categoryId }, { replace: true })
      } else {
        setSearchParams({}, { replace: true })
      }
    },
    [setSearchParams]
  )

  const handleNavigateToProduct = useCallback(
    (productId: string) => {
      navigate(`/produto/${productId}`)
    },
    [navigate]
  )

  const activeCategory = categories.find((c) => c.id === activeTabId)
  const pageTitle = activeCategory ? activeCategory.name : 'Todos'

  // ── Categories error ──
  if (categoriesError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-16">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <AlertTriangle className="size-8 text-muted-foreground" />
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-lg font-semibold">Erro ao carregar categorias</h3>
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">
            Tente novamente em instantes.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadCategories} className="gap-1.5">
          <RefreshCw className="size-3.5" />
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-background pb-4">
      {/* ── Header ── */}
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-2 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="md:hidden"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-xl font-bold">Explorar</h1>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sticky top-[3.5rem] md:top-[4rem] z-10 bg-background border-b">
        <div
          ref={tabsContainerRef}
          role="tablist"
          aria-label="Categorias"
          className="mx-auto max-w-7xl flex overflow-x-auto scrollbar-hide gap-0"
        >
          {categoriesLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 px-4 py-3"
              >
                <div className="h-5 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))
          ) : (
            <>
              {/* Tab "Todos" */}
              <button
                ref={activeTabId === null ? activeTabRef : undefined}
                role="tab"
                aria-selected={activeTabId === null}
                onClick={() => handleTabSelect(null)}
                className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors relative min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
                  activeTabId === null
                    ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Todos
              </button>

              {/* Category tabs */}
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  ref={activeTabId === cat.id ? activeTabRef : undefined}
                  role="tab"
                  aria-selected={activeTabId === cat.id}
                  onClick={() => handleTabSelect(cat.id)}
                  className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors relative min-h-[44px] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
                    activeTabId === cat.id
                      ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.icon ? `${cat.icon} ${cat.name}` : cat.name}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ── Products panel ── */}
      <div
        role="tabpanel"
        aria-label={`Produtos: ${pageTitle}`}
        className="mx-auto max-w-7xl px-4 md:px-6 pt-4 pb-4"
      >
        {/* Section title */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">
            {pageTitle}
          </h2>
          {!productsLoading && !productsError && (
            <span className="text-xs text-muted-foreground">
              {products.length} {products.length === 1 ? 'produto' : 'produtos'}
            </span>
          )}
        </div>

        {/* Loading */}
        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : productsError ? (
          /* Error */
          <div className="flex flex-col items-center justify-center gap-4 px-4 py-16">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <AlertTriangle className="size-8 text-muted-foreground" />
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-lg font-semibold">Erro ao carregar</h3>
              <p className="mx-auto max-w-xs text-sm text-muted-foreground">
                Nao foi possivel carregar os produtos. Tente novamente.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={loadProducts} className="gap-1.5">
              <RefreshCw className="size-3.5" />
              Tentar novamente
            </Button>
          </div>
        ) : products.length === 0 ? (
          /* Empty */
          <div className="flex flex-col items-center justify-center gap-4 px-4 py-16">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <SearchX className="size-8 text-muted-foreground" />
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-lg font-semibold">Nenhum produto nesta categoria</h3>
              <p className="mx-auto max-w-xs text-sm text-muted-foreground">
                Tente selecionar outra categoria ou veja todos os produtos.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTabSelect(null)}
              className="gap-1.5"
            >
              Ver todos
            </Button>
          </div>
        ) : (
          /* Products grid */
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
