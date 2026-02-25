import { useState } from 'react'
import { MapPin, Trash2, Plus, Loader2, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { formatCNPJ, formatPhone, formatCEP, formatDateTime } from '@/lib/format'
import { TierBadge, ALL_TIERS, getTierLabel } from './TierBadge'
import { RoleBadge, ALL_ROLES, getRoleLabel } from './RoleBadge'
import {
  useClientDetail,
  useUpdateClientProfile,
  useUpdateClientEmail,
  useCreateClientAddress,
  useDeleteClientAddress,
} from '../hooks/useClients'
import { useAuthStore } from '@/stores/auth-store'
import type { UserTier, UserRole, UserAddress } from '@/types/database'

interface ClientDetailsModalProps {
  clientId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EMPTY_ADDR = { cep: '', street: '', number: '', district: '', city: '', state: '' }

function applyCEPMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return digits.replace(/^(\d{5})(\d{0,3})/, '$1-$2')
}

export function ClientDetailsModal({ clientId, open, onOpenChange }: ClientDetailsModalProps) {
  const { data: client, isLoading } = useClientDetail(clientId)
  const updateProfile = useUpdateClientProfile()
  const updateEmail = useUpdateClientEmail()
  const createAddress = useCreateClientAddress()
  const deleteAddress = useDeleteClientAddress()

  const currentUser = useAuthStore((s) => s.profile)
  const isSuperAdmin = currentUser?.role === 'super_admin'

  const [editingEmail, setEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [deleteAddrId, setDeleteAddrId] = useState<string | null>(null)

  // New address form
  const [showAddrForm, setShowAddrForm] = useState(false)
  const [addrForm, setAddrForm] = useState(EMPTY_ADDR)
  const [fetchingCep, setFetchingCep] = useState(false)

  const handleTierChange = (tier: UserTier) => {
    if (!clientId) return
    updateProfile.mutate({ id: clientId, data: { tier } })
  }

  const handleRoleChange = (role: UserRole) => {
    if (!clientId) return
    if (role !== 'customer' && !isSuperAdmin) return
    updateProfile.mutate({ id: clientId, data: { role } })
  }

  const handleEmailSave = () => {
    if (!clientId || !newEmail.trim()) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail.trim())) {
      toast.error('Formato de email invalido')
      return
    }
    updateEmail.mutate(
      { userId: clientId, email: newEmail.trim() },
      {
        onSuccess: () => {
          setEditingEmail(false)
          setNewEmail('')
        },
      }
    )
  }

  const handleDeleteAddress = () => {
    if (!deleteAddrId) return
    deleteAddress.mutate(deleteAddrId, {
      onSuccess: () => setDeleteAddrId(null),
    })
  }

  // ── Address form handlers ──

  const handleAddrChange = (field: keyof typeof EMPTY_ADDR, value: string) => {
    if (field === 'cep') value = applyCEPMask(value)
    if (field === 'state') value = value.toUpperCase().slice(0, 2)
    setAddrForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCepBlur = async () => {
    const digits = addrForm.cep.replace(/\D/g, '')
    if (digits.length !== 8) return

    setFetchingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (data.erro) {
        toast.error('CEP não encontrado')
        return
      }
      setAddrForm((prev) => ({
        ...prev,
        street: data.logradouro || prev.street,
        district: data.bairro || prev.district,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }))
    } catch {
      toast.error('Erro ao buscar CEP')
    } finally {
      setFetchingCep(false)
    }
  }

  const handleAddrSave = () => {
    if (!clientId) return
    const { cep, street, number, district, city, state } = addrForm
    if (!cep || !street || !number || !district || !city || !state) {
      toast.error('Preencha todos os campos do endereço')
      return
    }
    createAddress.mutate(
      {
        user_id: clientId,
        zip_code: cep.replace(/\D/g, ''),
        street,
        number,
        district,
        city,
        state,
        is_main: client?.addresses.length === 0,
      },
      {
        onSuccess: () => {
          setAddrForm(EMPTY_ADDR)
          setShowAddrForm(false)
        },
      }
    )
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg p-0">
          {isLoading || !client ? (
            <>
              <SheetHeader className="px-4 pt-6 pb-4 sm:px-6">
                <SheetTitle>Detalhes do cliente</SheetTitle>
                <SheetDescription>Carregando...</SheetDescription>
              </SheetHeader>
              <ClientDetailSkeleton />
            </>
          ) : (
            <>
              <SheetHeader className="px-4 pt-6 pb-4 sm:px-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <SheetTitle className="text-lg">
                    {client.company_name ?? 'Sem nome'}
                  </SheetTitle>
                  <TierBadge tier={client.tier} />
                  <RoleBadge role={client.role} />
                </div>
                <SheetDescription>
                  Cadastrado em {formatDateTime(client.created_at)}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-5 px-4 pb-6 sm:px-6">
                {/* Contact info */}
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium">Informações</h4>
                  <div className="rounded-lg border p-3 text-sm space-y-1">
                    {/* Email */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Email</p>
                        {editingEmail ? (
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="email"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              className="h-8 text-sm"
                              placeholder={client.email ?? ''}
                              autoFocus
                            />
                            <Button
                              size="sm"
                              className="h-8 text-xs"
                              onClick={handleEmailSave}
                              disabled={updateEmail.isPending}
                            >
                              Salvar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => { setEditingEmail(false); setNewEmail('') }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="truncate">{client.email ?? '—'}</p>
                            {isSuperAdmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs px-2"
                                onClick={() => {
                                  setNewEmail(client.email ?? '')
                                  setEditingEmail(true)
                                }}
                              >
                                Editar
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CNPJ */}
                    {client.cnpj && (
                      <div>
                        <p className="text-xs text-muted-foreground">CNPJ</p>
                        <p>{formatCNPJ(client.cnpj)}</p>
                      </div>
                    )}

                    {/* Phone */}
                    {client.phone && (
                      <div>
                        <p className="text-xs text-muted-foreground">Telefone</p>
                        <p>{formatPhone(client.phone)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Tier */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alterar tier</label>
                  <Select
                    value={client.tier}
                    onValueChange={(v) => handleTierChange(v as UserTier)}
                    disabled={updateProfile.isPending}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_TIERS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {getTierLabel(t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alterar papel</label>
                  <Select
                    value={client.role}
                    onValueChange={(v) => handleRoleChange(v as UserRole)}
                    disabled={updateProfile.isPending || !isSuperAdmin}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {getRoleLabel(r)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!isSuperAdmin && (
                    <p className="text-xs text-muted-foreground">
                      Apenas super admins podem alterar papéis
                    </p>
                  )}
                </div>

                <Separator />

                {/* Addresses */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      Endereços ({client.addresses.length})
                    </h4>
                    {!showAddrForm && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setShowAddrForm(true)}
                      >
                        <Plus className="mr-1 size-3" />
                        Adicionar
                      </Button>
                    )}
                  </div>

                  {/* New address form */}
                  {showAddrForm && (
                    <div className="rounded-lg border p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Novo endereço</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => { setShowAddrForm(false); setAddrForm(EMPTY_ADDR) }}
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">CEP</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="00000-000"
                            value={addrForm.cep}
                            onChange={(e) => handleAddrChange('cep', e.target.value)}
                            onBlur={handleCepBlur}
                            className="h-8 text-sm"
                            disabled={fetchingCep}
                          />
                          {fetchingCep && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                        </div>
                      </div>

                      <div className="grid grid-cols-[1fr_80px] gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Rua</Label>
                          <Input
                            placeholder="Logradouro"
                            value={addrForm.street}
                            onChange={(e) => handleAddrChange('street', e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Nº</Label>
                          <Input
                            placeholder="Nº"
                            value={addrForm.number}
                            onChange={(e) => handleAddrChange('number', e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Bairro</Label>
                        <Input
                          placeholder="Bairro"
                          value={addrForm.district}
                          onChange={(e) => handleAddrChange('district', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-[1fr_70px] gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Cidade</Label>
                          <Input
                            placeholder="Cidade"
                            value={addrForm.city}
                            onChange={(e) => handleAddrChange('city', e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">UF</Label>
                          <Input
                            placeholder="UF"
                            value={addrForm.state}
                            onChange={(e) => handleAddrChange('state', e.target.value)}
                            className="h-8 text-sm uppercase"
                            maxLength={2}
                          />
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full h-8 text-xs"
                        onClick={handleAddrSave}
                        disabled={createAddress.isPending}
                      >
                        {createAddress.isPending ? (
                          <><Loader2 className="mr-1 size-3 animate-spin" /> Salvando...</>
                        ) : (
                          'Salvar endereço'
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Existing addresses */}
                  {client.addresses.length === 0 && !showAddrForm ? (
                    <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado</p>
                  ) : (
                    <div className="space-y-2">
                      {client.addresses.map((addr: UserAddress) => (
                        <div
                          key={addr.id}
                          className="flex items-start gap-2 rounded-lg border p-2.5"
                        >
                          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1 text-sm">
                            <p>
                              {addr.street}
                              {addr.number ? `, ${addr.number}` : ''}
                            </p>
                            <p className="text-muted-foreground">
                              {addr.district}
                              {addr.city ? ` — ${addr.city}` : ''}
                              {addr.state ? `/${addr.state}` : ''}
                            </p>
                            {addr.zip_code && (
                              <p className="text-muted-foreground">
                                CEP: {formatCEP(addr.zip_code)}
                              </p>
                            )}
                            {addr.is_main && (
                              <span className="mt-1 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                                Principal
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 shrink-0 text-destructive hover:text-destructive"
                            onClick={() => setDeleteAddrId(addr.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete address confirmation */}
      <AlertDialog open={!!deleteAddrId} onOpenChange={(v) => !v && setDeleteAddrId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir endereço?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O endereço será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAddress}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function ClientDetailSkeleton() {
  return (
    <div className="space-y-5 px-4 pt-6 sm:px-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-36" />
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  )
}
