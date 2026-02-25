import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  { number: 1, label: 'Endereco' },
  { number: 2, label: 'Pagamento' },
  { number: 3, label: 'Revisao' },
  { number: 4, label: 'Confirmacao' },
]

interface StepIndicatorProps {
  currentStep: number
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number
          const isActive = currentStep === step.number
          const isLast = index === steps.length - 1

          return (
            <div key={step.number} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-colors shrink-0',
                    isCompleted &&
                      'bg-primary text-primary-foreground',
                    isActive &&
                      'bg-primary text-primary-foreground ring-4 ring-primary/20',
                    !isCompleted &&
                      !isActive &&
                      'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] sm:text-xs font-medium text-center leading-tight',
                    isActive
                      ? 'text-primary'
                      : isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-2 mt-[-1.25rem]">
                  <div
                    className={cn(
                      'h-0.5 w-full rounded-full transition-colors',
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
