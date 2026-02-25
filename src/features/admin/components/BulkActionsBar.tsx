import { CheckCircle2, XCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BulkActionsBarProps {
  count: number
  onActivate: () => void
  onDeactivate: () => void
  onDelete: () => void
  onClear: () => void
  loading?: boolean
}

export function BulkActionsBar({
  count,
  onActivate,
  onDeactivate,
  onDelete,
  onClear,
  loading,
}: BulkActionsBarProps) {
  if (count === 0) return null

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm">
      <span className="font-medium">
        {count} selecionado{count > 1 ? 's' : ''}
      </span>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={onActivate}
          disabled={loading}
        >
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Ativar</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={onDeactivate}
          disabled={loading}
        >
          <XCircle className="size-3.5 text-amber-600" />
          <span className="hidden sm:inline">Desativar</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs text-destructive hover:text-destructive"
          onClick={onDelete}
          disabled={loading}
        >
          <Trash2 className="size-3.5" />
          <span className="hidden sm:inline">Excluir</span>
        </Button>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClear}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
