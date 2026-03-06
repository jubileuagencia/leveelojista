'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trash2, X } from 'lucide-react';

interface BulkActionsBarProps {
  count: number;
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onClear: () => void;
  loading?: boolean;
}

export function BulkActionsBar({
  count,
  onActivate,
  onDeactivate,
  onDelete,
  onClear,
  loading,
}: BulkActionsBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border bg-background px-4 py-2 shadow-lg">
      <span className="text-sm font-medium">{count} selecionado(s)</span>

      <div className="mx-2 h-4 w-px bg-border" />

      <Button size="sm" variant="outline" onClick={onActivate} disabled={loading}>
        <CheckCircle className="mr-1 size-3.5" />
        Ativar
      </Button>
      <Button size="sm" variant="outline" onClick={onDeactivate} disabled={loading}>
        <XCircle className="mr-1 size-3.5" />
        Desativar
      </Button>
      <Button size="sm" variant="destructive" onClick={onDelete} disabled={loading}>
        <Trash2 className="mr-1 size-3.5" />
        Excluir
      </Button>

      <div className="mx-2 h-4 w-px bg-border" />

      <Button size="sm" variant="ghost" onClick={onClear} disabled={loading}>
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
