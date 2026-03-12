import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { ChatSession } from '@/types';

type SessionSummary = Pick<ChatSession, 'id' | 'agent_id' | 'title' | 'created_at' | 'updated_at'>;

export function useChatSessions(agentId: string) {
  return useQuery<SessionSummary[]>({
    queryKey: ['chat-sessions', agentId],
    queryFn: () => api.get(`/chat/sessions?agentId=${agentId}`),
    staleTime: 30_000,
  });
}

export function useChatSession(sessionId: string | null) {
  return useQuery<ChatSession>({
    queryKey: ['chat-session', sessionId],
    queryFn: () => api.get(`/chat/sessions/${sessionId}`),
    enabled: !!sessionId,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useCreateChatSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { agentId: string; title?: string }) =>
      api.post<ChatSession>('/chat/sessions', body),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['chat-sessions', variables.agentId] });
    },
  });
}

export function useUpdateChatSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, body }: { sessionId: string; body: Record<string, unknown> }) =>
      api.patch<ChatSession>(`/chat/sessions/${sessionId}`, body),
    onSuccess: (data) => {
      qc.setQueryData(['chat-session', data.id], data);
    },
  });
}

export function useDeleteChatSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => api.delete(`/chat/sessions/${sessionId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chat-sessions'] });
    },
  });
}
