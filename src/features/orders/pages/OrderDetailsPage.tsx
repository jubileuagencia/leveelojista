import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  QrCode,
  Barcode,
  Receipt,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDateTime, formatOrderNumber } from '@/lib/format'
import { getOrderById } from '@/features/orders/services/orders'
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge'
import { OrderTimeline } from '@/features/orders/components/OrderTimeline'
import type { Order } from '@/types/database'

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!id) return
      setLoading(true)
      try {
        const data = await getOrderById(id)
        setOrder(data)
      } catch (error) {
        console.error('Error loading order:', error)
        toast.error('Erro ao carregar pedido')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return <OrderDetailsSkeleton onBack={() => navigate(-1)} />
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <Package className="size-16 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold">Pedido nao encontrado</h2>
        <p className="text-sm text-muted-foreground text-center">
          O pedido que voce procura nao existe ou foi removido.
        </p>
        <Button onClick={() => navigate('/pedidos')}>Ver meus pedidos</Button>
      </div>
    )
  }

  const address = order.address
  const items = order.items ?? []

  return (
    <div className="bg-background pb-4">
      {/* Sticky header */}
      <div className="sticky top-14 md:top-16 z-20 flex items-center gap-3 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold truncate">
            Pedido {formatOrderNumber(order.order_number)}
          </h1>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(order.created_at)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} className="text-xs" />
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-5">
        {/* Status badge (large) */}
        <div className="flex items-center justify-center">
          <OrderStatusBadge
            status={order.status}
            className="text-sm px-4 py-1.5"
          />
        </div>

        {/* Timeline */}
        <div className="rounded-xl border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Acompanhamento
          </h2>
          <OrderTimeline status={order.status} createdAt={order.created_at} />
        </div>

        {/* Items */}
        <div className="rounded-xl border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Receipt className="size-4 text-muted-foreground" />
            Itens do Pedido
          </h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="size-14 shrink-0 rounded-lg overflow-hidden bg-muted/50">
                  {item.product?.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product?.name ?? 'Produto'}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Package className="size-6 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">
                    {item.product?.name ?? 'Produto'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity}x {formatCurrency(item.unit_price)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCurrency(item.total_price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery address */}
        {address && (
          <div className="rounded-xl border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              Endereco de Entrega
            </h2>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p className="text-foreground font-medium">
                {address.street}
                {address.number ? `, ${address.number}` : ''}
              </p>
              <p>{address.district}</p>
              <p>
                {address.city}
                {address.state ? ` - ${address.state}` : ''}
              </p>
              {address.zip_code && (
                <p className="text-xs">
                  CEP: {address.zip_code.replace(/(\d{5})(\d{3})/, '$1-$2')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Payment */}
        <div className="rounded-xl border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CreditCard className="size-4 text-muted-foreground" />
            Pagamento
          </h2>
          <Badge
            variant="outline"
            className={cn(
              'text-sm px-3 py-1',
              order.payment_method === 'pix'
                ? 'border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:bg-emerald-950/30'
                : 'border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:bg-blue-950/30'
            )}
          >
            {order.payment_method === 'pix' ? (
              <QrCode className="size-4 mr-1.5" />
            ) : (
              <Barcode className="size-4 mr-1.5" />
            )}
            {order.payment_method === 'pix' ? 'PIX' : 'Boleto Bancario'}
          </Badge>
        </div>

        {/* Order summary */}
        <div className="rounded-xl border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Resumo
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600">Desconto</span>
                <span className="font-medium text-emerald-600 tabular-nums">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="text-lg font-bold tabular-nums">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderDetailsSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-background">
      {/* Header skeleton */}
      <div className="sticky top-14 md:top-16 z-20 flex items-center gap-3 bg-background border-b px-4 py-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1 space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-5">
        {/* Status badge */}
        <div className="flex justify-center">
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>

        {/* Timeline */}
        <div className="rounded-xl border bg-card p-4 space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Skeleton className="size-8 rounded-full shrink-0" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-14 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>

        {/* Payment */}
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>

        {/* Summary */}
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Separator />
          <div className="flex justify-between">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
