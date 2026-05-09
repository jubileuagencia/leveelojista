import { useState, useMemo } from 'react'
import { Heart, Minus, Plus, ShoppingCart, Package, AlertTriangle, Trash2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { getUnitShort } from '@/lib/unit-labels'
import { useTierPrice } from '@/hooks/use-tier-price'
import { useCartQuantity } from '@/hooks/use-cart-quantity'
import { useCartItemController, FRACTIONAL_STEP } from '@/hooks/use-cart-item-controller'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import { useFavoritesStore } from '@/features/favorites/stores/favorites-store'
import type { Product, ProductVariant } from '@/types/database'

interface ProductCardProps {
  product: Product
  onNavigate?: (productId: string) => void
}

export function ProductCard({ product, onNavigate }: ProductCardProps) {
  const variants = useMemo(() => {
    const v = product.variants ?? []
    return v.sort((a, b) => a.sort_order - b.sort_order)
  }, [product.variants])

  const defaultVariant = useMemo(
    () => variants.find((v) => v.is_default) ?? variants[0] ?? null,
    [variants]
  )

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(defaultVariant)
  const [quantity, setQuantity] = useState(1)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const user = useAuthStore((s) => s.user)
  const addItem = useCartStore((s) => s.addItem)
  const { toggleFavorite, isFavorite } = useFavoritesStore()

  const activePrice = selectedVariant?.unit_price ?? product.price
  const activeUnit = selectedVariant?.unit_type ?? product.unit
  const isFractional = selectedVariant?.allows_fractional ?? activeUnit === 'kg'

  // Cart sync: read current quantity in cart for this product+variant
  const { quantity: quantityInCart, cartItemId } = useCartQuantity(
    product.id,
    selectedVariant?.id ?? null,
  )
  const isInCart = quantityInCart > 0

  // Centralized optimistic stepper + debounced commit (shared with ProductPage)
  const { displayQty, handleStep, handleRemove } = useCartItemController(
    cartItemId,
    quantityInCart,
    isFractional,
  )

  // Local wrappers stop event propagation so clicks on the stepper buttons
  // don't trigger the parent card's onNavigate handler.
  const onStepClick = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation()
    handleStep(delta)
  }

  const onRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    void handleRemove()
  }

  const {
    finalPrice,
    originalPrice,
    hasDiscount,
    discountRate,
  } = useTierPrice(activePrice)

  const isFav = isFavorite(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) return
    setIsAdding(true)
    try {
      await addItem(user.id, product, quantity, selectedVariant ?? undefined)
      toast.success(`${product.name} adicionado ao carrinho`)
      setQuantity(isFractional ? 0.5 : 1)
    } catch {
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
    const step = isFractional ? FRACTIONAL_STEP : 1
    const newDelta = delta > 0 ? step : -step
    setQuantity((prev) => {
      const next = Math.round((prev + newDelta) * 10) / 10
      return Math.max(step, next)
    })
  }

  const handleVariantSelect = (e: React.MouseEvent, variant: ProductVariant) => {
    e.stopPropagation()
    setSelectedVariant(variant)
    // Reset quantity when switching to/from fractional
    const nowFractional = variant.allows_fractional
    if (nowFractional && quantity === Math.floor(quantity) && quantity <= 1) {
      setQuantity(0.5)
    } else if (!nowFractional && quantity < 1) {
      setQuantity(1)
    } else if (!nowFractional) {
      setQuantity(Math.max(1, Math.round(quantity)))
    }
  }

  const formatQty = (q: number) => {
    if (isFractional) return q.toFixed(1).replace('.', ',')
    return String(q)
  }

  return (
    <div
      onClick={() => onNavigate?.(product.id)}
      aria-current={isInCart ? 'true' : undefined}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-200',
        'hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20',
        onNavigate && 'cursor-pointer',
        isInCart && 'border-primary/40 ring-1 ring-primary/10'
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

      {/* Top-left badges: in-cart marker stacks above discount.
          Compact form ("✓ N") because the grid card is small. ProductPage uses
          a verbose form ("✓ N no carrinho") on the detail page where space allows.
          Same a11y label in both for consistent screen-reader output. */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1">
        {isInCart && (
          <Badge
            aria-label={`${formatQty(displayQty)}${isFractional ? ` ${getUnitShort(activeUnit)}` : ''} no carrinho`}
            className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 font-semibold shadow-sm gap-0.5"
          >
            <Check className="size-2.5" aria-hidden="true" />
            {formatQty(displayQty)}
            {isFractional && getUnitShort(activeUnit)}
          </Badge>
        )}
        {hasDiscount && (
          <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 font-semibold shadow-sm">
            -{Math.round(discountRate * 100)}%
          </Badge>
        )}
      </div>

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
        {/* Categories + unit */}
        <div className="flex items-center gap-1 overflow-hidden">
          {product.categories && product.categories.length > 0 && (
            <>
              <span className="truncate text-[9px] font-medium text-muted-foreground uppercase tracking-wider sm:text-[10px]">
                {product.categories.slice(0, 2).map((c) => c.name).join(' · ')}
                {product.categories.length > 2 && ` +${product.categories.length - 2}`}
              </span>
              <span className="shrink-0 text-muted-foreground/30">|</span>
            </>
          )}
          <Badge variant="secondary" className="shrink-0 text-[9px] px-1 py-0 h-3.5 sm:text-[10px] sm:px-1.5 sm:h-4">
            {getUnitShort(activeUnit)}
          </Badge>
        </div>

        {/* Product name */}
        <h3 className="text-xs font-semibold leading-tight line-clamp-2 text-foreground sm:text-sm">
          {product.name}
        </h3>

        {/* Variant selector */}
        {variants.length > 1 && (
          <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={(e) => handleVariantSelect(e, v)}
                className={cn(
                  'rounded-md border px-1.5 py-0.5 text-[9px] font-medium transition-all sm:text-[10px]',
                  selectedVariant?.id === v.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/40'
                )}
              >
                {v.unit_label ?? getUnitShort(v.unit_type)}
              </button>
            ))}
          </div>
        )}

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
          {selectedVariant?.unit_label && (
            <span className="text-[9px] text-muted-foreground sm:text-[10px]">
              / {selectedVariant.unit_label}
            </span>
          )}
        </div>

        {/* Fractional weight alert */}
        {isFractional && (
          <div className="flex items-center gap-1 text-[9px] text-amber-600 sm:text-[10px]">
            <AlertTriangle className="size-3 shrink-0" />
            <span>Peso pode variar</span>
          </div>
        )}

        {/* Quantity + Add to cart — switches to in-cart stepper when item is in cart */}
        {isInCart ? (
          <div className="flex items-center gap-1.5 pt-0.5 sm:pt-1" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-1 items-center justify-between rounded-lg border border-primary/40 bg-primary/5 h-9 px-1">
              <Button
                variant="ghost"
                size="icon-xs"
                className="h-7 w-7 hover:bg-primary/10"
                onClick={(e) => onStepClick(e, -1)}
                aria-label={`Diminuir ${product.name}`}
              >
                <Minus className="size-3.5 text-primary" />
              </Button>
              <span
                aria-live="polite"
                className="min-w-[3rem] text-center text-sm font-bold tabular-nums text-primary"
              >
                {formatQty(displayQty)}
                {isFractional && (
                  <span className="ml-0.5 text-[10px] font-medium opacity-70">
                    {getUnitShort(activeUnit)}
                  </span>
                )}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                className="h-7 w-7 hover:bg-primary/10"
                onClick={(e) => onStepClick(e, 1)}
                aria-label={`Aumentar ${product.name}`}
              >
                <Plus className="size-3.5 text-primary" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={onRemoveClick}
              aria-label={`Remover ${product.name} do carrinho`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 pt-0.5 sm:flex-row sm:items-center sm:gap-2 sm:pt-1">
            <div className="flex items-center justify-center rounded-lg border bg-muted/30">
              <Button
                variant="ghost"
                size="icon-xs"
                className="rounded-r-none h-7 w-7"
                onClick={(e) => handleQuantityChange(e, -1)}
                disabled={quantity <= (isFractional ? FRACTIONAL_STEP : 1)}
                aria-label="Diminuir quantidade a adicionar"
              >
                <Minus className="size-3" />
              </Button>
              <span className="min-w-[1.75rem] text-center text-xs font-medium tabular-nums sm:min-w-[2rem] sm:text-sm">
                {formatQty(quantity)}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                className="rounded-l-none h-7 w-7"
                onClick={(e) => handleQuantityChange(e, 1)}
                aria-label="Aumentar quantidade a adicionar"
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
        )}
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
