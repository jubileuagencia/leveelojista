import { useState } from 'react'
import { Loader2, Save, Clock, Truck, QrCode, MapPin, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  useTierDiscounts,
  useUpdateTierDiscounts,
  useDeliveryConfig,
  useUpdateDeliveryConfig,
} from '../hooks/useConfig'

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold lg:text-xl">Configuracoes</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie as configuracoes gerais do aplicativo
        </p>
      </div>

      <Separator />

      <TierDiscountsSection />

      <Separator />

      <DeliveryConfigSection />
    </div>
  )
}

// ── Tier Discounts ─────────────────────────────────────

function TierDiscountsSection() {
  const { data: discounts, isLoading } = useTierDiscounts()
  const updateMutation = useUpdateTierDiscounts()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium">Descontos por Tier</h3>
          <p className="text-sm text-muted-foreground">
            Porcentagem de desconto aplicada automaticamente para cada nivel de cliente
          </p>
        </div>
        <ConfigSkeleton rows={3} />
      </div>
    )
  }

  if (!discounts) return null

  return (
    <TierDiscountsForm
      initial={discounts}
      onSave={(data) => updateMutation.mutate(data)}
      isPending={updateMutation.isPending}
    />
  )
}

function TierDiscountsForm({
  initial,
  onSave,
  isPending,
}: {
  initial: { ouro: number; platina: number; diamante: number }
  onSave: (data: { ouro: number; platina: number; diamante: number }) => void
  isPending: boolean
}) {
  const [ouro, setOuro] = useState(String(initial.ouro))
  const [platina, setPlatina] = useState(String(initial.platina))
  const [diamante, setDiamante] = useState(String(initial.diamante))

  const handleSave = () => {
    const o = Number(ouro)
    const p = Number(platina)
    const d = Number(diamante)

    if (isNaN(o) || isNaN(p) || isNaN(d)) return
    if (o < 0 || p < 0 || d < 0 || o > 100 || p > 100 || d > 100) return

    if (!(o <= p && p <= d)) {
      toast.error('Os descontos devem seguir a ordem: Ouro <= Platina <= Diamante')
      return
    }

    onSave({ ouro: o, platina: p, diamante: d })
  }

  const hasChanges =
    String(initial.ouro) !== ouro ||
    String(initial.platina) !== platina ||
    String(initial.diamante) !== diamante

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium">Descontos por Tier</h3>
        <p className="text-sm text-muted-foreground">
          Porcentagem de desconto aplicada automaticamente para cada nivel de cliente
        </p>
      </div>

      <div className="max-w-sm space-y-4">
        <div className="flex items-center gap-4">
          <Label className="w-24 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block size-3 rounded-full bg-amber-500" />
              Ouro
            </span>
          </Label>
          <div className="relative">
            <Input
              type="number"
              min="0"
              max="100"
              step="1"
              value={ouro}
              onChange={(e) => setOuro(e.target.value)}
              className="h-9 w-24 pr-7"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Label className="w-24 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block size-3 rounded-full bg-slate-400" />
              Platina
            </span>
          </Label>
          <div className="relative">
            <Input
              type="number"
              min="0"
              max="100"
              step="1"
              value={platina}
              onChange={(e) => setPlatina(e.target.value)}
              className="h-9 w-24 pr-7"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Label className="w-24 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block size-3 rounded-full bg-blue-500" />
              Diamante
            </span>
          </Label>
          <div className="relative">
            <Input
              type="number"
              min="0"
              max="100"
              step="1"
              value={diamante}
              onChange={(e) => setDiamante(e.target.value)}
              className="h-9 w-24 pr-7"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || isPending}
          className="mt-2"
        >
          {isPending ? (
            <><Loader2 className="mr-1 size-4 animate-spin" /> Salvando...</>
          ) : (
            <><Save className="mr-1 size-4" /> Salvar alteracoes</>
          )}
        </Button>
      </div>
    </div>
  )
}

// ── Delivery & Payment Config ──────────────────────────

function DeliveryConfigSection() {
  const { data: config, isLoading } = useDeliveryConfig()
  const updateMutation = useUpdateDeliveryConfig()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium">Entrega & Pagamento</h3>
          <p className="text-sm text-muted-foreground">
            Configuracoes de horario, frete, desconto PIX e area de entrega
          </p>
        </div>
        <ConfigSkeleton rows={4} />
      </div>
    )
  }

  if (!config) return null

  return (
    <DeliveryConfigForm
      initial={config}
      onSave={(data) => updateMutation.mutate(data)}
      isPending={updateMutation.isPending}
    />
  )
}

