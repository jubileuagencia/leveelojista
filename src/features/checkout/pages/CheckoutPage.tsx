import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCheckoutStore } from '@/features/checkout/stores/checkout-store'
import { useCartStore } from '@/stores/cart-store'
import { useAuthStore } from '@/stores/auth-store'
import { StepIndicator } from '@/features/checkout/components/StepIndicator'
import { StepAddress } from '@/features/checkout/components/StepAddress'
import { StepReview } from '@/features/checkout/components/StepReview'
import { StepSuccess } from '@/features/checkout/components/StepSuccess'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const items = useCartStore((s) => s.items)

  const step = useCheckoutStore((s) => s.step)
  const fetchAddresses = useCheckoutStore((s) => s.fetchAddresses)
  const reset = useCheckoutStore((s) => s.reset)

  useEffect(() => {
    if (items.length === 0 && step < 3) {
      toast.info('Seu carrinho esta vazio. Adicione itens para continuar.')
      navigate('/carrinho', { replace: true })
    }
  }, [items.length, step, navigate])

  useEffect(() => {
    if (user) fetchAddresses(user.id)
  }, [user, fetchAddresses])

  useEffect(() => {
    return () => { reset() }
  }, [reset])

  return (
    <div className="bg-background pb-20 md:pb-4">
      <div className="sticky top-14 md:top-16 z-20 flex items-center gap-3 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        {step < 3 ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (step === 1) navigate(-1)
              else useCheckoutStore.getState().setStep(step - 1)
            }}
          >
            <ArrowLeft className="size-5" />
          </Button>
        ) : (
          <div className="size-9" />
        )}
        <div className="flex-1">
          <h1 className="text-base font-semibold">
            {step < 3 ? 'Finalizar Pedido' : 'Pedido Confirmado'}
          </h1>
        </div>
      </div>

      <StepIndicator currentStep={step} />

      <div className="max-w-2xl mx-auto">
        {step === 1 && <StepAddress />}
        {step === 2 && <StepReview />}
        {step === 3 && <StepSuccess />}
      </div>
    </div>
  )
}
