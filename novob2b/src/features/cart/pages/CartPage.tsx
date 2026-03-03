import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Package,
  ArrowRight,
  Tag,
  Percent,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { useTierPrice } from '@/hooks/use-tier-price'
import { useCartStore } from '@/stores/cart-store'
import { useAuthStore } from '@/stores/auth-store'
import { useConfigStore } from '@/stores/config-store'
import type { CartItem } from '@/types/database'

export default function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const getItemCount = useCartStore((s) => s.getItemCount)
  const profile = useAuthStore((s) => s.profile)
  const tierDiscounts = useConfigStore((s) => s.tierDiscounts)

  const itemCount = getItemCount()
  const rawTotal = getTotal()

  const tier = profile?.tier ?? 'bronze'
  const discountRate = tier === 'bronze' ? 0 : (tierDiscounts[tier] ?? 0)
  const discountAmount = rawTotal * discountRate
  const finalTotal = rawTotal - discountAmount

  return (
    <div className="bg-background pb-36 md:pb-24">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-20 flex items-center gap-3 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-base font-semibold">Carrinho</h1>
          {itemCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'item' : 'itens'}
            </p>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-8 max-w-4xl mx-auto">
          <div className="flex size-24 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="size-12 text-muted-foreground/50" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold">Carrinho vazio</h2>
            <p className="text-sm text-muted-foreground">
              Adicione produtos do catalogo para comecar seu pedido.
            </p>
          </div>
          <Button onClick={() => navigate('/')} className="gap-2">
            Ver catalogo
            <ArrowRight className="size-4" />
          </Button>
        </div>
      ) : (
        <>
          {/* Cart items - Card layout on mobile, table on desktop */}
          <div className="px-4 pt-4 max-w-4xl mx-auto">
            {/* Desktop table header */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_120px_140px_100px_40px] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b">
              <span>Produto</span>
              <span className="text-center">Preco un.</span>
              <span className="text-center">Quantidade</span>
              <span className="text-right">Total</span>
              <span />
            </div>

            <div className="space-y-3 lg:space-y-0 lg:divide-y pt-3 lg:pt-0">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Summary section */}
          <div className="px-4 pt-6 max-w-4xl mx-auto">
            <Separator className="mb-4" />

            <div className="max-w-md ml-auto space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Tag className="size-4" />
                Resumo do pedido
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({itemCount} itens)</span>
                  <span className="font-medium">{formatCurrency(rawTotal)}</span>
                </div>

                {discountRate > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <Percent className="size-3.5" />
                      Desconto {tier.toUpperCase()} ({Math.round(discountRate * 100)}%)
                    </span>
                    <span className="font-medium text-emerald-600">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              {discountRate > 0 && (
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-3">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Voce esta economizando{' '}
                    <strong>{formatCurrency(discountAmount)}</strong> com seu plano{' '}
                    <strong>{tier.toUpperCase()}</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Bottom CTA */}
      {items.length > 0 && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm p-4 md:pb-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Total do pedido</p>
              <p className="text-lg font-bold">{formatCurrency(finalTotal)}</p>
            </div>
            <Button
              size="lg"
              className="h-12 px-8 gap-2 font-semibold rounded-xl"
              onClick={() => navigate('/checkout')}
            >
              Continuar
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Cart item row - responsive (card on mobile, row on desktop)
function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const { finalPrice, originalPrice, hasDiscount } = useTierPrice(
    item.product?.price ?? 0
  )
  const lineTotal = finalPrice * item.quantity

  return (
    <>
      {/* Mobile card layout */}
      <div className="flex gap-3 rounded-xl border bg-card p-3 lg:hidden">
        <div className="size-20 shrink-0 rounded-lg overflow-hidden bg-muted/30">
          {item.product?.image_url ? (
            <img
              src={item.product.image_url}
              alt={item.product?.name}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Package className="size-8 text-muted-foreground/40" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-sm font-medium line-clamp-2 leading-tight">
                {item.product?.name ?? 'Produto'}
              </h4>
              <div className="flex items-center gap-1 mt-0.5">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {item.product?.unit}
                </Badge>
                {hasDiscount && (
                  <Badge
                    className={cn(
                      'text-[9px] px-1 py-0 h-3.5',
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                    )}
                  >
                    Desconto
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            {/* Price */}
            <div>
              {hasDiscount ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(finalPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-semibold">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>

            {/* Quantity controls */}
            <div className="flex items-center rounded-lg border bg-muted/30">
              <Button
                variant="ghost"
                size="icon-xs"
                className="rounded-r-none h-7 w-7"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="size-3" />
              </Button>
              <span className="min-w-[1.75rem] text-center text-sm font-medium tabular-nums">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                className="rounded-l-none h-7 w-7"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="size-3" />
              </Button>
            </div>
          </div>

          {/* Line total */}
          <div className="flex justify-end">
            <span className="text-sm font-bold">
              {formatCurrency(lineTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop row layout */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_120px_140px_100px_40px] gap-4 items-center px-4 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-14 shrink-0 rounded-lg overflow-hidden bg-muted/30">
            {item.product?.image_url ? (
              <img
                src={item.product.image_url}
                alt={item.product?.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <Package className="size-5 text-muted-foreground/40" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium truncate">
              {item.product?.name ?? 'Produto'}
            </h4>
            <div className="flex items-center gap-1 mt-0.5">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {item.product?.unit}
              </Badge>
            </div>
          </div>
        </div>

        {/* Unit price */}
        <div className="text-center">
          {hasDiscount ? (
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground line-through block">
                {formatCurrency(originalPrice)}
              </span>
              <span className="text-sm font-semibold text-emerald-600 block">
                {formatCurrency(finalPrice)}
              </span>
            </div>
          ) : (
            <span className="text-sm font-medium">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>

        {/* Quantity */}
        <div className="flex justify-center">
          <div className="flex items-center rounded-lg border bg-muted/30">
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-r-none h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-l-none h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Line total */}
        <div className="text-right">
          <span className="text-sm font-bold">{formatCurrency(lineTotal)}</span>
        </div>

        {/* Remove */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
