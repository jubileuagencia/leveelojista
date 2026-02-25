import { useRef } from 'react'
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/database'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategoryId: string | null
  onSelect: (categoryId: string | null) => void
  loading?: boolean
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelect,
  loading = false,
}: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 200
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  if (loading) {
    return (
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Scroll buttons - visible on hover / desktop */}
      <Button
        variant="outline"
        size="icon-xs"
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 hidden rounded-full shadow-sm md:group-hover:flex bg-background"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="size-3" />
      </Button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-1 -mb-1"
      >
        {/* All categories chip */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            'inline-flex items-center gap-1.5 shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all',
            selectedCategoryId === null
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <LayoutGrid className="size-3.5" />
          Todos
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              'inline-flex items-center gap-1.5 shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all',
              selectedCategoryId === category.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {category.icon && <span className="text-base">{category.icon}</span>}
            {category.name}
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon-xs"
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden rounded-full shadow-sm md:group-hover:flex bg-background"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="size-3" />
      </Button>
    </div>
  )
}
