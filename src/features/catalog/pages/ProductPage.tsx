import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Package,
  Heart,
  Tag,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { getUnitLabel, getUnitShort } from '@/lib/unit-labels'
import { useTierPrice } from '@/hooks/use-tier-price'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import { useFavoritesStore } from '@/features/favorites/stores/favorites-store'
import { getProductById } from '@/features/catalog/services/products'
import type { Product, ProductVariant } from '@/types/database'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const addItem = useCartStore((s) => s.addItem)
  const { toggleFavorite, isFavorite } = useFavoritesStore()

  const variants = useMemo(() => {
    const v = product?.variants ?? []
    return v.sort((a, b) => a.sort_order - b.sort_order)
  }, [product?.variants])

  useEffect(() => {
    async function load() {
      if (!id) return
      setLoading(true)
      try {
        const data = await getProductById(id)
        setProduct(data)
        if (data?.variants?.length) {
          const sorted = [...data.variants].sort((a, b) => a.sort_order - b.sort_order)
          const def = sorted.find((v) => v.is_default) ?? sorted[0]
          setSelectedVariant(def)
          if (def.allows_fractional) setQuantity(0.5)
        }
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const activePrice = selectedVariant?.unit_price ?? product?.price ?? 0
  const activeUnit = selectedVariant?.unit_type ?? product?.unit ?? 'un'
  const isFractional = selectedVariant?.allows_fractional ?? activeUnit === 'kg'

  const {
    finalPrice,
    originalPrice,
    hasDiscount,
    discountRate,
    tier,
  } = useTierPrice(activePrice)

  const isFav = product ? isFavorite(product.id) : false

  const handleAddToCart = async () => {
    if (!user || !product) return
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

  const handleToggleFavorite = async () => {
    if (!user || !product) return
    await toggleFavorite(user.id, product.id)
  }

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    if (variant.allows_fractional && quantity === Math.floor(quantity) && quantity <= 1) {
      setQuantity(0.5)
    } else if (!variant.allows_fractional && quantity < 1) {
      setQuantity(1)
    } else if (!variant.allows_fractional) {
      setQuantity(Math.max(1, Math.round(quantity)))
    }
  }

  const handleQuantityDelta = (delta: number) => {
    const step = isFractional ? 0.1 : 1
    const min = isFractional ? 0.1 : 1
    const d = delta > 0 ? step : -step
    setQuantity((prev) => {
      const next = Math.round((prev + d) * 10) / 10
      return Math.max(min, next)
    })
  }

  const formatQty = (q: number) => {
    if (isFractional) return q.toFixed(1).replace('.', ',')
    return String(q)
  }

  if (loading) {
    return <ProductPageSkeleton onBack={() => navigate(-1)} />
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <Package className="size-16 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold">Produto nao encontrado</h2>
        <p className="text-sm text-muted-foreground text-center">
          O produto que voce procura nao existe ou foi removido.
        </p>
        <Button onClick={() => navigate('/')}>Voltar ao catalogo</Button>
      </div>
    )
  }

  return (
    <div className="bg-background pb-36 md:pb-24">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-20 flex items-center gap-3 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-base font-semibold truncate flex-1">
          Detalhes do produto
        </h1>
        <button
          onClick={handleToggleFavorite}
          className="flex size-9 items-center justify-center rounded-full hover:bg-accent transition-colors"
        >
          <Heart
            className={cn(
              'size-5 transition-colors',
              isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
            )}
          />
        </button>
      </div>

      {/* Product content wrapper */}
      <div className="max-w-3xl mx-auto">
      {/* Product image */}
      <div className="relative aspect-square w-full bg-muted/30 overflow-hidden">
        {!imageLoaded && !imageError && product.image_url && (
          <Skeleton className="absolute inset-0 rounded-none" />
        )}
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={cn(
              'size-full object-cover',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted/50">
            <Package className="size-24 text-muted-foreground/30" />
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-emerald-500 text-white text-sm px-3 py-1 font-semibold shadow-md">
              -{Math.round(discountRate * 100)}% desconto {tier}
            </Badge>
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="px-4 pt-5 space-y-4">
        {/* Category + unit badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {product.categories?.name && (
            <Badge variant="secondary" className="text-xs">
              {product.categories.name}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {getUnitLabel(activeUnit)}
          </Badge>
          {product.sku && (
            <span className="text-xs text-muted-foreground">
              SKU {product.sku}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            Cod. {product.display_id}
          </span>
        </div>

        {/* Name */}
        <h2 className="text-2xl font-bold text-foreground leading-tight">
          {product.name}
        </h2>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Variant selector */}
        {variants.length > 1 && (
          <>
            <Separator />
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Tipo de venda
              </span>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantSelect(v)}
                    className={cn(
                      'rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all',
                      selectedVariant?.id === v.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/40'
                    )}
                  >
                    <div className="text-left">
                      <span className="block">
                        {v.unit_label ?? getUnitLabel(v.unit_type)}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatCurrency(v.unit_price)}/{getUnitShort(v.unit_type)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Pricing section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Preco
            </span>
          </div>

          {hasDiscount ? (
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-4 space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-600">
                  {formatCurrency(finalPrice)}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {getUnitShort(activeUnit)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(originalPrice)}
                </span>
                <Badge className="bg-emerald-500 text-white text-[10px]">
                  Desconto {profile?.tier?.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Voce economiza {formatCurrency(originalPrice - finalPrice)} por {getUnitShort(activeUnit)}
              </p>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                {formatCurrency(originalPrice)}
              </span>
              <span className="text-sm text-muted-foreground">
                / {getUnitShort(activeUnit)}
              </span>
            </div>
          )}
        </div>

        {/* Fractional weight alert */}
        {isFractional && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-3">
            <AlertTriangle className="size-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              O peso pode variar alguns gramas. O valor final sera ajustado conforme o peso real.
            </p>
          </div>
        )}

        <Separator />

        {/* Quantity selector */}
        <div className="space-y-3">
          <span className="text-sm font-medium text-muted-foreground">
            Quantidade {isFractional && <span className="text-xs">(em {getUnitShort(activeUnit)})</span>}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-xl border bg-muted/30">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-r-none h-10 w-10"
                onClick={() => handleQuantityDelta(-1)}
                disabled={quantity <= (isFractional ? 0.1 : 1)}
              >
                <Minus className="size-4" />
              </Button>
              <span className="min-w-[3rem] text-center text-lg font-semibold tabular-nums">
                {formatQty(quantity)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-l-none h-10 w-10"
                onClick={() => handleQuantityDelta(1)}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Total:{' '}
              <span className="font-semibold text-foreground">
                {formatCurrency(finalPrice * quantity)}
              </span>
            </div>
          </div>
        </div>

        {/* Storage/nutritional info */}
        {(product.storage_instructions || product.nutritional_info) && (
          <>
            <Separator />
            <div className="space-y-3">
              {product.storage_instructions && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Como armazenar</h3>
                  <p className="text-xs text-muted-foreground">{product.storage_instructions}</p>
                </div>
              )}
              {product.nutritional_info && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Informacao nutricional</h3>
                  <p className="text-xs text-muted-foreground whitespace-pre-line">{product.nutritional_info}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm p-4 md:pb-4">
        <div className="max-w-3xl mx-auto">
          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold gap-2 rounded-xl"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            <ShoppingCart className="size-5" />
            {isAdding ? 'Adicionando...' : 'Adicionar ao carrinho'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProductPageSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-background">
      <div className="sticky top-14 md:top-16 z-20 flex items-center gap-3 bg-background border-b px-4 py-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="size-5" />
        </Button>
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="max-w-3xl mx-auto">
        <Skeleton className="aspect-square w-full rounded-none" />
        <div className="px-4 pt-5 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Separator />
          <Skeleton className="h-10 w-32" />
          <Separator />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
