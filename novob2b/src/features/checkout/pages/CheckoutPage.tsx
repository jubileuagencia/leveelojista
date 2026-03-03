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
import { StepPayment } from '@/features/checkout/components/StepPayment'
import { StepReview } from '@/features/checkout/components/StepReview'
import { StepSuccess } from '@/features/checkout/components/StepSuccess'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const items = useCartStore((s) => s.items)

  const step = useCheckoutStore((s) => s.step)
  const fetchAddresses = useCheckoutStore((s) => s.fetchAddresses)
  const reset = useCheckoutStore((s) => s.reset)

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && step < 4) {
      toast.info('Seu carrinho esta vazio. Adicione itens para continuar.')
      navigate('/carrinho', { replace: true })
    }
  }, [items.length, step, navigate])

  // Fetch addresses on mount
  useEffect(() => {
    if (user) {
      fetchAddresses(user.id)
    }
  }, [user, fetchAddresses])

  // Reset checkout state on unmount
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  return (
    <div className="bg-background pb-20 md:pb-4">
      {/* Sticky header */}
      <div className="sticky top-14 md:top-16 z-20 flex items-center gap-3 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        {step < 4 ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (step === 1) {
                navigate(-1)
              } else {
                useCheckoutStore.getState().setStep(step - 1)
              }
            }}
          >
            <ArrowLeft className="size-5" />
          </Button>
        ) : (
          <div className="size-9" /> // spacer
        )}
        <div className="flex-1">
          <h1 className="text-base font-semibold">
            {step < 4 ? 'Finalizar Pedido' : 'Pedido Confirmado'}
          </h1>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={step} />

      {/* Step content */}
      <div className="max-w-2xl mx-auto">
        {step === 1 && <StepAddress />}
        {step === 2 && <StepPayment />}
        {step === 3 && <StepReview />}
        {step === 4 && <StepSuccess />}
      </div>
    </div>
  )
}
