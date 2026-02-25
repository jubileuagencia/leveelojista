import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  onSearch,
  placeholder = 'Buscar produtos...',
  className,
}: SearchBarProps) {
  const [value, setValue] = useState('')
  const [showRecent, setShowRecent] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowRecent(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(() => {
        onSearch(query)
        if (query.trim()) {
          saveRecentSearch(query.trim())
          setRecentSearches(getRecentSearches())
        }
      }, 300)
    },
    [onSearch]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    debouncedSearch(newValue)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
    setShowRecent(false)
  }

  const handleRecentClick = (search: string) => {
    setValue(search)
    onSearch(search)
    setShowRecent(false)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={handleChange}
          onFocus={() => {
            if (recentSearches.length > 0 && !value) {
              setShowRecent(true)
            }
          }}
          placeholder={placeholder}
          className="pl-9 pr-9 h-10 bg-muted/50 border-none focus-visible:ring-1"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon-xs"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={handleClear}
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Recent searches dropdown */}
      {showRecent && recentSearches.length > 0 && !value && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border bg-popover p-1 shadow-md">
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Buscas recentes
          </p>
          {recentSearches.map((search) => (
            <button
              key={search}
              onClick={() => handleRecentClick(search)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
            >
              <Clock className="size-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{search}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
