import { useState } from 'react'
import { Package, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/database'

interface ProductsTableProps {
  products: Product[]
  loading?: boolean
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onEdit: (product: Product) => void
  onToggleActive: (id: string, isActive: boolean) => void
  onDelete: (id: string) => void
}

export function ProductsTable({
  products,
  loading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onToggleActive,
  onDelete,
}: ProductsTableProps) {
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  if (loading) {
    return <ProductsTableSkeleton />
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="size-12 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Nenhum produto encontrado</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Tente ajustar os filtros ou crie um novo produto</p>
      </div>
    )
  }

  const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id))

  return (
    <>
      {/* ── Mobile: Card List ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border p-3 transition-colors active:bg-muted/50',
              selectedIds.has(product.id) && 'bg-emerald-50/50 border-emerald-200'
            )}
            onClick={() => onEdit(product)}
            role="button"
            tabIndex={0}
          >
            {/* Checkbox — stop propagation to avoid edit */}
            <div
              className="pt-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={selectedIds.has(product.id)}
                onCheckedChange={() => onToggleSelect(product.id)}
                aria-label={`Selecionar ${product.name}`}
              />
            </div>

            {/* Image */}
            <div className="size-12 shrink-0 overflow-hidden rounded-lg border bg-muted/30">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <Package className="size-5 text-muted-foreground/40" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span>#{product.display_id}</span>
                <span>&middot;</span>
                <span>{product.unit}</span>
                {product.categories?.name && (
                  <>
                    <span>&middot;</span>
                    <span>{product.categories.name}</span>
                  </>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-semibold">{formatCurrency(product.price)}</span>
                <Badge
                  variant={product.is_active ? 'default' : 'secondary'}
                  className={cn(
                    'text-[10px] px-1.5 py-0',
                    product.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''
                  )}
                >
                  {product.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 flex-col gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-9"
                onClick={() => onEdit(product)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-9 text-destructive hover:text-destructive"
                onClick={() => setDeleteProduct(product)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: Table ── */}
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-10 px-3 py-3">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onToggleSelectAll}
                  aria-label="Selecionar todos"
                />
              </th>
              <th className="px-3 py-3 text-left font-medium">Produto</th>
              <th className="px-3 py-3 text-left font-medium">Categoria</th>
              <th className="px-3 py-3 text-right font-medium">Preço</th>
              <th className="px-3 py-3 text-center font-medium">Status</th>
              <th className="w-12 px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className={cn(
                  'border-b transition-colors hover:bg-muted/30 cursor-pointer',
                  selectedIds.has(product.id) && 'bg-emerald-50/50'
                )}
                onClick={() => onEdit(product)}
              >
                {/* Checkbox */}
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(product.id)}
                    onCheckedChange={() => onToggleSelect(product.id)}
                    aria-label={`Selecionar ${product.name}`}
                  />
                </td>

                {/* Product info */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="size-10 shrink-0 overflow-hidden rounded-lg border bg-muted/30">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="size-full object-cover" />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Package className="size-4 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ID #{product.display_id} &middot; {product.unit}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-3 py-2.5">
                  {product.categories?.name ? (
                    <Badge variant="secondary" className="text-xs">
                      {product.categories.name}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>

                {/* Price */}
                <td className="px-3 py-2.5 text-right font-medium tabular-nums">
                  {formatCurrency(product.price)}
                </td>

                {/* Status toggle */}
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center">
                    <Switch
                      checked={product.is_active}
                      onCheckedChange={(v) => onToggleActive(product.id, v)}
                      aria-label={product.is_active ? 'Desativar' : 'Ativar'}
                    />
                  </div>
                </td>

                {/* Actions */}
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-xs" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Pencil className="mr-2 size-3.5" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteProduct(product)}
                      >
                        <Trash2 className="mr-2 size-3.5" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Delete Confirmation (shared) ── */}
      <AlertDialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              O produto &quot;{deleteProduct?.name}&quot; será desativado e removido do catálogo. Esta ação pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteProduct) onDelete(deleteProduct.id)
                setDeleteProduct(null)
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function ProductsTableSkeleton() {
  return (
    <>
      {/* Mobile skeleton */}
      <div className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
            <Skeleton className="size-4 mt-0.5" />
            <Skeleton className="size-12 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop skeleton */}
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-10 px-3 py-3"><Skeleton className="size-4" /></th>
              <th className="px-3 py-3 text-left"><Skeleton className="h-4 w-16" /></th>
              <th className="px-3 py-3"><Skeleton className="h-4 w-16" /></th>
              <th className="px-3 py-3 text-right"><Skeleton className="ml-auto h-4 w-12" /></th>
              <th className="px-3 py-3"><Skeleton className="mx-auto h-4 w-10" /></th>
              <th className="w-12 px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b">
                <td className="px-3 py-2.5"><Skeleton className="size-4" /></td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="px-3 py-2.5 text-right"><Skeleton className="ml-auto h-4 w-16" /></td>
                <td className="px-3 py-2.5"><Skeleton className="mx-auto h-5 w-9 rounded-full" /></td>
                <td className="px-3 py-2.5"><Skeleton className="size-7 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
