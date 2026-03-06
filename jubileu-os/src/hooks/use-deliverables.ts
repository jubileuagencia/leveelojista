'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Deliverable, DeliverableStatus } from '@/types';

interface UseDeliverablesParams {
  clientId?: string;
  status?: DeliverableStatus;
  limit?: number;
}

export function useDeliverables(params?: UseDeliverablesParams) {
  const qs = new URLSearchParams();
  if (params?.clientId) qs.set('clientId', params.clientId);
  if (params?.status) qs.set('status', params.status);
  if (params?.limit) qs.set('limit', String(params.limit));

  return useQuery<Deliverable[]>({
    queryKey: ['deliverables', params],
    queryFn: async () => {
      const res = await fetch(`/api/deliverables?${qs.toString()}`);
      if (!res.ok) throw new Error('Erro ao carregar entregas');
      return res.json();
    },
    staleTime: 30_000,
  });
}

export function useCreateDeliverable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      client_id: string;
      title: string;
      description?: string;
      type?: string;
      file_url?: string;
      preview_url?: string;
      due_date?: string;
    }) => {
      const res = await fetch('/api/deliverables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao criar entrega');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliverables'] });
      toast.success('Entrega criada com sucesso');
    },
    onError: () => toast.error('Erro ao criar entrega'),
  });
}

export function useUpdateDeliverable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      status?: DeliverableStatus;
      review_note?: string;
      title?: string;
      description?: string;
      type?: string;
      file_url?: string;
      preview_url?: string;
      due_date?: string;
    }) => {
      const res = await fetch(`/api/deliverables/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar entrega');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliverables'] });
    },
    onError: () => toast.error('Erro ao atualizar entrega'),
  });
}
