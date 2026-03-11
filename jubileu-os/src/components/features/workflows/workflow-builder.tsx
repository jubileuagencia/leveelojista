'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StepEditor } from './step-editor';
import { useCreateWorkflow, useUpdateWorkflow } from '@/hooks/use-workflows';
import type {
  WorkflowDefinitionRecord,
  WorkflowStepDef,
  WorkflowCategory,
  WorkflowCreateInput,
} from '@/hooks/use-workflows';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES: { value: WorkflowCategory; label: string }[] = [
  { value: 'content', label: 'Conteudo' },
  { value: 'client', label: 'Cliente' },
  { value: 'development', label: 'Desenvolvimento' },
  { value: 'operations', label: 'Operacoes' },
  { value: 'custom', label: 'Custom' },
];

const ICON_OPTIONS = ['📋', '🤝', '📱', '🚀', '📊', '🎨', '💻', '📝', '⚡', '🔧', '📦', '🎯'];

function generateStepId(): string {
  return `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function createEmptyStep(): WorkflowStepDef {
  return {
    id: generateStepId(),
    title: '',
    description: '',
    type: 'manual',
  };
}

interface WorkflowBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingWorkflow?: WorkflowDefinitionRecord | null;
}

export function WorkflowBuilder({
  open,
  onOpenChange,
  editingWorkflow,
}: WorkflowBuilderProps) {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const updateWorkflow = useUpdateWorkflow();
  const isEditing = !!editingWorkflow;

  const [name, setName] = useState(editingWorkflow?.name ?? '');
  const [description, setDescription] = useState(editingWorkflow?.description ?? '');
  const [icon, setIcon] = useState(editingWorkflow?.icon ?? '📋');
  const [category, setCategory] = useState<WorkflowCategory>(
    editingWorkflow?.category ?? 'custom'
  );
  const [steps, setSteps] = useState<WorkflowStepDef[]>(
    editingWorkflow?.steps ?? [createEmptyStep()]
  );

  // Reset form when dialog opens with different workflow
  function resetForm() {
    setName(editingWorkflow?.name ?? '');
    setDescription(editingWorkflow?.description ?? '');
    setIcon(editingWorkflow?.icon ?? '📋');
    setCategory(editingWorkflow?.category ?? 'custom');
    setSteps(editingWorkflow?.steps ?? [createEmptyStep()]);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  function addStep() {
    setSteps([...steps, createEmptyStep()]);
  }

  function updateStep(index: number, step: WorkflowStepDef) {
    const next = [...steps];
    next[index] = step;
    setSteps(next);
  }

  function removeStep(index: number) {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  }

  function moveStep(from: number, to: number) {
    if (to < 0 || to >= steps.length) return;
    const next = [...steps];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setSteps(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validSteps = steps.filter((s) => s.title.trim());
    if (!name.trim()) {
      toast.error('Nome do workflow obrigatorio');
      return;
    }
    if (validSteps.length === 0) {
      toast.error('Adicione pelo menos 1 step com titulo');
      return;
    }

    const payload: WorkflowCreateInput = {
      name: name.trim(),
      description: description.trim() || undefined,
      icon,
      category,
      steps: validSteps,
    };

    try {
      if (isEditing && editingWorkflow) {
        await updateWorkflow.mutateAsync({ id: editingWorkflow.id, body: payload });
        toast.success('Workflow atualizado');
      } else {
        await createWorkflow.mutateAsync(payload);
        toast.success('Workflow criado');
      }
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error('Erro ao salvar workflow');
    }
  }

  const isPending = createWorkflow.isPending || updateWorkflow.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Workflow' : 'Novo Workflow'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metadata */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="wf-name">Nome</Label>
              <Input
                id="wf-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Producao de Conteudo Semanal"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="wf-desc">Descricao</Label>
              <Textarea
                id="wf-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o objetivo deste workflow"
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Icone</Label>
              <div className="flex flex-wrap gap-1.5">
                {ICON_OPTIONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    className={`flex size-9 items-center justify-center rounded-md border text-lg transition-colors ${
                      icon === ic
                        ? 'border-primary bg-primary/10'
                        : 'border-transparent hover:bg-muted'
                    }`}
                    onClick={() => setIcon(ic)}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wf-category">Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as WorkflowCategory)}>
                <SelectTrigger id="wf-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Steps ({steps.length})</Label>
              <Button type="button" variant="outline" size="sm" onClick={addStep}>
                <Plus className="size-3.5" />
                Adicionar Step
              </Button>
            </div>

            {steps.map((step, i) => (
              <StepEditor
                key={step.id}
                step={step}
                index={i}
                totalSteps={steps.length}
                allSteps={steps}
                onChange={(s) => updateStep(i, s)}
                onRemove={() => removeStep(i)}
                onMoveUp={() => moveStep(i, i - 1)}
                onMoveDown={() => moveStep(i, i + 1)}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isEditing ? 'Salvar' : 'Criar Workflow'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
