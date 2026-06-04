import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Package,
  Plus,
  Minus,
  Trash2,
  Check,
  Pencil,
  Undo2,
  History,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  formatCurrency,
  formatDateTime,
  formatOrderNumber,
  formatFractionalQty,
} from '@/lib/format'
import { searchProducts } from '@/features/catalog/services/products'
import { useDebounce } from '@/hooks/use-debounce'
import { OrderStatusBadge } from './OrderStatusBadge'
import {
  useSeparationDetail,
  useSeparationAudit,
  useStartSeparation,
  useFinalizeSeparation,
  useConfirmSeparationItem,
  useRemoveSeparationItem,
  useRestoreSeparationItem,
  useAddSeparationItem,
} from '../hooks/useSeparation'
import type { SeparationItem, SeparationAuditEntry } from '../services/separation'
import type { Product, SeparationAuditAction } from '@/types/database'

interface OrderSeparationModalProps {
  orderId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const FRACTIONAL_STEP = 0.1
const WHOLE_STEP = 1

function isFractionalItem(item: SeparationItem): boolean {
  return (item.unit_type ?? item.product?.unit) === 'kg'
}

function formatQty(qty: number, fractional: boolean): string {
  return fractional ? formatFractionalQty(qty) : `${qty}x`
}

// ─────────────────────────────────────────────────────────
// Modal principal
// ─────────────────────────────────────────────────────────

export function OrderSeparationModal({ orderId, open, onOpenChange }: OrderSeparationModalProps) {
  const { data: order, isLoading } = useSeparationDetail(open ? orderId : null)
  const startSeparation = useStartSeparation(orderId)
  const finalizeSeparation = useFinalizeSeparation(orderId)

  const [finalizeConfirmOpen, setFinalizeConfirmOpen] = useState(false)
  const [auditOpen, setAuditOpen] = useState(false)
  const startedRef = useRef<string | null>(null)

  // pending → separating ao abrir o modal pela primeira vez
  const startMutate = startSeparation.mutate
  useEffect(() => {
    if (open && order && order.status === 'pending' && startedRef.current !== order.id) {
      startedRef.current = order.id
      startMutate(order.id)
    }
  }, [open, order, startMutate])

  const editable = order?.status === 'pending' || order?.status === 'separating'

  const activeItems = useMemo(
    () => (order?.items ?? []).filter((i) => i.separation_status !== 'removed'),
    [order?.items]
  )
  const removedItems = useMemo(
    () => (order?.items ?? []).filter((i) => i.separation_status === 'removed'),
    [order?.items]
  )
  const pendingCount = activeItems.filter((i) => i.separation_status === 'pending').length

  const originalSubtotal = order?.original_subtotal ?? order?.subtotal ?? 0
  const adjustedSubtotal = activeItems.reduce((sum, i) => sum + i.total_price, 0)
  const diff = adjustedSubtotal - originalSubtotal

  const handleFinalize = () => {
    if (!orderId) return
    finalizeSeparation.mutate(orderId, {
      onSuccess: () => {
        setFinalizeConfirmOpen(false)
        onOpenChange(false)
      },
      onSettled: () => setFinalizeConfirmOpen(false),
    })
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
          {isLoading || !order ? (
            <>
              <SheetHeader className="px-4 pt-6 pb-4 sm:px-6">
                <SheetTitle>Separação do pedido</SheetTitle>
                <SheetDescription>Carregando...</SheetDescription>
              </SheetHeader>
              <SeparationSkeleton />
            </>
          ) : (
            <>
              <SheetHeader className="border-b px-4 pt-6 pb-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <SheetTitle className="text-lg">
                    Separação — {formatOrderNumber(order.order_number)}
                  </SheetTitle>
                  <OrderStatusBadge status={order.status} />
                </div>
                <SheetDescription className="space-y-0.5">
                  <span className="block font-medium text-foreground">
                    {order.profile?.company_name ?? 'Cliente'}
                  </span>
                  {order.address && (
                    <span className="block">
                      {order.address.street}
                      {order.address.number ? `, ${order.address.number}` : ''}
                      {order.address.district ? ` — ${order.address.district}` : ''}
                      {order.address.city ? `, ${order.address.city}` : ''}
                    </span>
                  )}
                </SheetDescription>
              </SheetHeader>

              {/* Conteúdo scrollável */}
              <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-6">
                {!editable && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                    Este pedido já saiu da separação — visualização somente leitura.
                  </div>
                )}

                {/* Itens ativos */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">
                    Itens ({activeItems.length})
                    {pendingCount > 0 && editable && (
                      <span className="ml-2 text-xs font-normal text-amber-600">
                        {pendingCount} aguardando confirmação
                      </span>
                    )}
                  </h4>
                  <div className="space-y-2">
                    {activeItems.map((item) => (
                      <SeparationItemRow
                        key={item.id}
                        item={item}
                        orderId={order.id}
                        editable={editable}
                      />
                    ))}
                    {activeItems.length === 0 && (
                      <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
                        Nenhum item ativo na separação
                      </p>
                    )}
                  </div>
                </div>

                {/* Itens removidos */}
                {removedItems.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Removidos ({removedItems.length})
                    </h4>
                    <div className="space-y-2">
                      {removedItems.map((item) => (
                        <SeparationItemRow
                          key={item.id}
                          item={item}
                          orderId={order.id}
                          editable={editable}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Adicionar item */}
                {editable && <AddItemSection orderId={order.id} />}

                <Separator />

                {/* Audit */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setAuditOpen((v) => !v)}
                    className="flex w-full items-center gap-2 text-sm font-medium"
                  >
                    <History className="size-4 text-muted-foreground" />
                    Histórico da separação
                    {auditOpen ? (
                      <ChevronUp className="ml-auto size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="ml-auto size-4 text-muted-foreground" />
                    )}
                  </button>
                  {auditOpen && <AuditPanel orderId={order.id} enabled={auditOpen} />}
                </div>
              </div>

              {/* Footer fixo: totais + ações */}
              <div className="border-t bg-background px-4 py-4 sm:px-6">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal original</span>
                    <span
                      className={cn(
                        'tabular-nums',
                        diff !== 0 && 'line-through'
                      )}
                    >
                      {formatCurrency(originalSubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal ajustado</span>
                    <span className="tabular-nums">{formatCurrency(adjustedSubtotal)}</span>
                  </div>
                  {diff !== 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Diferença</span>
                      <span
                        className={cn(
                          'tabular-nums font-medium',
                          diff < 0 ? 'text-emerald-600' : 'text-red-600'
                        )}
                      >
                        {diff > 0 ? '+' : ''}
                        {formatCurrency(diff)}
                      </span>
                    </div>
                  )}
                </div>

                {editable && (
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => onOpenChange(false)}
                    >
                      Salvar rascunho e fechar
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={pendingCount > 0 || finalizeSeparation.isPending}
                      onClick={() => setFinalizeConfirmOpen(true)}
                    >
                      {finalizeSeparation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      Marcar como separado
                    </Button>
                  </div>
                )}
                {editable && pendingCount > 0 && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Confirme ou remova todos os itens para finalizar
                  </p>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirmação de finalização */}
      <AlertDialog open={finalizeConfirmOpen} onOpenChange={setFinalizeConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar separação</AlertDialogTitle>
            <AlertDialogDescription>
              O pedido {order ? formatOrderNumber(order.order_number) : ''} será marcado como
              separado com total de <strong>{formatCurrency(adjustedSubtotal)}</strong>. O cliente
              será notificado para realizar o pagamento. Após finalizar, os itens não podem mais
              ser editados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalize} disabled={finalizeSeparation.isPending}>
              {finalizeSeparation.isPending ? 'Finalizando...' : 'Finalizar separação'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// Linha de item editável
// ─────────────────────────────────────────────────────────

interface SeparationItemRowProps {
  item: SeparationItem
  orderId: string
  editable: boolean
}

function SeparationItemRow({ item, orderId, editable }: SeparationItemRowProps) {
  const fractional = isFractionalItem(item)
  const step = fractional ? FRACTIONAL_STEP : WHOLE_STEP
  const minQty = fractional ? FRACTIONAL_STEP : WHOLE_STEP

  const confirmItem = useConfirmSeparationItem(orderId)
  const removeItem = useRemoveSeparationItem(orderId)
  const restoreItem = useRestoreSeparationItem(orderId)

  const isConfirmed =
    item.separation_status === 'separated' ||
    item.separation_status === 'added' ||
    item.separation_status === 'substituted'
  const isRemoved = item.separation_status === 'removed'

  const [editing, setEditing] = useState(item.separation_status === 'pending')
  const [qty, setQty] = useState(item.quantity)
  const [note, setNote] = useState(item.separation_note ?? '')
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false)

  const originalQty = item.original_quantity ?? item.quantity
  const qtyModified = qty !== originalQty

  const adjustQty = (delta: number) => {
    setQty((prev) => {
      const next = Number((prev + delta).toFixed(1))
      return Math.max(minQty, next)
    })
  }

  const handleConfirm = () => {
    confirmItem.mutate(
      { item, quantity: qty, note },
      { onSuccess: () => setEditing(false) }
    )
  }

  const busy = confirmItem.isPending || removeItem.isPending || restoreItem.isPending

  // ── Item removido: linha esmaecida + restaurar ──
  if (isRemoved) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed bg-muted/30 p-2.5 opacity-70">
        <ItemThumb item={item} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium line-through">
            {item.product?.name ?? 'Produto removido'}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatQty(originalQty, fractional)} × {formatCurrency(item.unit_price)}
          </p>
        </div>
        {editable && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 shrink-0 text-xs"
            disabled={busy}
            onClick={() => restoreItem.mutate(item)}
          >
            <Undo2 className="size-3.5" />
            Restaurar
          </Button>
        )}
      </div>
    )
  }

  // ── Item confirmado (visualização compacta) ──
  if (isConfirmed && !editing) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/40 p-2.5 dark:border-emerald-900 dark:bg-emerald-950/20">
        <ItemThumb item={item} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-medium">
              {item.product?.name ?? 'Produto removido'}
            </p>
            {(item.separation_status === 'added' || item.separation_status === 'substituted') && (
              <Badge variant="outline" className="h-4 shrink-0 px-1 text-[10px]">
                {item.separation_status === 'added' ? 'Adicionado' : 'Substituição'}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {qtyModified && item.original_quantity !== null && (
              <span className="mr-1 line-through">{formatQty(originalQty, fractional)}</span>
            )}
            <span className={cn(qtyModified && 'font-medium text-foreground')}>
              {formatQty(item.quantity, fractional)}
            </span>{' '}
            × {formatCurrency(item.unit_price)}
            {item.separation_note && (
              <span className="ml-1 italic">— "{item.separation_note}"</span>
            )}
          </p>
        </div>
        <span className="shrink-0 text-sm font-semibold tabular-nums">
          {formatCurrency(item.total_price)}
        </span>
        <Check className="size-4 shrink-0 text-emerald-600" />
        {editable && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            disabled={busy}
            onClick={() => {
              setQty(item.quantity)
              setNote(item.separation_note ?? '')
              setEditing(true)
            }}
            aria-label="Editar item"
          >
            <Pencil className="size-3.5" />
          </Button>
        )}
      </div>
    )
  }

  // ── Item em edição (pending ou re-edição) ──
  return (
    <>
      <div className="space-y-2.5 rounded-lg border p-3">
        <div className="flex items-center gap-3">
          <ItemThumb item={item} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {item.product?.name ?? 'Produto removido'}
            </p>
            <p className="text-xs text-muted-foreground">
              Pedido:{' '}
              <span className={cn(qtyModified && 'line-through')}>
                {formatQty(originalQty, fractional)}
              </span>
              {' · '}
              {formatCurrency(item.unit_price)}
              {fractional ? '/kg' : '/un'}
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold tabular-nums">
            {formatCurrency(Number((qty * item.unit_price).toFixed(2)))}
          </span>
        </div>

        {editable && (
          <>
            <div className="flex items-center gap-2">
              {/* Stepper */}
              <div className="flex items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-r-none"
                  disabled={busy || qty <= minQty}
                  onClick={() => adjustQty(-step)}
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="size-3.5" />
                </Button>
                <Input
                  type="number"
                  inputMode="decimal"
                  step={step}
                  min={minQty}
                  value={qty}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    if (!Number.isNaN(v) && v >= 0) setQty(v)
                  }}
                  onBlur={() => {
                    if (qty < minQty) setQty(minQty)
                  }}
                  className="h-8 w-20 rounded-none border-x-0 border-y-0 text-center text-sm tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  disabled={busy}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-l-none"
                  disabled={busy}
                  onClick={() => adjustQty(step)}
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">
                {fractional ? 'kg' : 'unidades'}
              </span>

              <div className="ml-auto flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                  disabled={busy}
                  onClick={() => setRemoveConfirmOpen(true)}
                  aria-label="Remover item"
                >
                  <Trash2 className="size-4" />
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  disabled={busy || qty < minQty}
                  onClick={handleConfirm}
                >
                  {confirmItem.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  Confirmar
                </Button>
              </div>
            </div>

            <Input
              placeholder="Anotação (opcional) — ex: pacote fechado 1,2kg"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-8 text-xs"
              disabled={busy}
            />
          </>
        )}
      </div>

      {/* Confirmação de remoção */}
      <AlertDialog open={removeConfirmOpen} onOpenChange={setRemoveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover item da separação</AlertDialogTitle>
            <AlertDialogDescription>
              Remover <strong>{item.product?.name ?? 'este item'}</strong> da separação? O cliente
              verá o item como indisponível. Você pode restaurá-lo enquanto a separação não for
              finalizada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                removeItem.mutate(item)
                setRemoveConfirmOpen(false)
              }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function ItemThumb({ item }: { item: SeparationItem }) {
  return (
    <div className="size-10 shrink-0 overflow-hidden rounded border bg-muted/30">
      {item.product?.image_url ? (
        <img src={item.product.image_url} alt="" className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center">
          <Package className="size-4 text-muted-foreground/40" />
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Adicionar item (busca de produto)
// ─────────────────────────────────────────────────────────

function AddItemSection({ orderId }: { orderId: string }) {
  const [expanded, setExpanded] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const addItem = useAddSeparationItem(orderId)

  const { data: results, isLoading } = useQuery({
    queryKey: ['admin', 'separation', 'product-search', debouncedSearch],
    queryFn: () => searchProducts(debouncedSearch),
    enabled: expanded && debouncedSearch.trim().length >= 2,
  })

  const handleAdd = (product: Product) => {
    addItem.mutate(
      {
        orderId,
        product,
        quantity: 1,
      },
      {
        onSuccess: () => {
          setSearch('')
          setExpanded(false)
        },
      }
    )
  }

  if (!expanded) {
    return (
      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={() => setExpanded(true)}
      >
        <Plus className="size-4" />
        Adicionar item (substituição)
      </Button>
    )
  }

  return (
    <div className="space-y-2 rounded-lg border border-dashed p-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Buscar produto para adicionar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 text-xs"
          onClick={() => {
            setExpanded(false)
            setSearch('')
          }}
        >
          Cancelar
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && results && results.length > 0 && (
        <div className="max-h-60 space-y-1.5 overflow-y-auto">
          {results.map((product) => {
            const defaultVariant =
              product.variants?.find((v) => v.is_default) ?? product.variants?.[0] ?? null
            const price = defaultVariant?.unit_price ?? product.price
            return (
              <button
                key={product.id}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border p-2 text-left transition-colors hover:bg-muted/50 disabled:opacity-50"
                disabled={addItem.isPending}
                onClick={() => handleAdd(product)}
              >
                <div className="size-9 shrink-0 overflow-hidden rounded border bg-muted/30">
                  {product.image_url ? (
                    <img src={product.image_url} alt="" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Package className="size-4 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(price)}
                    {product.unit === 'kg' ? '/kg' : ''}
                  </p>
                </div>
                <Plus className="size-4 shrink-0 text-muted-foreground" />
              </button>
            )
          })}
        </div>
      )}

      {!isLoading && debouncedSearch.trim().length >= 2 && results?.length === 0 && (
        <p className="py-3 text-center text-xs text-muted-foreground">
          Nenhum produto encontrado para "{debouncedSearch}"
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Painel de audit
// ─────────────────────────────────────────────────────────

const AUDIT_LABELS: Record<SeparationAuditAction, string> = {
  separation_started: 'Separação iniciada',
  qty_changed: 'Quantidade alterada',
  item_removed: 'Item removido',
  item_added: 'Item adicionado',
  item_substituted: 'Item substituído',
  note_added: 'Anotação adicionada',
  separation_completed: 'Separação finalizada',
  separation_reverted: 'Ação desfeita',
}

function auditDetail(entry: SeparationAuditEntry): string | null {
  const p = entry.payload as Record<string, unknown>
  const productName = typeof p.product_name === 'string' ? p.product_name : null

  switch (entry.action) {
    case 'qty_changed': {
      const before = (p.before as { quantity?: number })?.quantity
      const after = (p.after as { quantity?: number })?.quantity
      if (before !== undefined && after !== undefined) {
        return `${productName ? `${productName}: ` : ''}${before} → ${after}`
      }
      return productName
    }
    case 'item_removed':
    case 'item_added':
    case 'item_substituted':
      return productName
    case 'note_added':
      return typeof p.note === 'string'
        ? `${productName ? `${productName}: ` : ''}"${p.note}"`
        : productName
    case 'separation_completed': {
      const newTotal = typeof p.new_total === 'number' ? p.new_total : null
      return newTotal !== null ? `Total final: ${formatCurrency(newTotal)}` : null
    }
    default:
      return null
  }
}

function AuditPanel({ orderId, enabled }: { orderId: string; enabled: boolean }) {
  const { data: entries, isLoading } = useSeparationAudit(orderId, enabled)

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!entries || entries.length === 0) {
    return (
      <p className="py-2 text-center text-xs text-muted-foreground">
        Nenhuma ação registrada ainda
      </p>
    )
  }

  return (
    <div className="max-h-48 space-y-1.5 overflow-y-auto">
      {entries.map((entry) => {
        const detail = auditDetail(entry)
        return (
          <div key={entry.id} className="rounded-md border bg-muted/30 px-2.5 py-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{AUDIT_LABELS[entry.action] ?? entry.action}</span>
              <span className="shrink-0 text-muted-foreground">
                {formatDateTime(entry.created_at)}
              </span>
            </div>
            {detail && <p className="mt-0.5 text-muted-foreground">{detail}</p>}
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────

function SeparationSkeleton() {
  return (
    <div className="space-y-4 px-4 pt-2 sm:px-6">
      <Skeleton className="h-5 w-48" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  )
}
