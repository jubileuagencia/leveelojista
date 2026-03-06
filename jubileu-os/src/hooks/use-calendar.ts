'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CalendarEvent } from '@/types';

interface UseCalendarParams {
  from?: string;
  to?: string;
}

export function useCalendarEvents(params?: UseCalendarParams) {
  const qs = new URLSearchParams();
  if (params?.from) qs.set('from', params.from);
  if (params?.to) qs.set('to', params.to);

  return useQuery<CalendarEvent[]>({
    queryKey: ['calendar', params],
    queryFn: async () => {
      const res = await fetch(`/api/calendar?${qs.toString()}`);
      if (!res.ok) throw new Error('Erro ao carregar eventos');
      return res.json();
    },
    staleTime: 60_000,
  });
}

export function useCreateCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      start_date: string;
      end_date?: string;
      all_day?: boolean;
      color?: string;
    }) => {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao criar evento');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['calendar'] });
      toast.success('Evento criado');
    },
    onError: () => toast.error('Erro ao criar evento'),
  });
}

export function useDeleteCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetch(`/api/calendar/${eventId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir evento');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['calendar'] });
      toast.success('Evento excluido');
    },
    onError: () => toast.error('Erro ao excluir evento'),
  });
}
