import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useTierDiscounts, useUpdateTierDiscounts } from '../hooks/useConfig'

export default function ConfigPage() {
  const { data: discounts, isLoading } = useTierDiscounts()
  const updateMutation = useUpdateTierDiscounts()

  const [bronze, setBronze] = useState('')
  const [silver, setSilver] = useState('')
  const [gold, setGold] = useState('')

  useEffect(() => {
    if (discounts) {
      setBronze(String(discounts.bronze))
      setSilver(String(discounts.silver))
      setGold(String(discounts.gold))
    }
  }, [discounts])

  const handleSave = () => {
    const b = Number(bronze)
    const s = Number(silver)
    const g = Number(gold)

    if (isNaN(b) || isNaN(s) || isNaN(g)) return
    if (b < 0 || s < 0 || g < 0 || b > 100 || s > 100 || g > 100) return

    if (!(b <= s && s <= g)) {
      toast.error('Os descontos devem seguir a ordem: Bronze <= Silver <= Gold')
      return
    }

    updateMutation.mutate({ bronze: b, silver: s, gold: g })
  }

  const hasChanges =
    discounts &&
    (String(discounts.bronze) !== bronze ||
      String(discounts.silver) !== silver ||
      String(discounts.gold) !== gold)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold lg:text-xl">Configurações</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie as configurações gerais do aplicativo
        </p>
      </div>

      <Separator />

      {/* Tier Discounts */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium">Descontos por Tier</h3>
          <p className="text-sm text-muted-foreground">
            Porcentagem de desconto aplicada automaticamente para cada nível de cliente
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-sm space-y-4">
            <div className="flex items-center gap-4">
              <Label className="w-20 shrink-0">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block size-3 rounded-full bg-amber-500" />
                  Bronze
                </span>
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={bronze}
                  onChange={(e) => setBronze(e.target.value)}
                  className="h-9 w-24 pr-7"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-20 shrink-0">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block size-3 rounded-full bg-slate-400" />
                  Silver
                </span>
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={silver}
                  onChange={(e) => setSilver(e.target.value)}
                  className="h-9 w-24 pr-7"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-20 shrink-0">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block size-3 rounded-full bg-yellow-500" />
                  Gold
                </span>
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={gold}
                  onChange={(e) => setGold(e.target.value)}
                  className="h-9 w-24 pr-7"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateMutation.isPending}
              className="mt-2"
            >
              {updateMutation.isPending ? (
                <><Loader2 className="mr-1 size-4 animate-spin" /> Salvando...</>
              ) : (
                <><Save className="mr-1 size-4" /> Salvar alterações</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
