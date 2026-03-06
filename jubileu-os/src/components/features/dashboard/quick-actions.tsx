'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => router.push('/tasks')}
      >
        <Plus className="size-4" />
        Nova Tarefa
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => router.push('/docs')}
      >
        <FileText className="size-4" />
        Novo Doc
      </Button>
    </div>
  );
}
