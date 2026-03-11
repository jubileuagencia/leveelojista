'use client';

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
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import type { WorkflowStepDef } from '@/hooks/use-workflows';

const STEP_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'automated', label: 'Automatico' },
  { value: 'approval', label: 'Aprovacao' },
  { value: 'agent', label: 'Agente IA' },
] as const;

interface StepEditorProps {
  step: WorkflowStepDef;
  index: number;
  totalSteps: number;
  allSteps: WorkflowStepDef[];
  onChange: (step: WorkflowStepDef) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function StepEditor({
  step,
  index,
  totalSteps,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: StepEditorProps) {
  function update(field: string, value: unknown) {
    onChange({ ...step, [field]: value });
  }

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Step {index + 1}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={index === 0}
            onClick={onMoveUp}
          >
            <ArrowUp className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={index === totalSteps - 1}
            onClick={onMoveDown}
          >
            <ArrowDown className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`step-title-${index}`}>Titulo</Label>
          <Input
            id={`step-title-${index}`}
            value={step.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Nome do step"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`step-type-${index}`}>Tipo</Label>
          <Select value={step.type} onValueChange={(v) => update('type', v)}>
            <SelectTrigger id={`step-type-${index}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STEP_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`step-desc-${index}`}>Descricao</Label>
        <Textarea
          id={`step-desc-${index}`}
          value={step.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Descreva o que deve ser feito neste step"
          rows={2}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`step-assignee-${index}`}>Responsavel</Label>
          <Input
            id={`step-assignee-${index}`}
            value={step.assignee ?? ''}
            onChange={(e) => update('assignee', e.target.value || undefined)}
            placeholder="Nome do responsavel"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`step-time-${index}`}>Tempo estimado (min)</Label>
          <Input
            id={`step-time-${index}`}
            type="number"
            min={1}
            value={step.estimatedMinutes ?? ''}
            onChange={(e) =>
              update('estimatedMinutes', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="Ex: 30"
          />
        </div>
      </div>
    </div>
  );
}
