import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Search, X, Clock, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  searchProducts,
  getCategories,
} from '@/features/catalog/services/products'
import {
  ProductCard,
  ProductCardSkeleton,
} from '@/features/catalog/components/ProductCard'
import { CategoryFilter } from '@/features/catalog/components/CategoryFilter'
import type { Product, Category } from '@/types/database'

const RECENT_SEARCHES_KEY = 'levee-recent-searches'
const MAX_RECENT_SEARCHES = 5

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  try {
    const searches = getRecentSearches().filter(
      (s) => s.toLowerCase() !== query.toLowerCase()
    )
    searches.unshift(query)
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES))
    )
  } catch {
    // Silently fail if localStorage is not available
  }
}

function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch {
    // Silently fail
  }
}

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialQuery = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(initialQuery)
  const [activeQuery, setActiveQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(
    getRecentSearches
  )
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load categories on mount
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

  // Execute search
  const executeSearch = useCallback(
    async (query: string, categoryId: string | null) => {
      if (!query.trim() && !categoryId) {
        setResults([])
        setHasSearched(false)
        return
      }

      setLoading(true)
      setHasSearched(true)

      try {
        const data = await searchProducts(query.trim())

        // Filter by category client-side if a category is selected
        const filtered = categoryId
          ? data.filter((p) => p.category_id === categoryId)
          : data

        setResults(filtered)
      } catch (error) {
        console.error('Error searching products:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Search on mount if URL has ?q= parameter
  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery, null)
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim()
      setActiveQuery(trimmed)

      // Update URL
      if (trimmed) {
        setSearchParams({ q: trimmed }, { replace: true })
        saveRecentSearch(trimmed)
        setRecentSearches(getRecentSearches())
      } else {
        setSearchParams({}, { replace: true })
      }

      executeSearch(trimmed, selectedCategory)
    }, 300)
  }

  // Clear input
  const handleClear = () => {
    setInputValue('')
    setActiveQuery('')
    setResults([])
    setHasSearched(false)
    setSelectedCategory(null)
    setSearchParams({}, { replace: true })

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    inputRef.current?.focus()
  }

  // Click on a recent search chip
  const handleRecentClick = (search: string) => {
    setInputValue(search)
    setActiveQuery(search)
    setSearchParams({ q: search }, { replace: true })
    saveRecentSearch(search)
    setRecentSearches(getRecentSearches())
    executeSearch(search, selectedCategory)
  }

  // Clear recent searches
  const handleClearRecent = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  // Category filter change
  const handleCategorySelect = useCallback(
    (categoryId: string | null) => {
      setSelectedCategory(categoryId)

      // Re-filter results if we already have a query
      if (activeQuery.trim() || categoryId) {
        executeSearch(activeQuery, categoryId)
      }
    },
    [activeQuery, executeSearch]
  )

  const handleNavigateToProduct = useCallback(
    (productId: string) => {
      navigate(`/produto/${productId}`)
    },
    [navigate]
  )

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className="bg-background pb-4">
      {/* Sticky header */}
      <div className="sticky top-14 md:top-16 z-20 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-base font-semibold">Busca</h1>
        </div>

        {/* Search input */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Buscar produtos..."
              autoFocus
              className="pl-11 pr-10 h-12 text-base bg-muted/50 border-none rounded-xl focus-visible:ring-1"
            />
            {inputValue && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 size-8 text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Category filter */}
        {(activeQuery || selectedCategory) && (
          <div className="px-4 pb-3">
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategory}
              onSelect={handleCategorySelect}
              loading={categoriesLoading}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        <div className="max-w-6xl mx-auto">
          {/* Initial state - no query */}
          {!activeQuery && !hasSearched && !selectedCategory && (
            <div className="space-y-6">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-muted-foreground">
                      Buscas recentes
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                      onClick={handleClearRecent}
                    >
                      Limpar recentes
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleRecentClick(search)}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2',
                          'text-sm font-medium bg-muted/70 text-muted-foreground',
                          'hover:bg-muted hover:text-foreground transition-colors'
                        )}
                      >
                        <Clock className="size-3.5" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty prompt */}
              <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-8">
                <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                  <Search className="size-10 text-muted-foreground/50" />
                </div>
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-semibold">
                    Busque por produtos
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Digite o nome do produto que voce esta procurando
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && hasSearched && results.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {results.length}{' '}
                {results.length === 1 ? 'resultado' : 'resultados'} para{' '}
                <span className="font-medium text-foreground">
                  &apos;{activeQuery}&apos;
                </span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={handleNavigateToProduct}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {!loading && hasSearched && results.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-8">
              <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                <SearchX className="size-10 text-muted-foreground/50" />
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-lg font-semibold">
                  Nenhum produto encontrado
                </h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Nenhum produto encontrado para{' '}
                  <span className="font-medium text-foreground">
                    &apos;{activeQuery}&apos;
                  </span>
                  . Tente buscar com outros termos.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleClear}>
                Limpar busca
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
