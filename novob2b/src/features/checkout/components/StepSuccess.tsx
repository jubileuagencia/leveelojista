import { useNavigate } from 'react-router-dom'
import { ShoppingBag, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCheckoutStore } from '@/features/checkout/stores/checkout-store'
import { formatOrderNumber } from '@/lib/format'

export function StepSuccess() {
  const navigate = useNavigate()
  const orderResult = useCheckoutStore((s) => s.orderResult)
  const reset = useCheckoutStore((s) => s.reset)

  const handleViewOrders = () => {
    reset()
    navigate('/pedidos')
  }

  const handleContinueShopping = () => {
    reset()
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-8">
      {/* Animated checkmark */}
      <div className="relative">
        <div className="flex size-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 animate-in zoom-in-50 duration-500">
          <svg
            className="size-12 text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-700 delay-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              className="animate-[draw_0.5s_ease-in-out_0.3s_both]"
              style={{
                strokeDasharray: 24,
                strokeDashoffset: 24,
                animation: 'draw 0.5s ease-in-out 0.3s forwards',
              }}
            />
          </svg>
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-200/50 dark:bg-emerald-800/30 animate-ping" />
      </div>

      {/* Success message */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Pedido realizado com sucesso!</h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Seu pedido foi enviado e esta aguardando aprovacao.
        </p>
      </div>

      {/* Order number */}
      {orderResult?.order_number && (
        <div className="rounded-xl border bg-card px-6 py-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Numero do pedido</p>
          <p className="text-2xl font-bold text-primary tabular-nums">
            {formatOrderNumber(orderResult.order_number)}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col w-full max-w-xs gap-3 mt-2">
        <Button
          size="lg"
          className="w-full h-12 gap-2 font-semibold rounded-xl"
          onClick={handleViewOrders}
        >
          <FileText className="size-4" />
          Ver meus pedidos
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full h-12 gap-2 rounded-xl"
          onClick={handleContinueShopping}
        >
          <ShoppingBag className="size-4" />
          Continuar comprando
        </Button>
      </div>

      {/* CSS for checkmark draw animation */}
      <style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  )
}