function DeliveryConfigForm({
  initial,
  onSave,
  isPending,
}: {
  initial: { order_cutoff_time: string; free_shipping_min: number; pix_discount_pct: number; delivery_radius_km: number }
  onSave: (data: { order_cutoff_time: string; free_shipping_min: number; pix_discount_pct: number; delivery_radius_km: number }) => void
  isPending: boolean
}) {
  const [cutoffTime, setCutoffTime] = useState(initial.order_cutoff_time)
  const [freeShippingMin, setFreeShippingMin] = useState(String(initial.free_shipping_min))
  const [pixDiscount, setPixDiscount] = useState(String(initial.pix_discount_pct))
  const [deliveryRadius, setDeliveryRadius] = useState(String(initial.delivery_radius_km))

  const handleSave = () => {
    const min = Number(freeShippingMin)
    const pix = Number(pixDiscount)
    const radius = Number(deliveryRadius)

    if (isNaN(min) || min < 0) {
      toast.error('Valor minimo para frete gratis invalido')
      return
    }
    if (isNaN(pix) || pix < 0 || pix > 100) {
      toast.error('Desconto PIX deve ser entre 0 e 100%')
      return
    }
    if (isNaN(radius) || radius <= 0) {
      toast.error('Raio de entrega deve ser maior que zero')
      return
    }
    if (!/^\d{2}:\d{2}$/.test(cutoffTime)) {
      toast.error('Horario de corte invalido (formato HH:mm)')
      return
    }

    onSave({
      order_cutoff_time: cutoffTime,
      free_shipping_min: min,
      pix_discount_pct: pix,
      delivery_radius_km: radius,
    })
  }

  const hasChanges =
    initial.order_cutoff_time !== cutoffTime ||
    String(initial.free_shipping_min) !== freeShippingMin ||
    String(initial.pix_discount_pct) !== pixDiscount ||
    String(initial.delivery_radius_km) !== deliveryRadius

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium">Entrega & Pagamento</h3>
        <p className="text-sm text-muted-foreground">
          Configuracoes de horario, frete, desconto PIX e area de entrega
        </p>
      </div>

      <div className="max-w-sm space-y-4">
        {/* Cutoff time */}
        <div className="flex items-center gap-4">
          <Label className="w-40 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-muted-foreground" />
              Horario de corte
            </span>
          </Label>
          <Input
            type="time"
            value={cutoffTime}
            onChange={(e) => setCutoffTime(e.target.value)}
            className="h-9 w-28"
          />
        </div>
        <p className="text-xs text-muted-foreground ml-[calc(10rem+1rem)]">
          Pedidos apos esse horario vao para o proximo dia
        </p>

        {/* Free shipping minimum */}
        <div className="flex items-center gap-4">
          <Label className="w-40 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="size-4 text-muted-foreground" />
              Frete gratis a partir de
            </span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              R$
            </span>
            <Input
              type="number"
              min="0"
              step="10"
              value={freeShippingMin}
              onChange={(e) => setFreeShippingMin(e.target.value)}
              className="h-9 w-28 pl-9"
            />
          </div>
        </div>

        {/* PIX discount */}
        <div className="flex items-center gap-4">
          <Label className="w-40 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <QrCode className="size-4 text-muted-foreground" />
              Desconto PIX
            </span>
          </Label>
          <div className="relative">
            <Input
              type="number"
              min="0"
              max="100"
              step="1"
              value={pixDiscount}
              onChange={(e) => setPixDiscount(e.target.value)}
              className="h-9 w-24 pr-7"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </div>
        <div className="ml-[calc(10rem+1rem)] rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-2">
          <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
            <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
            Lembre-se de atualizar tambem no Mercado Pago
          </p>
        </div>

        {/* Delivery radius */}
        <div className="flex items-center gap-4">
          <Label className="w-40 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-muted-foreground" />
              Raio de entrega
            </span>
          </Label>
          <div className="relative">
            <Input
              type="number"
              min="1"
              step="1"
              value={deliveryRadius}
              onChange={(e) => setDeliveryRadius(e.target.value)}
              className="h-9 w-24 pr-9"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              km
            </span>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || isPending}
          className="mt-2"
        >
          {isPending ? (
            <><Loader2 className="mr-1 size-4 animate-spin" /> Salvando...</>
          ) : (
            <><Save className="mr-1 size-4" /> Salvar alteracoes</>
          )}
        </Button>
      </div>
    </div>
  )
}

// ── Shared Skeleton ────────────────────────────────────

function ConfigSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      ))}
    </div>
  )
}
