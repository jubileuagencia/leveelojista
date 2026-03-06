'use client';

import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" disabled>
        <Plus className="size-4" />
        Nova Tarefa
      </Button>
      <Button size="sm" variant="outline" disabled>
        <FileText className="size-4" />
        Novo Doc
      </Button>
    </div>
  );
}
