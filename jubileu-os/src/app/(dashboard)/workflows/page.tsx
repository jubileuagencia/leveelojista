'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { workflows, WORKFLOW_CATEGORY_LABELS } from '@/lib/workflows/config';
import type { WorkflowCategory } from '@/lib/workflows/config';
import { Search, Play, Zap } from 'lucide-react';

const categories = Object.keys(WORKFLOW_CATEGORY_LABELS) as WorkflowCategory[];

const categoryColors: Record<string, string> = {
  content: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
  client: 'bg-green-500/10 text-green-700 dark:text-green-400',
  development: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  operations: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
};

export default function WorkflowsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<WorkflowCategory | 'all'>('all');

  const filtered = workflows.filter((w) => {
    if (activeCategory !== 'all' && w.category !== activeCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <p className="text-sm text-muted-foreground">
          {workflows.length} fluxos de trabalho configurados
        </p>
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
              {WORKFLOW_CATEGORY_LABELS[cat]}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Zap className="mb-3 size-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Nenhum workflow encontrado.</p>
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
                    <h3 className="font-semibold">{wf.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {wf.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={categoryColors[wf.category]}>
                      {WORKFLOW_CATEGORY_LABELS[wf.category]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {wf.steps.length} steps
                    </span>
                  </div>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
