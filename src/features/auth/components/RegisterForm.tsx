import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Loader2,
  Mail,
  Lock,
  Building2,
  Phone,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Check,
  Hash,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'

// ---------------------------------------------------------------------------
// CNPJ Validation Algorithm
// ---------------------------------------------------------------------------
function isValidCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length !== 14) return false

  // Reject all same-digit CNPJs
  if (/^(\d)\1{13}$/.test(digits)) return false

  const calc = (base: number): number => {
    let sum = 0
    let weight = base === 12 ? 5 : 6
    for (let i = 0; i < base; i++) {
      sum += Number(digits[i]) * weight
      weight = weight === 2 ? 9 : weight - 1
    }
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  const d1 = calc(12)
  const d2 = calc(13)

  return Number(digits[12]) === d1 && Number(digits[13]) === d2
}

// ---------------------------------------------------------------------------
// Masks
// ---------------------------------------------------------------------------
function applyCNPJMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.replace(/^(\d{0,2})/, '($1')
  if (digits.length <= 7)
    return digits.replace(/^(\d{2})(\d{0,5})/, '($1) $2')
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

function applyCEPMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return digits.replace(/^(\d{5})(\d{0,3})/, '$1-$2')
}

// ---------------------------------------------------------------------------
// Schemas per step
// ---------------------------------------------------------------------------
const step1Schema = z
  .object({
    email: z
      .string()
      .min(1, 'O e-mail e obrigatorio')
      .email('Informe um e-mail valido'),
    password: z
      .string()
      .min(1, 'A senha e obrigatoria')
      .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas nao coincidem',
    path: ['confirmPassword'],
  })

const step2Schema = z.object({
  companyName: z.string().min(1, 'A razao social e obrigatoria'),
  cnpj: z
    .string()
    .min(1, 'O CNPJ e obrigatorio')
    .refine((val) => val.replace(/\D/g, '').length === 14, {
      message: 'CNPJ deve ter 14 digitos',
    })
    .refine((val) => isValidCNPJ(val), {
      message: 'CNPJ invalido',
    }),
  phone: z
    .string()
    .min(1, 'O telefone e obrigatorio')
    .refine((val) => val.replace(/\D/g, '').length >= 10, {
      message: 'Telefone deve ter pelo menos 10 digitos',
    }),
})

const step3Schema = z.object({
  cep: z
    .string()
    .min(1, 'O CEP e obrigatorio')
    .refine((val) => val.replace(/\D/g, '').length === 8, {
      message: 'CEP deve ter 8 digitos',
    }),
  street: z.string().min(1, 'A rua e obrigatoria'),
  number: z.string().min(1, 'O numero e obrigatorio'),
  district: z.string().min(1, 'O bairro e obrigatorio'),
  city: z.string().min(1, 'A cidade e obrigatoria'),
  state: z.string().min(1, 'O estado e obrigatorio'),
})

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface FormData {
  // Step 1
  email: string
  password: string
  confirmPassword: string
  // Step 2
  companyName: string
  cnpj: string
  phone: string
  // Step 3
  cep: string
  street: string
  number: string
  district: string
  city: string
  state: string
}

type FieldErrors = Partial<Record<keyof FormData, string>>

const TOTAL_STEPS = 3

const STEP_TITLES = [
  'Dados de acesso',
  'Dados da empresa',
  'Endereco',
] as const

const STEP_DESCRIPTIONS = [
  'Informe seu e-mail e crie uma senha segura',
  'Preencha os dados da sua empresa',
  'Informe o endereco de entrega',
] as const

