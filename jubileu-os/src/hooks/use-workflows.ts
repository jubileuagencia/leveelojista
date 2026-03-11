import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export interface WorkflowStepDef {
  id: string;
  title: string;
  description: string;
  type: 'manual' | 'automated' | 'approval' | 'agent';
  assignee?: string;
  estimatedMinutes?: number;
  dependsOn?: string[];
  config?: Record<string, unknown>;
}

export type WorkflowCategory = 'content' | 'client' | 'development' | 'operations' | 'custom';

export interface WorkflowDefinitionRecord {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  category: WorkflowCategory;
  steps: WorkflowStepDef[];
  is_template: boolean;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type WorkflowCreateInput = {
  name: string;
  description?: string;
  icon?: string;
  category: WorkflowCategory;
  steps: WorkflowStepDef[];
  is_template?: boolean;
};

export type WorkflowUpdateInput = Partial<Omit<WorkflowCreateInput, 'category'>> & {
  category?: WorkflowCategory;
  is_active?: boolean;
};

export function useWorkflows(category?: string) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  params.set('is_active', 'true');
  const qs = params.toString();

  return useQuery<WorkflowDefinitionRecord[]>({
    queryKey: ['workflows', category],
    queryFn: () => api.get(`/workflows${qs ? `?${qs}` : ''}`),
    staleTime: 60_000,
  });
}

export function useWorkflow(id: string) {
  return useQuery<WorkflowDefinitionRecord>({
    queryKey: ['workflow', id],
    queryFn: () => api.get(`/workflows/${id}`),
    staleTime: 60_000,
    enabled: !!id,
  });
}

export function useCreateWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: WorkflowCreateInput) =>
      api.post<WorkflowDefinitionRecord>('/workflows', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

export function useUpdateWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: WorkflowUpdateInput }) =>
      api.put<WorkflowDefinitionRecord>(`/workflows/${id}`, body),
    onSuccess: (data) => {
      qc.setQueryData(['workflow', data.id], data);
      qc.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

export function useDeleteWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/workflows/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

export function useDuplicateWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (source: WorkflowDefinitionRecord) => {
      const body: WorkflowCreateInput = {
        name: `Copia de ${source.name}`,
        description: source.description ?? undefined,
        icon: source.icon,
        category: source.category,
        steps: source.steps,
        is_template: false,
      };
      return api.post<WorkflowDefinitionRecord>('/workflows', body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}
