import { MapPin, CreditCard, Package, Percent, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatCEP } from '@/lib/format'
import { useCheckoutStore } from '@/features/checkout/stores/checkout-store'
import { useCartStore } from '@/stores/cart-store'
import { useAuthStore } from '@/stores/auth-store'
import { useConfigStore } from '@/stores/config-store'

const paymentLabels: Record<string, string> = {
  pix: 'PIX',
  boleto: 'Boleto Bancario',
}

export function StepReview() {
  const addresses = useCheckoutStore((s) => s.addresses)
  const selectedAddressId = useCheckoutStore((s) => s.selectedAddressId)
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod)
  const loading = useCheckoutStore((s) => s.loading)
  const setStep = useCheckoutStore((s) => s.setStep)
  const submitOrder = useCheckoutStore((s) => s.submitOrder)

  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const tierDiscounts = useConfigStore((s) => s.tierDiscounts)

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId)

  const tier = profile?.tier ?? 'bronze'
  const discountRate = tier === 'bronze' ? 0 : (tierDiscounts[tier] ?? 0)

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price ?? 0
    return sum + price * item.quantity
  }, 0)
  const discountAmount = subtotal * discountRate
  const total = subtotal - discountAmount

  const handleSubmit = async () => {
    if (!user) return

    try {
      await submitOrder(items, discountRate)
      await clearCart(user.id)
    } catch {
      toast.error('Erro ao finalizar pedido. Tente novamente.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="px-4">
        <h2 className="text-lg font-semibold">Revisao do pedido</h2>
        <p className="text-sm text-muted-foreground">
          Confira os dados antes de finalizar.
        </p>
      </div>

      {/* Selected address */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Endereco de entrega</h3>
        </div>
        {selectedAddress && (
          <div className="rounded-xl border bg-card p-3">
            <p className="text-sm font-medium">
              {selectedAddress.street}
              {selectedAddress.number ? `, ${selectedAddress.number}` : ''}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedAddress.district} - {selectedAddress.city}/{selectedAddress.state}
            </p>
            {selectedAddress.zip_code && (
              <p className="text-xs text-muted-foreground">
                CEP: {formatCEP(selectedAddress.zip_code)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Payment method */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Forma de pagamento</h3>
        </div>
        <Badge variant="secondary" className="text-xs px-3 py-1">
          {paymentMethod ? paymentLabels[paymentMethod] : ''}
        </Badge>
      </div>

      <Separator className="mx-4" />

      {/* Cart items */}
      <div className="px-4">
        <h3 className="text-sm font-medium mb-3">
          Itens do pedido ({items.length})
        </h3>
        <div className="space-y-3">
          {items.map((item) => {
            const basePrice = item.product?.price ?? 0
            const itemDiscount = basePrice * discountRate
            const finalPrice = basePrice - itemDiscount
            const lineTotal = finalPrice * item.quantity

            return (
              <div
                key={item.id}
                className="flex gap-3 rounded-xl border bg-card p-3"
              >
                {/* Product image */}
                <div className="size-14 shrink-0 rounded-lg overflow-hidden bg-muted/30">
                  {item.product?.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Package className="size-5 text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-1">
                    {item.product?.name ?? 'Produto'}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {item.quantity}x{' '}
                      {discountRate > 0 ? (
                        <span className="text-emerald-600">{formatCurrency(finalPrice)}</span>
                      ) : (
                        formatCurrency(basePrice)
                      )}
                    </span>
                  </div>
                </div>

                {/* Line total */}
                <div className="shrink-0 text-right">
                  <span className="text-sm font-semibold">
                    {formatCurrency(lineTotal)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Separator className="mx-4" />

      {/* Order totals */}
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
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
          <span className="text-xl font-bold">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Tier discount highlight */}
      {discountRate > 0 && (
        <div className="px-4">
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-3">
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Voce esta economizando{' '}
              <strong>{formatCurrency(discountAmount)}</strong> com seu plano{' '}
              <strong>{tier.toUpperCase()}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-4 pt-2 pb-4 flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 h-12 rounded-xl"
          onClick={() => setStep(2)}
          disabled={loading}
        >
          Voltar
        </Button>
        <Button
          size="lg"
          className="flex-1 h-12 font-semibold rounded-xl gap-2"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Finalizar Pedido
        </Button>
      </div>
    </div>
  )
}
