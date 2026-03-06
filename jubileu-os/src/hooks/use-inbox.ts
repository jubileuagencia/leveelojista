'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Notification } from '@/types';

interface UseInboxParams {
  unread?: boolean;
  limit?: number;
}

export function useInbox(params?: UseInboxParams) {
  const qs = new URLSearchParams();
  if (params?.unread) qs.set('unread', 'true');
  if (params?.limit) qs.set('limit', String(params.limit));

  return useQuery<Notification[]>({
    queryKey: ['inbox', params],
    queryFn: async () => {
      const res = await fetch(`/api/inbox?${qs.toString()}`);
      if (!res.ok) throw new Error('Erro ao carregar notificacoes');
      return res.json();
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/inbox', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Erro ao marcar como lida');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/inbox', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (!res.ok) throw new Error('Erro ao marcar todas como lidas');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  });
}
