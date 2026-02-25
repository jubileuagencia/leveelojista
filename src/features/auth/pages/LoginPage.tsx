import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Truck, ShieldCheck, Zap } from 'lucide-react'
import { Toaster } from 'sonner'

import { LoginForm } from '@/features/auth/components/LoginForm'
import { useAuthStore } from '@/stores/auth-store'

const FEATURES = [
  {
    icon: Package,
    title: 'Catalogo completo',
    description: 'Acesse milhares de produtos com precos exclusivos B2B',
  },
  {
    icon: Truck,
    title: 'Entregas rapidas',
    description: 'Logistica otimizada para sua empresa receber no prazo',
  },
  {
    icon: ShieldCheck,
    title: 'Compra segura',
    description: 'Pagamento via PIX ou boleto com total seguranca',
  },
  {
    icon: Zap,
    title: 'Descontos por nivel',
    description: 'Quanto mais compra, mais desconto voce ganha',
  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { user, loading, initialized, initialize } = useAuthStore()

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  useEffect(() => {
    if (!loading && initialized && user) {
      navigate('/', { replace: true })
    }
  }, [user, loading, initialized, navigate])

  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      <div className="flex min-h-screen">
        {/* Left side - Branding (hidden on mobile) */}
        <div className="hidden flex-1 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">Levee</h1>
            <p className="mt-1 text-lg text-primary-foreground/70">
              Sua plataforma B2B de entregas
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold">
                Tudo que sua empresa precisa,
                <br />
                em um so lugar.
              </h2>
              <p className="mt-3 max-w-md text-primary-foreground/70">
                Gerencie seus pedidos, acompanhe entregas e aproveite condicoes
                exclusivas para lojistas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl bg-primary-foreground/10 p-4 backdrop-blur-sm"
                >
                  <feature.icon className="mb-2 size-6" />
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-xs text-primary-foreground/60">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-primary-foreground/40">
            &copy; {new Date().getFullYear()} Levee. Todos os direitos
            reservados.
          </p>
        </div>

        {/* Right side - Form */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <h1 className="text-3xl font-bold tracking-tighter text-primary">
              Levee
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sua plataforma B2B de entregas
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </>
  )
}
