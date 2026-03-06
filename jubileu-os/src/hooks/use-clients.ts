'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Client } from '@/types';

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get<Client[]>('/clients'),
    staleTime: 60 * 1000,
  });
}

export function useClient(clientId: string | null) {
  return useQuery({
    queryKey: ['clients', clientId],
    queryFn: () => api.get<Client>(`/clients/${clientId}`),
    enabled: !!clientId,
    staleTime: 60 * 1000,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      name: string;
      slug: string;
      logo_url?: string;
      contacts?: { name: string; role: string; email?: string; phone?: string }[];
      links?: Record<string, string>;
      clickup_tag?: string;
      notion_root_page_id?: string;
    }) => api.post<Client>('/clients', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, body }: { clientId: string; body: Partial<Client> }) =>
      api.patch<Client>(`/clients/${clientId}`, body),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', clientId] });
    },
  });
}
