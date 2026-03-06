'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SlackChannel, SlackMessage } from '@/app/api/messages/route';

export type { SlackChannel, SlackMessage };

export function useSlackChannels() {
  return useQuery<{ channels: SlackChannel[] }>({
    queryKey: ['slack-channels'],
    queryFn: async () => {
      const res = await fetch('/api/messages');
      if (!res.ok) throw new Error('Erro ao carregar canais');
      return res.json();
    },
    staleTime: 30_000,
  });
}

export function useSlackMessages(channelId: string | null) {
  return useQuery<{ messages: SlackMessage[] }>({
    queryKey: ['slack-messages', channelId],
    queryFn: async () => {
      const res = await fetch(`/api/messages?channelId=${channelId}`);
      if (!res.ok) throw new Error('Erro ao carregar mensagens');
      return res.json();
    },
    enabled: !!channelId,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useSendSlackMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { channelId: string; text: string }) => {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao enviar mensagem');
      return res.json();
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['slack-messages', variables.channelId] });
      qc.invalidateQueries({ queryKey: ['slack-channels'] });
    },
  });
}
