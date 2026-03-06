'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateNotionPage } from '@/hooks/use-notion';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreatePageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string;
  onCreated?: (pageId: string) => void;
}

export function CreatePageDialog({
  open,
  onOpenChange,
  parentId,
  onCreated,
}: CreatePageDialogProps) {
  const [title, setTitle] = useState('');
  const createPage = useCreateNotionPage();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !parentId) return;

    try {
      const page = await createPage.mutateAsync({
        parentId,
        title: title.trim(),
      });
      toast.success('Pagina criada');
      setTitle('');
      onOpenChange(false);
      onCreated?.(page.id);
    } catch {
      toast.error('Erro ao criar pagina');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Pagina</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="page-title" className="text-sm font-medium">
              Titulo *
            </label>
            <Input
              id="page-title"
              placeholder="Titulo da pagina"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !parentId || createPage.isPending}
            >
              {createPage.isPending && <Loader2 className="animate-spin" />}
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
