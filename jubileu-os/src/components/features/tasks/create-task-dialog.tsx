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
import { useCreateTask } from '@/hooks/use-clickup';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
}

export function CreateTaskDialog({ open, onOpenChange, listId }: CreateTaskDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(3); // normal
  const createTask = useCreateTask(listId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createTask.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        priority,
      });
      toast.success('Tarefa criada');
      setName('');
      setDescription('');
      setPriority(3);
      onOpenChange(false);
    } catch {
      toast.error('Erro ao criar tarefa');
    }
  }

  const priorities = [
    { value: 1, label: 'Urgente', color: 'text-red-500' },
    { value: 2, label: 'Alta', color: 'text-amber-500' },
    { value: 3, label: 'Normal', color: 'text-blue-500' },
    { value: 4, label: 'Baixa', color: 'text-zinc-400' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="task-name" className="text-sm font-medium">
              Nome *
            </label>
            <Input
              id="task-name"
              placeholder="Nome da tarefa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="task-desc" className="text-sm font-medium">
              Descricao
            </label>
            <textarea
              id="task-desc"
              placeholder="Descricao opcional..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Prioridade</label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <Button
                  key={p.value}
                  type="button"
                  variant={priority === p.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriority(p.value)}
                  className={priority !== p.value ? p.color : ''}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim() || createTask.isPending}>
              {createTask.isPending && <Loader2 className="animate-spin" />}
              Criar Tarefa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
