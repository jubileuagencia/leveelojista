import { NextResponse } from 'next/server';
import { apiAuthGuard } from '@/lib/api/auth-guard';
import { clickupClient } from '@/lib/clickup/client';
import type { ClickUpTask } from '@/lib/clickup/types';

export interface DashboardStats {
  activeTasks: number;
  completedThisWeek: number;
  activeClients: number;
  urgentTasks: number;
  tasksByStatus: Record<string, number>;
  recentTasks: PickedTask[];
}

interface PickedTask {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  priority: string | null;
  assignee: string | null;
  dueDate: string | null;
  listName: string;
  tags: string[];
}

function pickTask(t: ClickUpTask): PickedTask {
  return {
    id: t.id,
    name: t.name,
    status: t.status.status,
    statusColor: t.status.color,
    priority: t.priority?.priority ?? null,
    assignee: t.assignees[0]?.username ?? null,
    dueDate: t.due_date,
    listName: t.list.name,
    tags: t.tags.map((tag) => tag.name),
  };
}

function isCompletedThisWeek(task: ClickUpTask): boolean {
  if (!task.date_closed) return false;
  const closed = new Date(parseInt(task.date_closed));
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);
  return closed >= weekStart;
}

// Known list IDs from the workspace
const LIST_IDS = [
  '901325668059', // Gestao de Campanhas
  '901325668055', // Publicacao
  '901325668052', // Planejamento & Estrategia
  '901325668054', // Design/Audiovisual
  '901325668053', // Redacao/Copy
  '901325668065', // Lab IA
];

export async function GET() {
  const auth = await apiAuthGuard();
  if ('error' in auth) return auth.error;

  try {
    // Fetch tasks from all lists in parallel
    const allResults = await Promise.allSettled(
      LIST_IDS.map((listId) =>
        clickupClient.getTasks({
          listId,
          include_closed: true,
          subtasks: false,
        })
      )
    );

    const allTasks: ClickUpTask[] = [];
    for (const result of allResults) {
      if (result.status === 'fulfilled') {
        allTasks.push(...result.value.tasks);
      }
    }

    // Active = not closed
    const activeTasks = allTasks.filter(
      (t) => t.status.type !== 'closed' && t.status.type !== 'done'
    );

    // Completed this week
    const completedThisWeek = allTasks.filter(isCompletedThisWeek).length;

    // Urgent = priority 1 (urgent) or 2 (high) and not closed
    const urgentTasks = activeTasks.filter(
      (t) => t.priority && ['1', '2'].includes(t.priority.id)
    ).length;

    // Tasks by status
    const tasksByStatus: Record<string, number> = {};
    for (const task of activeTasks) {
      const status = task.status.status;
      tasksByStatus[status] = (tasksByStatus[status] || 0) + 1;
    }

    // Active clients = unique client tags
    const clientTags = new Set<string>();
    for (const task of activeTasks) {
      for (const tag of task.tags) {
        const name = tag.name.toLowerCase();
        if (['pelicula-sideral', 'levee', 'caracol', 'jubileu-internal'].includes(name)) {
          clientTags.add(name);
        }
      }
    }

    // Recent tasks (sorted by date_updated desc, top 8)
    const recentTasks = [...activeTasks]
      .sort((a, b) => parseInt(b.date_updated) - parseInt(a.date_updated))
      .slice(0, 8)
      .map(pickTask);

    const stats: DashboardStats = {
      activeTasks: activeTasks.length,
      completedThisWeek,
      activeClients: clientTags.size,
      urgentTasks,
      tasksByStatus,
      recentTasks,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
