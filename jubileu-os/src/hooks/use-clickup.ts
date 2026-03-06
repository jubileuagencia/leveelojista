'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type {
  ClickUpSpace,
  ClickUpList,
  ClickUpTask,
  ClickUpComment,
  GetTasksResponse,
  CreateTaskBody,
  UpdateTaskBody,
} from '@/lib/clickup/types';

// Spaces
export function useSpaces() {
  return useQuery({
    queryKey: ['clickup', 'spaces'],
    queryFn: () => api.get<ClickUpSpace[]>('/clickup/spaces'),
    staleTime: 5 * 60 * 1000,
  });
}

// Lists
export function useLists(folderId?: string, spaceId?: string) {
  return useQuery({
    queryKey: ['clickup', 'lists', folderId || spaceId],
    queryFn: () => {
      if (folderId) return api.get<ClickUpList[]>(`/clickup/lists?folder_id=${folderId}`);
      if (spaceId) return api.get<ClickUpList[]>(`/clickup/lists?space_id=${spaceId}`);
      return Promise.resolve([]);
    },
    enabled: !!(folderId || spaceId),
    staleTime: 5 * 60 * 1000,
  });
}

// Tasks
export function useTasks(listId: string | null, filters?: {
  statuses?: string[];
  assignees?: number[];
  tags?: string[];
  page?: number;
}) {
  const params = new URLSearchParams();
  if (listId) params.set('list_id', listId);
  if (filters?.statuses) filters.statuses.forEach((s) => params.append('statuses[]', s));
  if (filters?.assignees) filters.assignees.forEach((a) => params.append('assignees[]', String(a)));
  if (filters?.tags) filters.tags.forEach((t) => params.append('tags[]', t));
  if (filters?.page) params.set('page', String(filters.page));

  return useQuery({
    queryKey: ['clickup', 'tasks', listId, filters],
    queryFn: () => api.get<GetTasksResponse>(`/clickup/tasks?${params.toString()}`),
    enabled: !!listId,
    staleTime: 60 * 1000,
  });
}

// Single Task
export function useTask(taskId: string | null) {
  return useQuery({
    queryKey: ['clickup', 'task', taskId],
    queryFn: () => api.get<ClickUpTask>(`/clickup/tasks/${taskId}`),
    enabled: !!taskId,
    staleTime: 30 * 1000,
  });
}

// Task Comments
export function useTaskComments(taskId: string | null) {
  return useQuery({
    queryKey: ['clickup', 'comments', taskId],
    queryFn: () => api.get<ClickUpComment[]>(`/clickup/tasks/${taskId}/comments`),
    enabled: !!taskId,
    staleTime: 30 * 1000,
  });
}

// Create Task
export function useCreateTask(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateTaskBody) =>
      api.post<ClickUpTask>(`/clickup/tasks?list_id=${listId}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clickup', 'tasks', listId] });
    },
  });
}

// Update Task
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, body }: { taskId: string; body: UpdateTaskBody }) =>
      api.patch<ClickUpTask>(`/clickup/tasks/${taskId}`, body),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['clickup', 'task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['clickup', 'tasks'] });
    },
  });
}

// Add Comment
export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, text }: { taskId: string; text: string }) =>
      api.post<ClickUpComment>(`/clickup/tasks/${taskId}/comments`, { text }),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['clickup', 'comments', taskId] });
    },
  });
}
