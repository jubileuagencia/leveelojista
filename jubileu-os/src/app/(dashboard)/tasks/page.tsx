'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app-store';
import { useTasks, useUpdateTask } from '@/hooks/use-clickup';
import { useClients } from '@/hooks/use-clients';
import { TaskListView } from '@/components/features/tasks/task-list-view';
import { TaskKanbanView } from '@/components/features/tasks/task-kanban-view';
import { TaskDetailPanel } from '@/components/features/tasks/task-detail-panel';
import { TaskFilters } from '@/components/features/tasks/task-filters';
import { CreateTaskDialog } from '@/components/features/tasks/create-task-dialog';
import { List, LayoutGrid, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { ClickUpStatus } from '@/lib/clickup/types';

// Default list IDs from the workspace
const LISTS = [
  { id: '901325668059', name: 'Gestao de Campanhas' },
  { id: '901325668055', name: 'Publicacao' },
  { id: '901325668052', name: 'Planejamento' },
  { id: '901325668054', name: 'Design/Audiovisual' },
  { id: '901325668053', name: 'Redacao/Copy' },
  { id: '901325668065', name: 'Lab IA' },
];

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { taskViewMode, setTaskViewMode, activeClientId } = useAppStore();
  const { data: clients } = useClients();

  const [selectedListId, setSelectedListId] = useState(LISTS[0].id);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  const activeTaskId = searchParams.get('task');
  const activeClient = clients?.find((c) => c.id === activeClientId);

  // Pass client's clickup_tag as filter when a client is selected
  const { data, isLoading } = useTasks(selectedListId, {
    tags: activeClient?.clickup_tag ? [activeClient.clickup_tag] : undefined,
  });
  const updateTask = useUpdateTask();

  const allTasks = data?.tasks ?? [];

  const tasks = (() => {
    let filtered = allTasks;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((t) => t.name.toLowerCase().includes(q));
    }
    if (statusFilter.length > 0) {
      filtered = filtered.filter((t) =>
        statusFilter.includes(t.status.status.toLowerCase())
      );
    }
    return filtered;
  })();

  const availableStatuses = (() => {
    const set = new Set(allTasks.map((t) => t.status.status.toLowerCase()));
    return Array.from(set);
  })();

  const kanbanStatuses: ClickUpStatus[] = (() => {
    const statusMap = new Map<string, ClickUpStatus>();
    allTasks.forEach((t) => {
      const key = t.status.status.toLowerCase();
      if (!statusMap.has(key)) {
        statusMap.set(key, {
          status: t.status.status,
          color: t.status.color,
          type: t.status.type,
          orderindex: statusMap.size,
        });
      }
    });
    return Array.from(statusMap.values());
  })();

  function handleTaskClick(taskId: string) {
    router.push(`/tasks?task=${taskId}`, { scroll: false });
  }

  function handleCloseDetail() {
    router.push('/tasks', { scroll: false });
  }

  async function handleStatusChange(taskId: string, newStatus: string) {
    try {
      await updateTask.mutateAsync({ taskId, body: { status: newStatus } });
      toast.success('Status atualizado');
    } catch {
      toast.error('Erro ao atualizar status');
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={taskViewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTaskViewMode('list')}
          >
            <List className="size-4" />
            Lista
          </Button>
          <Button
            variant={taskViewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTaskViewMode('kanban')}
          >
            <LayoutGrid className="size-4" />
            Kanban
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* List selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {LISTS.map((list) => (
          <Button
            key={list.id}
            variant={selectedListId === list.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedListId(list.id)}
            className="shrink-0"
          >
            {list.name}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        availableStatuses={availableStatuses}
      />

      {/* View */}
      {taskViewMode === 'list' ? (
        <TaskListView
          tasks={tasks}
          loading={isLoading}
          onTaskClick={handleTaskClick}
        />
      ) : (
        <TaskKanbanView
          tasks={tasks}
          statuses={kanbanStatuses}
          loading={isLoading}
          onTaskClick={handleTaskClick}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Task Detail Panel */}
      <TaskDetailPanel
        taskId={activeTaskId}
        onClose={handleCloseDetail}
      />

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        listId={selectedListId}
      />
    </div>
  );
}
