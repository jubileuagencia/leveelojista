import { useState } from 'react'
import { Heart, Minus, Plus, ShoppingCart, Package } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { useTierPrice } from '@/hooks/use-tier-price'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import { useFavoritesStore } from '@/features/favorites/stores/favorites-store'
import type { Product } from '@/types/database'

interface ProductCardProps {
  product: Product
  onNavigate?: (productId: string) => void
}

export function ProductCard({ product, onNavigate }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const user = useAuthStore((s) => s.user)
  const addItem = useCartStore((s) => s.addItem)
  const { toggleFavorite, isFavorite } = useFavoritesStore()

  const {
    finalPrice,
    originalPrice,
    hasDiscount,
    discountRate,
  } = useTierPrice(product.price)

  const isFav = isFavorite(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) return
    setIsAdding(true)
    try {
      await addItem(user.id, product, quantity)
      toast.success(`${product.name} adicionado ao carrinho`)
      setQuantity(1)
    } catch (error) {
      toast.error('Erro ao adicionar ao carrinho')
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) return
    await toggleFavorite(user.id, product.id)
  }

  const handleQuantityChange = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation()
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  return (
    <div
      onClick={() => onNavigate?.(product.id)}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-200',
        'hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20',
        onNavigate && 'cursor-pointer'
      )}
    >
      {/* Favorite button */}
      <button
        onClick={handleToggleFavorite}
        className="absolute top-2.5 right-2.5 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
      >
        <Heart
          className={cn(
            'size-4 transition-colors',
            isFav
              ? 'fill-red-500 text-red-500'
              : 'text-muted-foreground'
          )}
        />
      </button>

      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 font-semibold shadow-sm">
            -{Math.round(discountRate * 100)}%
          </Badge>
        </div>
      )}

      {/* Product image */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0 rounded-none" />
        )}
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={cn(
              'size-full object-cover transition-all duration-300 group-hover:scale-105',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted/50">
            <Package className="size-12 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col gap-1.5 p-2 sm:gap-2 sm:p-3">
        {/* Category + unit */}
        <div className="flex items-center gap-1 overflow-hidden">
          {product.categories?.name && (
            <span className="truncate text-[9px] font-medium text-muted-foreground uppercase tracking-wider sm:text-[10px]">
              {product.categories.name}
            </span>
          )}
          <span className="shrink-0 text-muted-foreground/30">|</span>
          <Badge variant="secondary" className="shrink-0 text-[9px] px-1 py-0 h-3.5 sm:text-[10px] sm:px-1.5 sm:h-4">
            {product.unit}
          </Badge>
        </div>

        {/* Product name */}
        <h3 className="text-xs font-semibold leading-tight line-clamp-2 text-foreground sm:text-sm">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mt-auto pt-0.5">
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground line-through sm:text-xs">
                {formatCurrency(originalPrice)}
              </span>
              <span className="text-base font-bold text-emerald-600 sm:text-lg">
                {formatCurrency(finalPrice)}
              </span>
            </div>
          ) : (
            <span className="text-base font-bold text-foreground sm:text-lg">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>

        {/* Quantity + Add to cart */}
        <div className="flex flex-col gap-1.5 pt-0.5 sm:flex-row sm:items-center sm:gap-2 sm:pt-1">
          <div className="flex items-center justify-center rounded-lg border bg-muted/30">
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-r-none h-7 w-7"
              onClick={(e) => handleQuantityChange(e, -1)}
              disabled={quantity <= 1}
            >
              <Minus className="size-3" />
            </Button>
            <span className="min-w-[1.5rem] text-center text-xs font-medium tabular-nums sm:min-w-[2rem] sm:text-sm">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-l-none h-7 w-7"
              onClick={(e) => handleQuantityChange(e, 1)}
            >
              <Plus className="size-3" />
            </Button>
          </div>

          <Button
            size="sm"
            className="h-8 w-full gap-1.5 text-xs font-semibold rounded-lg sm:flex-1 sm:w-auto"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            <ShoppingCart className="size-3.5" />
            <span className="sm:inline">{isAdding ? 'Aguarde...' : 'Adicionar'}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Skeleton loader for product cards
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-1.5 p-2 sm:gap-2 sm:p-3">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3 w-10 sm:w-12" />
          <Skeleton className="h-3.5 w-6 rounded-full sm:h-4 sm:w-8" />
        </div>
        <Skeleton className="h-3.5 w-full sm:h-4" />
        <Skeleton className="h-5 w-16 mt-0.5 sm:h-6 sm:w-20 sm:mt-1" />
        <div className="flex flex-col gap-1.5 pt-0.5 sm:flex-row sm:items-center sm:gap-2 sm:pt-1">
          <Skeleton className="h-7 w-full rounded-lg sm:w-24" />
          <Skeleton className="h-8 w-full rounded-lg sm:flex-1" />
        </div>
      </div>
    </div>
  )
}
