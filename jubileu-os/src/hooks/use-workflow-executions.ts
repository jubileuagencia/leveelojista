import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { StepStatus } from '@/lib/workflows/config';

export interface WorkflowExecutionRecord {
  id: string;
  user_id: string;
  workflow_id: string;
  client_id: string | null;
  status: 'running' | 'completed' | 'cancelled';
  step_statuses: Record<string, StepStatus>;
  current_step_id: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useWorkflowExecutions(workflowId?: string, status?: string) {
  const params = new URLSearchParams();
  if (workflowId) params.set('workflowId', workflowId);
  if (status) params.set('status', status);
  const qs = params.toString();

  return useQuery<WorkflowExecutionRecord[]>({
    queryKey: ['workflow-executions', workflowId, status],
    queryFn: () => api.get(`/workflows/executions${qs ? `?${qs}` : ''}`),
    staleTime: 30_000,
  });
}

export function useCreateWorkflowExecution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { workflowId: string; clientId?: string }) =>
      api.post<WorkflowExecutionRecord>('/workflows/executions', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workflow-executions'] });
    },
  });
}

export function useUpdateWorkflowExecution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      executionId,
      body,
    }: {
      executionId: string;
      body: Partial<Pick<WorkflowExecutionRecord, 'step_statuses' | 'current_step_id' | 'status' | 'completed_at'>>;
    }) => api.patch<WorkflowExecutionRecord>(`/workflows/executions/${executionId}`, body),
    onSuccess: (data) => {
      qc.setQueryData(['workflow-execution', data.id], data);
      qc.invalidateQueries({ queryKey: ['workflow-executions'] });
    },
  });
}
