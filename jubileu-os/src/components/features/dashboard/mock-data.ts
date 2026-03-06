export interface MockTask {
  id: string;
  name: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  assignee: string;
  dueDate: string;
  client: string;
}

export interface MockActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

export interface MockCalendarDay {
  date: number;
  dayOfWeek: string;
  events: number;
  isToday: boolean;
}

export const mockTasks: MockTask[] = [
  {
    id: '1',
    name: 'Criar landing page Decifrando',
    status: 'in_progress',
    priority: 'urgent',
    assignee: 'Fernando',
    dueDate: '2026-03-08',
    client: 'Pelicula',
  },
  {
    id: '2',
    name: 'Gravar Reels Jornal Sideral',
    status: 'todo',
    priority: 'high',
    assignee: 'Gabriel',
    dueDate: '2026-03-07',
    client: 'Pelicula',
  },
  {
    id: '3',
    name: 'Review copy LP Camarim',
    status: 'review',
    priority: 'high',
    assignee: 'Karol',
    dueDate: '2026-03-06',
    client: 'Pelicula',
  },
  {
    id: '4',
    name: 'Proposta comercial Q2',
    status: 'todo',
    priority: 'normal',
    assignee: 'Fernando',
    dueDate: '2026-03-10',
    client: 'Levee',
  },
  {
    id: '5',
    name: 'Configurar ManyChat funil',
    status: 'in_progress',
    priority: 'urgent',
    assignee: 'Fernando',
    dueDate: '2026-03-07',
    client: 'Pelicula',
  },
];

export const mockActivities: MockActivity[] = [
  { id: '1', user: 'Fernando', action: 'criou tarefa', target: 'Criar LP Decifrando', time: '5min atras' },
  { id: '2', user: 'Gabriel', action: 'atualizou', target: 'Reels Jornal Sideral', time: '15min atras' },
  { id: '3', user: 'Karol', action: 'comentou em', target: 'Copy LP Camarim', time: '1h atras' },
  { id: '4', user: 'Fernando', action: 'concluiu', target: 'Setup Supabase', time: '2h atras' },
  { id: '5', user: 'Gabriel', action: 'criou', target: 'Stories Eclipse Lunar', time: '3h atras' },
  { id: '6', user: 'Fernando', action: 'fez deploy', target: 'LP Decifrando v3', time: '5h atras' },
];

export function getMockCalendar(): MockCalendarDay[] {
  const today = new Date();
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const result: MockCalendarDay[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    result.push({
      date: d.getDate(),
      dayOfWeek: days[d.getDay()],
      events: i === 0 ? 3 : i === 1 ? 1 : i === 3 ? 2 : 0,
      isToday: i === 0,
    });
  }

  return result;
}
