import { QrCode, Barcode } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCheckoutStore } from '@/features/checkout/stores/checkout-store'
import type { PaymentMethod } from '@/types/database'

const paymentOptions: {
  method: PaymentMethod
  icon: typeof QrCode
  title: string
  description: string
}[] = [
  {
    method: 'pix',
    icon: QrCode,
    title: 'PIX',
    description: 'Pagamento instantaneo',
  },
  {
    method: 'boleto',
    icon: Barcode,
    title: 'Boleto Bancario',
    description: 'Vencimento em 3 dias uteis',
  },
]

export function StepPayment() {
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod)
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod)
  const setStep = useCheckoutStore((s) => s.setStep)

  const handleContinue = () => {
    if (!paymentMethod) {
      toast.error('Selecione uma forma de pagamento.')
      return
    }
    setStep(3)
  }

  return (
    <div className="space-y-4">
      <div className="px-4">
        <h2 className="text-lg font-semibold">Forma de pagamento</h2>
        <p className="text-sm text-muted-foreground">
          Escolha como deseja pagar seu pedido.
        </p>
      </div>

      {/* Payment options */}
      <div className="px-4 space-y-3">
        {paymentOptions.map((option) => {
          const selected = paymentMethod === option.method
          const Icon = option.icon

          return (
            <button
              key={option.method}
              type="button"
              onClick={() => setPaymentMethod(option.method)}
              className={cn(
                'w-full flex items-center gap-4 rounded-xl border p-5 transition-all',
                selected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border bg-card hover:border-primary/40'
              )}
            >
              <div
                className={cn(
                  'flex size-12 shrink-0 items-center justify-center rounded-xl',
                  selected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="size-6" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-semibold">{option.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>

              {/* Radio indicator */}
              <div className="ml-auto shrink-0">
                <div
                  className={cn(
                    'size-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    selected
                      ? 'border-primary'
                      : 'border-muted-foreground/30'
                  )}
                >
                  {selected && (
                    <div className="size-2.5 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="px-4 pt-2 pb-4 flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 h-12 rounded-xl"
          onClick={() => setStep(1)}
        >
          Voltar
        </Button>
        <Button
          size="lg"
          className="flex-1 h-12 font-semibold rounded-xl"
          disabled={!paymentMethod}
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
