import { useNavigate } from 'react-router-dom'
import { Package, ChevronRight, QrCode, Barcode } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate, formatOrderNumber } from '@/lib/format'
import { OrderStatusBadge } from './OrderStatusBadge'
import type { Order } from '@/types/database'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate()

  const itemCount = order.items?.length ?? 0
  const productImages = (order.items ?? [])
    .slice(0, 3)
    .map((item) => ({
      url: item.product?.image_url,
      name: item.product?.name ?? 'Produto',
    }))

  const handleClick = () => {
    navigate(`/pedido/${order.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full text-left rounded-xl border bg-card p-4 transition-all duration-200',
        'hover:shadow-md hover:shadow-primary/5 hover:border-primary/20',
        'active:scale-[0.99] cursor-pointer'
      )}
    >
      {/* Top row: order number + status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base font-bold text-foreground tabular-nums">
            {formatOrderNumber(order.order_number)}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </div>

      {/* Date + payment */}
      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
        <span>{formatDate(order.created_at)}</span>
        <span className="text-muted-foreground/30">|</span>
        <span className="flex items-center gap-1">
          {order.payment_method === 'pix' ? (
            <QrCode className="size-3" />
          ) : (
            <Barcode className="size-3" />
          )}
          {order.payment_method === 'pix' ? 'PIX' : 'Boleto'}
        </span>
        <span className="text-muted-foreground/30">|</span>
        <span>
          {itemCount} {itemCount === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {/* Bottom row: product images + total */}
      <div className="flex items-center justify-between mt-3">
        {/* Product images */}
        <div className="flex items-center -space-x-2">
          {productImages.map((img, index) => (
            <div
              key={index}
              className={cn(
                'size-9 rounded-full border-2 border-card bg-muted/50 overflow-hidden shrink-0',
                'flex items-center justify-center'
              )}
              style={{ zIndex: productImages.length - index }}
            >
              {img.url ? (
                <img
                  src={img.url}
                  alt={img.name}
                  className="size-full object-cover"
                />
              ) : (
                <Package className="size-4 text-muted-foreground/40" />
              )}
            </div>
          ))}
          {itemCount > 3 && (
            <div className="size-9 rounded-full border-2 border-card bg-muted flex items-center justify-center shrink-0">
              <span className="text-[10px] font-medium text-muted-foreground">
                +{itemCount - 3}
              </span>
            </div>
          )}
        </div>

        {/* Total */}
        <span className="text-base font-bold text-foreground tabular-nums">
          {formatCurrency(order.total)}
        </span>
      </div>
    </button>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-14 rounded-md bg-accent animate-pulse" />
          <div className="h-5 w-20 rounded-full bg-accent animate-pulse" />
        </div>
        <div className="h-4 w-4 rounded bg-accent animate-pulse" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-3 w-20 rounded bg-accent animate-pulse" />
        <div className="h-3 w-12 rounded bg-accent animate-pulse" />
        <div className="h-3 w-14 rounded bg-accent animate-pulse" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          <div className="size-9 rounded-full bg-accent animate-pulse" />
          <div className="size-9 rounded-full bg-accent animate-pulse" />
          <div className="size-9 rounded-full bg-accent animate-pulse" />
        </div>
        <div className="h-5 w-20 rounded bg-accent animate-pulse" />
      </div>
    </div>
  )
}
