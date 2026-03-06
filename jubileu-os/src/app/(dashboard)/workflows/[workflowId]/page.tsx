'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getWorkflowById } from '@/lib/workflows/config';
import type { StepStatus } from '@/lib/workflows/config';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Loader2,
  SkipForward,
  Zap,
  Clock,
  User,
} from 'lucide-react';

const STEP_TYPE_LABELS = {
  manual: 'Manual',
  automated: 'Automatico',
  mixed: 'Misto',
};

export default function WorkflowExecutionPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = use(params);
  const router = useRouter();
  const workflow = getWorkflowById(workflowId);

  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({});
  const [startedAt, setStartedAt] = useState<string | null>(null);

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Zap className="mb-3 size-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">Workflow nao encontrado.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/workflows')}>
          Voltar
        </Button>
      </div>
    );
  }

  const isStarted = !!startedAt;
  const completedCount = Object.values(stepStatuses).filter(
    (s) => s === 'completed' || s === 'skipped'
  ).length;
  const isCompleted = completedCount === workflow.steps.length;
  const progress = workflow.steps.length > 0
    ? Math.round((completedCount / workflow.steps.length) * 100)
    : 0;

  function handleStart() {
    setStartedAt(new Date().toISOString());
    if (workflow && workflow.steps.length > 0) {
      setStepStatuses({ [workflow.steps[0].id]: 'in_progress' });
    }
  }

  function handleCompleteStep(stepId: string) {
    if (!workflow) return;
    const newStatuses = { ...stepStatuses, [stepId]: 'completed' as StepStatus };

    // Find next pending step
    const currentIndex = workflow.steps.findIndex((s) => s.id === stepId);
    const nextStep = workflow.steps[currentIndex + 1];
    if (nextStep && !newStatuses[nextStep.id]) {
      newStatuses[nextStep.id] = 'in_progress';
    }

    setStepStatuses(newStatuses);
  }

  function handleSkipStep(stepId: string) {
    if (!workflow) return;
    const newStatuses = { ...stepStatuses, [stepId]: 'skipped' as StepStatus };

    const currentIndex = workflow.steps.findIndex((s) => s.id === stepId);
    const nextStep = workflow.steps[currentIndex + 1];
    if (nextStep && !newStatuses[nextStep.id]) {
      newStatuses[nextStep.id] = 'in_progress';
    }

    setStepStatuses(newStatuses);
  }

  function getStepStatus(stepId: string): StepStatus {
    return stepStatuses[stepId] ?? 'pending';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="mt-1"
          onClick={() => router.push('/workflows')}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{workflow.icon}</span>
            <div>
              <h1 className="text-2xl font-bold">{workflow.name}</h1>
              <p className="text-sm text-muted-foreground">{workflow.description}</p>
            </div>
          </div>
        </div>
        {!isStarted && (
          <Button onClick={handleStart}>
            <Zap className="size-4" />
            Iniciar
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      {isStarted && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedCount}/{workflow.steps.length} steps
            </span>
            <span className="font-medium">
              {isCompleted ? 'Concluido!' : `${progress}%`}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3">
        {workflow.steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isActive = status === 'in_progress';

          return (
            <Card
              key={step.id}
              className={
                isActive
                  ? 'border-primary/50 shadow-sm'
                  : status === 'completed'
                  ? 'opacity-75'
                  : status === 'skipped'
                  ? 'opacity-50'
                  : ''
              }
            >
              <CardContent className="flex items-start gap-4 p-4">
                {/* Step indicator */}
                <div className="mt-0.5 shrink-0">
                  {status === 'completed' ? (
                    <CheckCircle2 className="size-6 text-green-500" />
                  ) : status === 'in_progress' ? (
                    <Loader2 className="size-6 animate-spin text-primary" />
                  ) : status === 'skipped' ? (
                    <SkipForward className="size-6 text-muted-foreground" />
                  ) : (
                    <Circle className="size-6 text-muted-foreground/40" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Step {index + 1}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {STEP_TYPE_LABELS[step.type]}
                    </Badge>
                  </div>
                  <h3 className="mt-0.5 font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {step.assignee && (
                      <span className="flex items-center gap-1">
                        <User className="size-3" />
                        {step.assignee}
                      </span>
                    )}
                    {step.estimatedMinutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        ~{step.estimatedMinutes}min
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {isActive && (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSkipStep(step.id)}
                    >
                      Pular
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleCompleteStep(step.id)}
                    >
                      Concluir
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
