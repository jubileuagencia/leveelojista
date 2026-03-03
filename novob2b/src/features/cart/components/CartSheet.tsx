import { useNavigate } from 'react-router-dom'
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Package,
  ArrowRight,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { useTierPrice } from '@/hooks/use-tier-price'
import { useCartStore } from '@/stores/cart-store'
import { useAuthStore } from '@/stores/auth-store'
import type { CartItem } from '@/types/database'

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const getItemCount = useCartStore((s) => s.getItemCount)

  const itemCount = getItemCount()
  const total = getTotal()

  const handleCheckout = () => {
    onOpenChange(false)
    navigate('/checkout')
  }

  const handleViewCart = () => {
    onOpenChange(false)
    navigate('/carrinho')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col p-0 w-full sm:max-w-md">
        <SheetHeader className="px-4 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-lg">Carrinho</SheetTitle>
              {itemCount > 0 && (
                <Badge variant="secondary" className="text-xs px-2">
                  {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                </Badge>
              )}
            </div>
          </div>
          <SheetDescription className="text-xs">
            Revise seus itens antes de finalizar o pedido
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-2" />

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-10 text-muted-foreground/50" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-semibold">Carrinho vazio</h3>
              <p className="text-sm text-muted-foreground">
                Adicione produtos do catalogo para comecar seu pedido.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                navigate('/')
              }}
            >
              Ver catalogo
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-3 pb-4">
                {items.map((item) => (
                  <CartSheetItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="border-t px-4 py-4 space-y-3 flex-col">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">{formatCurrency(total)}</span>
              </div>

              <Button
                className="w-full h-11 gap-2 font-semibold rounded-xl"
                onClick={handleCheckout}
              >
                Finalizar Pedido
                <ArrowRight className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground"
                onClick={handleViewCart}
              >
                Ver carrinho completo
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function CartSheetItem({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const profile = useAuthStore((s) => s.profile)

  const { finalPrice, hasDiscount } = useTierPrice(item.product?.price ?? 0)
  const lineTotal = finalPrice * item.quantity

  return (
    <div className="flex gap-3 rounded-xl border bg-card p-3">
      {/* Product image */}
      <div className="size-16 shrink-0 rounded-lg overflow-hidden bg-muted/30">
        {item.product?.image_url ? (
          <img
            src={item.product.image_url}
            alt={item.product.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Package className="size-6 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium line-clamp-2 leading-tight">
            {item.product?.name ?? 'Produto'}
          </h4>
          <Button
            variant="ghost"
            size="icon-xs"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          {hasDiscount && (
            <Badge
              variant="secondary"
              className={cn(
                'text-[9px] px-1 py-0 h-3.5',
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
              )}
            >
              {profile?.tier?.toUpperCase()}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {item.product?.unit}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center rounded-md border bg-muted/30">
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-r-none h-6 w-6"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="size-3" />
            </Button>
            <span className="min-w-[1.5rem] text-center text-xs font-medium tabular-nums">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-l-none h-6 w-6"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="size-3" />
            </Button>
          </div>

          {/* Line total */}
          <span className="text-sm font-semibold">
            {formatCurrency(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  )
}