// ---------------------------------------------------------------------------
// Extracted sub-components (must be outside RegisterForm to avoid re-mount)
// ---------------------------------------------------------------------------
function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const stepNum = i + 1
        const isActive = stepNum === step
        const isCompleted = stepNum < step

        return (
          <div key={stepNum} className="flex items-center gap-2">
            <div
              className={`flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all ${
                isCompleted
                  ? 'border-primary bg-primary text-primary-foreground'
                  : isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground'
              }`}
            >
              {isCompleted ? <Check className="size-4" /> : stepNum}
            </div>
            {stepNum < TOTAL_STEPS && (
              <div
                className={`h-0.5 w-8 transition-colors ${
                  isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function FormField({
  id,
  label,
  icon: Icon,
  field,
  type = 'text',
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  disabled,
  autoComplete,
}: {
  id: string
  label: string
  icon: React.ElementType
  field: keyof FormData
  type?: string
  placeholder: string
  value: string
  error?: string
  onChange: (field: keyof FormData, value: string) => void
  onBlur?: () => void
  disabled?: boolean
  autoComplete?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          onBlur={onBlur}
          className="pl-10"
          aria-invalid={!!error}
          disabled={disabled}
          autoComplete={autoComplete}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function RegisterForm() {
  const navigate = useNavigate()
  const signup = useAuthStore((s) => s.signup)

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    cnpj: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    district: '',
    city: '',
    state: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingCep, setIsFetchingCep] = useState(false)

  function handleChange(field: keyof FormData, value: string) {
    let masked = value

    if (field === 'cnpj') masked = applyCNPJMask(value)
    if (field === 'phone') masked = applyPhoneMask(value)
    if (field === 'cep') masked = applyCEPMask(value)

    setFormData((prev) => ({ ...prev, [field]: masked }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const fetchCep = useCallback(
    async (cep: string) => {
      const digits = cep.replace(/\D/g, '')
      if (digits.length !== 8) return

      setIsFetchingCep(true)
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${digits}/json/`
        )
        const data = await response.json()

        if (data.erro) {
          toast.error('CEP nao encontrado')
          return
        }

        setFormData((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          district: data.bairro || prev.district,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }))

        setErrors((prev) => ({
          ...prev,
          street: undefined,
          district: undefined,
          city: undefined,
          state: undefined,
        }))

        toast.success('Endereco preenchido automaticamente')
      } catch {
        toast.error('Erro ao buscar CEP. Preencha manualmente.')
      } finally {
        setIsFetchingCep(false)
      }
    },
    []
  )

  function handleCepBlur() {
    const digits = formData.cep.replace(/\D/g, '')
    if (digits.length === 8) {
      fetchCep(formData.cep)
    }
  }

  function validateStep(currentStep: number): boolean {
    let result: z.ZodSafeParseResult<unknown>

    switch (currentStep) {
      case 1:
        result = step1Schema.safeParse(formData)
        break
      case 2:
        result = step2Schema.safeParse(formData)
        break
      case 3:
        result = step3Schema.safeParse(formData)
        break
      default:
        return false
    }

    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormData
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return false
    }

    setErrors({})
    return true
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS))
    }
  }

  function handleBack() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateStep(step)) return

    setIsLoading(true)
    try {
      await signup(formData.email, formData.password, {
        company_name: formData.companyName,
        cnpj: formData.cnpj.replace(/\D/g, ''),
        phone: formData.phone.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, ''),
        street: formData.street,
        number: formData.number,
        district: formData.district,
        city: formData.city,
        state: formData.state,
      })

      toast.success(
        'Cadastro realizado! Verifique seu e-mail para confirmar a conta.',
        { duration: 6000 }
      )
      navigate('/login', { replace: true })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao criar conta'

      if (message.includes('already registered')) {
        toast.error('Este e-mail ja esta cadastrado')
        setStep(1)
      } else {
        toast.error(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Step content
  // ---------------------------------------------------------------------------
  function renderStep() {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              id="email"
              label="E-mail"
              icon={Mail}
              field="email"
              type="email"
              placeholder="seu@empresa.com"
              value={formData.email}
              error={errors.email}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="email"
            />
            <FormField
              id="password"
              label="Senha"
              icon={Lock}
              field="password"
              type="password"
              placeholder="Minimo 6 caracteres"
              value={formData.password}
              error={errors.password}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <FormField
              id="confirmPassword"
              label="Confirmar senha"
              icon={Lock}
              field="confirmPassword"
              type="password"
              placeholder="Repita sua senha"
              value={formData.confirmPassword}
              error={errors.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <FormField
              id="companyName"
              label="Razao Social"
              icon={Building2}
              field="companyName"
              placeholder="Nome da empresa"
              value={formData.companyName}
              error={errors.companyName}
              onChange={handleChange}
              disabled={isLoading}
            />
            <FormField
              id="cnpj"
              label="CNPJ"
              icon={Hash}
              field="cnpj"
              placeholder="XX.XXX.XXX/XXXX-XX"
              value={formData.cnpj}
              error={errors.cnpj}
              onChange={handleChange}
              disabled={isLoading}
            />
            <FormField
              id="phone"
              label="Telefone"
              icon={Phone}
              field="phone"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              value={formData.phone}
              error={errors.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <FormField
              id="cep"
              label="CEP"
              icon={MapPin}
              field="cep"
              placeholder="XXXXX-XXX"
              value={formData.cep}
              error={errors.cep}
              onChange={handleChange}
              onBlur={handleCepBlur}
              disabled={isLoading || isFetchingCep}
            />
            {isFetchingCep && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                Buscando endereco...
              </div>
            )}
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <FormField
                id="street"
                label="Rua"
                icon={MapPin}
                field="street"
                placeholder="Nome da rua"
                value={formData.street}
                error={errors.street}
                onChange={handleChange}
                disabled={isLoading}
              />
              <div className="space-y-2">
                <Label htmlFor="number">Numero</Label>
                <Input
                  id="number"
                  placeholder="N"
                  value={formData.number}
                  onChange={(e) => handleChange('number', e.target.value)}
                  className="w-20"
                  aria-invalid={!!errors.number}
                  disabled={isLoading}
                />
                {errors.number && (
                  <p className="text-sm text-destructive">{errors.number}</p>
                )}
              </div>
            </div>
            <FormField
              id="district"
              label="Bairro"
              icon={MapPin}
              field="district"
              placeholder="Bairro"
              value={formData.district}
              error={errors.district}
              onChange={handleChange}
              disabled={isLoading}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                id="city"
                label="Cidade"
                icon={MapPin}
                field="city"
                placeholder="Cidade"
                value={formData.city}
                error={errors.city}
                onChange={handleChange}
                disabled={isLoading}
              />
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  placeholder="UF"
                  value={formData.state}
                  onChange={(e) =>
                    handleChange(
                      'state',
                      e.target.value.toUpperCase().slice(0, 2)
                    )
                  }
                  className="uppercase"
                  maxLength={2}
                  aria-invalid={!!errors.state}
                  disabled={isLoading}
                />
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state}</p>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <Card className="w-full max-w-md border-0 shadow-lg sm:border sm:shadow-xl">
      <CardHeader className="text-center">
        <div className="mb-2">
          <StepIndicator step={step} />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          {STEP_TITLES[step - 1]}
        </CardTitle>
        <CardDescription>{STEP_DESCRIPTIONS[step - 1]}</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent>{renderStep()}</CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="flex w-full gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                size="lg"
                onClick={handleBack}
                disabled={isLoading}
              >
                <ArrowLeft />
                Voltar
              </Button>
            )}

            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                className="flex-1"
                size="lg"
                onClick={handleNext}
                disabled={isLoading}
              >
                Proximo
                <ArrowRight />
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <Check />
                    Criar conta
                  </>
                )}
              </Button>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Ja tem uma conta?{' '}
            <Link
              to="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Faca login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
