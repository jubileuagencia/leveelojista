'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkflowBuilder } from '@/components/features/workflows/workflow-builder';
import {
  useWorkflows,
  useDuplicateWorkflow,
} from '@/hooks/use-workflows';
import type { WorkflowDefinitionRecord, WorkflowCategory } from '@/hooks/use-workflows';
import { workflows as legacyWorkflows, WORKFLOW_CATEGORY_LABELS } from '@/lib/workflows/config';
import { Search, Play, Zap, Plus, Copy } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORY_LABELS: Record<string, string> = {
  ...WORKFLOW_CATEGORY_LABELS,
  custom: 'Custom',
};

const categories: WorkflowCategory[] = ['content', 'client', 'development', 'operations', 'custom'];

const categoryColors: Record<string, string> = {
  content: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
  client: 'bg-green-500/10 text-green-700 dark:text-green-400',
  development: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  operations: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  custom: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
};

// Convert legacy workflows to record format for fallback
function legacyToRecords(): WorkflowDefinitionRecord[] {
  return legacyWorkflows.map((w) => ({
    id: w.id,
    name: w.name,
    description: w.description,
    icon: w.icon,
    category: w.category as WorkflowCategory,
    steps: w.steps.map((s) => ({ ...s, type: s.type as WorkflowDefinitionRecord['steps'][0]['type'] })),
    is_template: true,
    is_active: true,
    created_by: null,
    created_at: '',
    updated_at: '',
  }));
}

export default function WorkflowsPage() {
  const router = useRouter();
  const { data: dbWorkflows, isLoading } = useWorkflows();
  const duplicateWorkflow = useDuplicateWorkflow();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<WorkflowCategory | 'all'>('all');
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowDefinitionRecord | null>(null);

  // Use DB workflows with legacy fallback
  const allWorkflows: WorkflowDefinitionRecord[] =
    dbWorkflows && dbWorkflows.length > 0 ? dbWorkflows : legacyToRecords();

  const filtered = allWorkflows.filter((w) => {
    if (activeCategory !== 'all' && w.category !== activeCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        (w.description ?? '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleEdit(wf: WorkflowDefinitionRecord, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingWorkflow(wf);
    setBuilderOpen(true);
  }

  function handleDuplicate(wf: WorkflowDefinitionRecord, e: React.MouseEvent) {
    e.stopPropagation();
    duplicateWorkflow.mutate(wf, {
      onSuccess: () => toast.success(`"Copia de ${wf.name}" criado`),
      onError: () => toast.error('Erro ao duplicar workflow'),
    });
  }

  function handleCreate() {
    setEditingWorkflow(null);
    setBuilderOpen(true);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Workflows</h1>
          <p className="text-sm text-muted-foreground">
            {allWorkflows.length} fluxos de trabalho
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="size-4" />
          Novo Workflow
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar workflows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('all')}
          >
            Todos
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={activeCategory === cat ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Zap className="mb-3 size-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Nenhum workflow encontrado.</p>
          <Button variant="outline" className="mt-3" onClick={handleCreate}>
            Criar primeiro workflow
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((wf) => (
            <Card
              key={wf.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
              onClick={() => router.push(`/workflows/${wf.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl leading-none">{wf.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{wf.name}</h3>
                      {wf.is_template && (
                        <Badge variant="outline" className="text-[10px]">
                          Template
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {wf.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={categoryColors[wf.category]}>
                      {CATEGORY_LABELS[wf.category]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {wf.steps.length} steps
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      title="Duplicar"
                      onClick={(e) => handleDuplicate(wf, e)}
                    >
                      <Copy className="size-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleEdit(wf, e)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/workflows/${wf.id}`);
                      }}
                    >
                      <Play className="size-3.5" />
                      Executar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <WorkflowBuilder
        open={builderOpen}
        onOpenChange={setBuilderOpen}
        editingWorkflow={editingWorkflow}
      />
    </div>
  );
}
