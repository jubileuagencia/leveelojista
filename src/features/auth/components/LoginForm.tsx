import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, LogIn } from 'lucide-react'

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

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail e obrigatorio')
    .email('Informe um e-mail valido'),
  password: z
    .string()
    .min(1, 'A senha e obrigatoria')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

type FieldErrors = Partial<Record<keyof LoginFormData, string>>

export function LoginForm() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(field: keyof LoginFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormData
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    try {
      await login(result.data.email, result.data.password)
      toast.success('Login realizado com sucesso!')
      navigate('/', { replace: true })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao fazer login'

      if (message.includes('Invalid login credentials')) {
        toast.error('E-mail ou senha incorretos')
      } else if (message.includes('Email not confirmed')) {
        toast.error('Confirme seu e-mail antes de fazer login')
      } else {
        toast.error(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-lg sm:border sm:shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Bem-vindo de volta
        </CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar a plataforma
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="pl-10"
                autoComplete="email"
                aria-invalid={!!errors.email}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="pl-10"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn />
                Entrar
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Nao tem uma conta?{' '}
            <Link
              to="/cadastro"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
