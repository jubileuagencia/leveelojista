'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateDeliverable } from '@/hooks/use-deliverables';
import { DELIVERABLE_TYPE_LABELS } from '@/types';
import type { DeliverableType } from '@/types';

interface CreateDeliverableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

export function CreateDeliverableDialog({ open, onOpenChange, clientId }: CreateDeliverableDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<DeliverableType>('design');
  const [dueDate, setDueDate] = useState('');

  const createMutation = useCreateDeliverable();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    createMutation.mutate(
      {
        client_id: clientId,
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setTitle('');
          setDescription('');
          setType('design');
          setDueDate('');
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Entrega</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titulo</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Pack de Posts Instagram — Marco"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descricao</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descricao da entrega"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as DeliverableType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(DELIVERABLE_TYPE_LABELS) as [DeliverableType, string][]).map(
                    ([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Prazo</Label>
              <Input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || createMutation.isPending}>
              {createMutation.isPending ? 'Criando...' : 'Criar Entrega'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
