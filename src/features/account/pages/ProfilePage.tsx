import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Building2, FileText, Crown, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores/auth-store'
import type { UserTier } from '@/types/database'
import { cn } from '@/lib/utils'
import { formatPhone } from '@/lib/format'

const TIER_CONFIG: Record<UserTier, { label: string; className: string }> = {
  ouro: {
    label: 'Ouro',
    className: 'bg-amber-700/10 text-amber-700 border-amber-700/20',
  },
  platina: {
    label: 'Platina',
    className: 'bg-slate-400/10 text-slate-500 border-slate-400/20',
  },
  diamante: {
    label: 'Diamante',
    className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
}

function formatDocument(type: string, number: string | null, cnpj: string | null) {
  if (type === 'cpf' && number) {
    return number.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  const raw = cnpj ?? number
  if (raw && raw.length >= 14) {
    return raw.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  return raw ?? '—'
}

function ProfileField({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="truncate text-sm font-medium">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, profile } = useAuthStore()

  const tierConfig = profile?.tier ? TIER_CONFIG[profile.tier] : null

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-xl font-bold">Meu Perfil</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Dados da Conta</CardTitle>
            {tierConfig && (
              <Badge variant="outline" className={cn('text-xs', tierConfig.className)}>
                <Crown className="mr-1 size-3" />
                {tierConfig.label}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-0">
          <ProfileField
            icon={Building2}
            label={profile?.document_type === 'cpf' ? 'Nome' : 'Razão Social'}
            value={profile?.company_name}
          />
          <Separator />
          {profile?.trade_name && (
            <>
              <ProfileField icon={Building2} label="Nome Fantasia" value={profile.trade_name} />
              <Separator />
            </>
          )}
          <ProfileField icon={Mail} label="E-mail" value={user?.email} />
          <Separator />
          <ProfileField
            icon={FileText}
            label={profile?.document_type === 'cpf' ? 'CPF' : 'CNPJ'}
            value={formatDocument(profile?.document_type ?? 'cnpj', profile?.document_number ?? null, profile?.cnpj ?? null)}
          />
          <Separator />
          <ProfileField icon={Phone} label="Telefone" value={profile?.phone ? formatPhone(profile.phone) : undefined} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6 text-center">
          <User className="text-muted-foreground mx-auto mb-2 size-8" />
          <p className="text-muted-foreground text-sm">
            Em breve: edição de perfil e alteração de senha.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
