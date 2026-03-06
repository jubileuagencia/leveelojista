import type { ClickUpTask } from '@/lib/clickup/types';

export const statusColors: Record<string, string> = {
  'to do': 'bg-zinc-500',
  'a fazer': 'bg-zinc-500',
  'in progress': 'bg-blue-500',
  'em progresso': 'bg-blue-500',
  doing: 'bg-blue-500',
  review: 'bg-amber-500',
  'em revisao': 'bg-amber-500',
  done: 'bg-green-500',
  complete: 'bg-green-500',
  concluido: 'bg-green-500',
  approved: 'bg-green-600',
  aprovado: 'bg-green-600',
  closed: 'bg-zinc-600',
};

export const priorityConfig: Record<string, { label: string; color: string; order: number }> = {
  urgent: { label: 'Urgente', color: 'text-red-500', order: 0 },
  high: { label: 'Alta', color: 'text-amber-500', order: 1 },
  normal: { label: 'Normal', color: 'text-blue-500', order: 2 },
  low: { label: 'Baixa', color: 'text-zinc-400', order: 3 },
};

export function getStatusColor(status: string): string {
  return statusColors[status.toLowerCase()] || 'bg-zinc-500';
}

export function getPriorityInfo(priority: ClickUpTask['priority']) {
  if (!priority) return priorityConfig.normal;
  return priorityConfig[priority.priority.toLowerCase()] || priorityConfig.normal;
}

export function formatDueDate(dueDate: string | null): string | null {
  if (!dueDate) return null;
  const date = new Date(parseInt(dueDate, 10));
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return `${Math.abs(days)}d atrasado`;
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Amanha';
  if (days <= 7) return `${days}d`;

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function isDueOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(parseInt(dueDate, 10)) < new Date();
}
