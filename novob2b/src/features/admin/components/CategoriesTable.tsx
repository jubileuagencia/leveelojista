import { ChevronUp, ChevronDown, Pencil, Trash2, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Category } from '@/types/database'

interface CategoriesTableProps {
  categories: Category[]
  loading?: boolean
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
}

export function CategoriesTable({
  categories,
  loading,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: CategoriesTableProps) {
  if (loading) return <CategoriesTableSkeleton />

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Layers className="size-12 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Nenhuma categoria</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Crie a primeira categoria</p>
      </div>
    )
  }

  return (
    <>
      {/* ── Mobile: Card List ── */}
      <div className="flex flex-col gap-2 md:hidden">
        {categories.map((cat, i) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            {/* Reorder */}
            <div className="flex flex-col gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                disabled={i === 0}
                onClick={() => onMoveUp(i)}
              >
                <ChevronUp className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                disabled={i === categories.length - 1}
                onClick={() => onMoveDown(i)}
              >
                <ChevronDown className="size-4" />
              </Button>
            </div>

            {/* Info */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {cat.icon && <span className="text-lg">{cat.icon}</span>}
              {cat.color && (
                <span
                  className="size-4 shrink-0 rounded-full border"
                  style={{ backgroundColor: cat.color }}
                />
              )}
              <span className="text-sm font-medium truncate">{cat.name}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={() => onEdit(cat)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 text-destructive hover:text-destructive"
                onClick={() => onDelete(cat)}
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
              <th className="w-20 px-3 py-3 text-center font-medium">Ordem</th>
              <th className="px-3 py-3 text-left font-medium">Nome</th>
              <th className="px-3 py-3 text-center font-medium">Ícone</th>
              <th className="px-3 py-3 text-center font-medium">Cor</th>
              <th className="w-28 px-3 py-3 text-center font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id} className="border-b transition-colors hover:bg-muted/30">
                <td className="px-3 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      disabled={i === 0}
                      onClick={() => onMoveUp(i)}
                    >
                      <ChevronUp className="size-3.5" />
                    </Button>
                    <span className="text-xs text-muted-foreground tabular-nums w-4 text-center">
                      {i + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      disabled={i === categories.length - 1}
                      onClick={() => onMoveDown(i)}
                    >
                      <ChevronDown className="size-3.5" />
                    </Button>
                  </div>
                </td>
                <td className="px-3 py-2.5 font-medium">{cat.name}</td>
                <td className="px-3 py-2.5 text-center text-lg">{cat.icon ?? '—'}</td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-center">
                    {cat.color ? (
                      <span
                        className="size-5 rounded-full border"
                        style={{ backgroundColor: cat.color }}
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => onEdit(cat)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(cat)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function CategoriesTableSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-2 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
            <Skeleton className="size-7" />
            <Skeleton className="h-4 w-28 flex-1" />
            <Skeleton className="size-9" />
          </div>
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-3"><Skeleton className="mx-auto h-4 w-12" /></th>
              <th className="px-3 py-3"><Skeleton className="h-4 w-20" /></th>
              <th className="px-3 py-3"><Skeleton className="mx-auto h-4 w-10" /></th>
              <th className="px-3 py-3"><Skeleton className="mx-auto h-4 w-10" /></th>
              <th className="px-3 py-3"><Skeleton className="mx-auto h-4 w-14" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b">
                <td className="px-3 py-2.5"><Skeleton className="mx-auto h-4 w-12" /></td>
                <td className="px-3 py-2.5"><Skeleton className="h-4 w-28" /></td>
                <td className="px-3 py-2.5"><Skeleton className="mx-auto h-5 w-5 rounded-full" /></td>
                <td className="px-3 py-2.5"><Skeleton className="mx-auto h-5 w-5 rounded-full" /></td>
                <td className="px-3 py-2.5"><Skeleton className="mx-auto h-4 w-16" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
