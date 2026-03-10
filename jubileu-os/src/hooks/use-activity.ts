import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

interface ActivityEntry {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  client_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface UseActivityParams {
  limit?: number;
  entityType?: string;
  action?: string;
  userId?: string;
  clientId?: string;
}

export function useActivity(params?: UseActivityParams) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.entityType) searchParams.set('entityType', params.entityType);
  if (params?.action) searchParams.set('action', params.action);
  if (params?.userId) searchParams.set('userId', params.userId);
  if (params?.clientId) searchParams.set('clientId', params.clientId);

  const qs = searchParams.toString();

  return useQuery<ActivityEntry[]>({
    queryKey: ['activity', params],
    queryFn: () => api.get(`/activity${qs ? `?${qs}` : ''}`),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
