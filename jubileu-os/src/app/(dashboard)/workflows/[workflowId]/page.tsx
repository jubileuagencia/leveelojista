'use client';

import { use, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkflow } from '@/hooks/use-workflows';
import type { WorkflowStepDef } from '@/hooks/use-workflows';
import { getWorkflowById } from '@/lib/workflows/config';
import type { StepStatus } from '@/lib/workflows/config';
import {
  useWorkflowExecutions,
  useCreateWorkflowExecution,
  useUpdateWorkflowExecution,
} from '@/hooks/use-workflow-executions';
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

const STEP_TYPE_LABELS: Record<string, string> = {
  manual: 'Manual',
  automated: 'Automatico',
  mixed: 'Misto',
  approval: 'Aprovacao',
  agent: 'Agente IA',
};

export default function WorkflowExecutionPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const executionIdParam = searchParams.get('execution');

  // Fetch workflow definition from DB
  const { data: dbWorkflow, isLoading: loadingDef } = useWorkflow(workflowId);

  // Fallback to legacy config
  const legacyWorkflow = getWorkflowById(workflowId);

  // Merge: prefer DB, fallback to legacy
  const workflow = useMemo(() => {
    if (dbWorkflow) {
      return {
        id: dbWorkflow.id,
        name: dbWorkflow.name,
        description: dbWorkflow.description ?? '',
        icon: dbWorkflow.icon,
        category: dbWorkflow.category,
        steps: dbWorkflow.steps,
      };
    }
    if (legacyWorkflow) {
      return {
        id: legacyWorkflow.id,
        name: legacyWorkflow.name,
        description: legacyWorkflow.description,
        icon: legacyWorkflow.icon,
        category: legacyWorkflow.category,
        steps: legacyWorkflow.steps.map((s) => ({
          ...s,
          type: s.type as WorkflowStepDef['type'],
        })),
      };
    }
    return null;
  }, [dbWorkflow, legacyWorkflow]);

  // Fetch existing running execution for this workflow
  const { data: executions, isLoading: loadingExecs } = useWorkflowExecutions(
    workflowId,
    'running'
  );
  const createExecution = useCreateWorkflowExecution();
  const updateExecution = useUpdateWorkflowExecution();
  const savingRef = useRef(false);

  // Find active execution: either from URL param or most recent running one
  const activeExecution = executionIdParam
    ? executions?.find((e) => e.id === executionIdParam)
    : executions?.[0] ?? null;

  const stepStatuses: Record<string, StepStatus> = activeExecution?.step_statuses ?? {};
  const isStarted = !!activeExecution;

  // Persist step status changes to API
  function persistStepUpdate(
    newStatuses: Record<string, StepStatus>,
    nextStepId: string | null,
    completed: boolean
  ) {
    if (!activeExecution || savingRef.current) return;
    savingRef.current = true;
    updateExecution.mutate(
      {
        executionId: activeExecution.id,
        body: {
          step_statuses: newStatuses,
          current_step_id: nextStepId,
          ...(completed
            ? { status: 'completed' as const, completed_at: new Date().toISOString() }
            : {}),
        },
      },
      { onSettled: () => { savingRef.current = false; } }
    );
  }

  // Redirect to include execution param after creation
  useEffect(() => {
    if (activeExecution && !executionIdParam) {
      router.replace(`/workflows/${workflowId}?execution=${activeExecution.id}`, {
        scroll: false,
      });
    }
  }, [activeExecution, executionIdParam, router, workflowId]);

  const isLoading = loadingDef || loadingExecs;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-full" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

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

  const completedCount = Object.values(stepStatuses).filter(
    (s) => s === 'completed' || s === 'skipped'
  ).length;
  const isCompleted = completedCount === workflow.steps.length;
  const progress = workflow.steps.length > 0
    ? Math.round((completedCount / workflow.steps.length) * 100)
    : 0;

  async function handleStart() {
    if (!workflow) return;
    const firstStepId = workflow.steps[0]?.id;
    try {
      const exec = await createExecution.mutateAsync({ workflowId });
      if (firstStepId) {
        updateExecution.mutate({
          executionId: exec.id,
          body: {
            step_statuses: { [firstStepId]: 'in_progress' },
            current_step_id: firstStepId,
          },
        });
      }
      router.replace(`/workflows/${workflowId}?execution=${exec.id}`, { scroll: false });
    } catch {
      // handled by mutation error state
    }
  }

  function handleCompleteStep(stepId: string) {
    if (!workflow) return;
    const newStatuses = { ...stepStatuses, [stepId]: 'completed' as StepStatus };

    const currentIndex = workflow.steps.findIndex((s) => s.id === stepId);
    const nextStep = workflow.steps[currentIndex + 1];
    let nextStepId: string | null = null;
    if (nextStep && !newStatuses[nextStep.id]) {
      newStatuses[nextStep.id] = 'in_progress';
      nextStepId = nextStep.id;
    }

    const allDone = Object.values(newStatuses).filter(
      (s) => s === 'completed' || s === 'skipped'
    ).length === workflow.steps.length;

    persistStepUpdate(newStatuses, nextStepId, allDone);
  }

  function handleSkipStep(stepId: string) {
    if (!workflow) return;
    const newStatuses = { ...stepStatuses, [stepId]: 'skipped' as StepStatus };

    const currentIndex = workflow.steps.findIndex((s) => s.id === stepId);
    const nextStep = workflow.steps[currentIndex + 1];
    let nextStepId: string | null = null;
    if (nextStep && !newStatuses[nextStep.id]) {
      newStatuses[nextStep.id] = 'in_progress';
      nextStepId = nextStep.id;
    }

    const allDone = Object.values(newStatuses).filter(
      (s) => s === 'completed' || s === 'skipped'
    ).length === workflow.steps.length;

    persistStepUpdate(newStatuses, nextStepId, allDone);
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
          <Button onClick={handleStart} disabled={createExecution.isPending}>
            {createExecution.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Zap className="size-4" />
            )}
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
                      {STEP_TYPE_LABELS[step.type] ?? step.type}
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
