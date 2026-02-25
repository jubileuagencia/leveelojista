import { useState, useCallback } from 'react'
import { MapPin, Plus, Star, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { formatCEP } from '@/lib/format'
import { useCheckoutStore } from '@/features/checkout/stores/checkout-store'
import { createAddress } from '@/features/checkout/services/checkout'
import { useAuthStore } from '@/stores/auth-store'
import type { UserAddress } from '@/types/database'

export function StepAddress() {
  const user = useAuthStore((s) => s.user)
  const addresses = useCheckoutStore((s) => s.addresses)
  const selectedAddressId = useCheckoutStore((s) => s.selectedAddressId)
  const selectAddress = useCheckoutStore((s) => s.selectAddress)
  const setStep = useCheckoutStore((s) => s.setStep)
  const fetchAddresses = useCheckoutStore((s) => s.fetchAddresses)

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleContinue = () => {
    if (!selectedAddressId) {
      toast.error('Selecione um endereco para continuar.')
      return
    }
    setStep(2)
  }

  const handleAddressCreated = async () => {
    if (user) {
      await fetchAddresses(user.id)
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="px-4">
        <h2 className="text-lg font-semibold">Endereco de entrega</h2>
        <p className="text-sm text-muted-foreground">
          Selecione ou cadastre um endereco para entrega.
        </p>
      </div>

      {/* Address list */}
      <div className="px-4 space-y-3">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            selected={selectedAddressId === address.id}
            onSelect={() => selectAddress(address.id)}
          />
        ))}

        {addresses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <MapPin className="size-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Nenhum endereco cadastrado.
            </p>
          </div>
        )}

        {/* Add new address button */}
        <Button
          variant="outline"
          className="w-full h-12 gap-2 border-dashed"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="size-4" />
          Adicionar novo endereco
        </Button>
      </div>

      {/* Continue button */}
      <div className="px-4 pt-2 pb-4">
        <Button
          size="lg"
          className="w-full h-12 font-semibold rounded-xl"
          disabled={!selectedAddressId}
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </div>

      {/* New address dialog */}
      <NewAddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={handleAddressCreated}
      />
    </div>
  )
}

// Address card component
function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: UserAddress
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full text-left rounded-xl border p-4 transition-all',
        selected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-border bg-card hover:border-primary/40'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-full mt-0.5',
              selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            <MapPin className="size-4" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium">
              {address.street}
              {address.number ? `, ${address.number}` : ''}
            </p>
            <p className="text-xs text-muted-foreground">
              {address.district}
            </p>
            <p className="text-xs text-muted-foreground">
              {address.city} - {address.state}
            </p>
            {address.zip_code && (
              <p className="text-xs text-muted-foreground">
                CEP: {formatCEP(address.zip_code)}
              </p>
            )}
          </div>
        </div>

        {address.is_main && (
          <Badge
            variant="secondary"
            className="shrink-0 gap-1 text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
          >
            <Star className="size-3" />
            Principal
          </Badge>
        )}
      </div>
    </button>
  )
}

// New address dialog
function NewAddressDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}) {
  const user = useAuthStore((s) => s.user)

  const [saving, setSaving] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)
  const [form, setForm] = useState({
    zip_code: '',
    street: '',
    number: '',
    district: '',
    city: '',
    state: '',
  })

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCepChange = useCallback(async (rawCep: string) => {
    const digits = rawCep.replace(/\D/g, '')
    updateField('zip_code', digits)

    if (digits.length === 8) {
      setLoadingCep(true)
      try {
        const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
        const data = await response.json()

        if (!data.erro) {
          setForm((prev) => ({
            ...prev,
            zip_code: digits,
            street: data.logradouro || prev.street,
            district: data.bairro || prev.district,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }))
        }
      } catch {
        // silently fail - user can fill manually
      } finally {
        setLoadingCep(false)
      }
    }
  }, [])

  const handleSave = async () => {
    if (!user) return
    if (!form.zip_code || !form.street || !form.city || !form.state) {
      toast.error('Preencha os campos obrigatorios.')
      return
    }

    setSaving(true)
    try {
      await createAddress({
        user_id: user.id,
        zip_code: form.zip_code,
        street: form.street,
        number: form.number || null,
        district: form.district || null,
        city: form.city,
        state: form.state,
        is_main: false,
      })
      toast.success('Endereco adicionado com sucesso!')
      setForm({ zip_code: '', street: '', number: '', district: '', city: '', state: '' })
      onCreated()
    } catch {
      toast.error('Erro ao salvar endereco. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo endereco</DialogTitle>
          <DialogDescription>
            Preencha o CEP para buscar o endereco automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* CEP */}
          <div className="space-y-2">
            <Label htmlFor="cep">CEP *</Label>
            <div className="relative">
              <Input
                id="cep"
                placeholder="00000-000"
                maxLength={9}
                value={formatCEP(form.zip_code)}
                onChange={(e) => handleCepChange(e.target.value)}
              />
              {loadingCep && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Street */}
          <div className="space-y-2">
            <Label htmlFor="street">Rua *</Label>
            <Input
              id="street"
              placeholder="Nome da rua"
              value={form.street}
              onChange={(e) => updateField('street', e.target.value)}
            />
          </div>

          {/* Number + District */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="number">Numero</Label>
              <Input
                id="number"
                placeholder="123"
                value={form.number}
                onChange={(e) => updateField('number', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">Bairro</Label>
              <Input
                id="district"
                placeholder="Bairro"
                value={form.district}
                onChange={(e) => updateField('district', e.target.value)}
              />
            </div>
          </div>

          {/* City + State */}
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                placeholder="Cidade"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">UF *</Label>
              <Input
                id="state"
                placeholder="UF"
                maxLength={2}
                value={form.state}
                onChange={(e) => updateField('state', e.target.value.toUpperCase())}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <Loader2 className="size-4 animate-spin" />}
            Salvar endereco
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
