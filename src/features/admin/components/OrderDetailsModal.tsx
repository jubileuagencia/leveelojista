import { useState } from 'react'
import { Package } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDateTime, formatCNPJ, formatPhone } from '@/lib/format'
import { OrderStatusBadge, ALL_STATUSES, getStatusLabel } from './OrderStatusBadge'
import { useOrderDetail, useUpdateOrderStatus } from '../hooks/useOrders'
import type { OrderStatus } from '@/types/database'

interface OrderDetailsModalProps {
  orderId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsModal({ orderId, open, onOpenChange }: OrderDetailsModalProps) {
  const { data: order, isLoading } = useOrderDetail(orderId)
  const updateStatus = useUpdateOrderStatus()
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null)

  const handleStatusSelect = (status: OrderStatus) => {
    if (!orderId || status === order?.status) return
    setPendingStatus(status)
  }

  const handleStatusConfirm = () => {
    if (!orderId || !pendingStatus) return
    updateStatus.mutate({ id: orderId, status: pendingStatus })
    setPendingStatus(null)
  }

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg p-0">
        {isLoading || !order ? (
          <>
            <SheetHeader className="px-4 pt-6 pb-4 sm:px-6">
              <SheetTitle>Detalhes do pedido</SheetTitle>
              <SheetDescription>Carregando...</SheetDescription>
            </SheetHeader>
            <OrderDetailSkeleton />
          </>
        ) : (
          <>
            <SheetHeader className="px-4 pt-6 pb-4 sm:px-6">
              <div className="flex items-center gap-3">
                <SheetTitle className="text-lg">Pedido #{order.order_number}</SheetTitle>
                <OrderStatusBadge status={order.status} />
              </div>
              <SheetDescription>
                {formatDateTime(order.created_at)}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-6 sm:px-6">
              {/* Status change */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Alterar status</label>
                <Select
                  value={order.status}
                  onValueChange={(v) => handleStatusSelect(v as OrderStatus)}
                  disabled={updateStatus.isPending}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {getStatusLabel(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Client info */}
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium">Cliente</h4>
                <div className="rounded-lg border p-3 text-sm space-y-1">
                  <p className="font-medium">{order.profile?.company_name ?? '—'}</p>
                  {order.profile?.cnpj && (
                    <p className="text-muted-foreground">{formatCNPJ(order.profile.cnpj)}</p>
                  )}
                  {order.profile?.phone && (
                    <p className="text-muted-foreground">{formatPhone(order.profile.phone)}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              {order.address && (
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium">Endereço de entrega</h4>
                  <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                    <p>
                      {order.address.street}
                      {order.address.number ? `, ${order.address.number}` : ''}
                    </p>
                    <p>
                      {order.address.district}
                      {order.address.city ? ` — ${order.address.city}` : ''}
                      {order.address.state ? `/${order.address.state}` : ''}
                    </p>
                    {order.address.zip_code && <p>CEP: {order.address.zip_code}</p>}
                  </div>
                </div>
              )}

              <Separator />

              {/* Items */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  Itens ({order.items?.length ?? 0})
                </h4>
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                      <div className="size-10 shrink-0 overflow-hidden rounded border bg-muted/30">
                        {item.product?.image_url ? (
                          <img src={item.product.image_url} alt="" className="size-full object-cover" />
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <Package className="size-4 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {item.product?.name ?? 'Produto removido'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity}x {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold tabular-nums">
                        {formatCurrency(item.total_price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="tabular-nums text-emerald-600">
                      -{formatCurrency(order.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-1.5 font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrency(order.total)}</span>
                </div>
              </div>

              {/* Payment method */}
              <div className="text-xs text-muted-foreground">
                Pagamento: {order.payment_method === 'pix' ? 'PIX' : 'Boleto'}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>

    {/* Status change confirmation */}
    <AlertDialog open={!!pendingStatus} onOpenChange={(v) => !v && setPendingStatus(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alterar status do pedido</AlertDialogTitle>
          <AlertDialogDescription>
            Alterar o status do pedido #{order?.order_number} para{' '}
            <strong>{pendingStatus ? getStatusLabel(pendingStatus) : ''}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleStatusConfirm} disabled={updateStatus.isPending}>
            {updateStatus.isPending ? 'Alterando...' : 'Confirmar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-5 px-4 pt-6 sm:px-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-20 w-full rounded-lg" />
      <Skeleton className="h-20 w-full rounded-lg" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  )
}
