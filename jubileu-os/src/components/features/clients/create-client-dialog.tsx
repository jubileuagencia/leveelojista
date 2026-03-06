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
import { useCreateClient } from '@/hooks/use-clients';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function CreateClientDialog({ open, onOpenChange }: CreateClientDialogProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [clickupTag, setClickupTag] = useState('');
  const createClient = useCreateClient();

  function handleNameChange(value: string) {
    setName(value);
    if (!slugManual) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlug(value);
    setSlugManual(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    try {
      await createClient.mutateAsync({
        name: name.trim(),
        slug: slug.trim(),
        clickup_tag: clickupTag.trim() || undefined,
      });
      toast.success('Cliente criado');
      setName('');
      setSlug('');
      setSlugManual(false);
      setClickupTag('');
      onOpenChange(false);
    } catch {
      toast.error('Erro ao criar cliente');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="client-name" className="text-sm font-medium">
              Nome *
            </label>
            <Input
              id="client-name"
              placeholder="Nome do cliente"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="client-slug" className="text-sm font-medium">
              Slug *
            </label>
            <Input
              id="client-slug"
              placeholder="slug-do-cliente"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Usado na URL: /clients/{slug || '...'}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="clickup-tag" className="text-sm font-medium">
              Tag ClickUp
            </label>
            <Input
              id="clickup-tag"
              placeholder="ex: pelicula-sideral"
              value={clickupTag}
              onChange={(e) => setClickupTag(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Filtra tarefas do ClickUp por essa tag
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim() || !slug.trim() || createClient.isPending}>
              {createClient.isPending && <Loader2 className="animate-spin" />}
              Criar Cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
