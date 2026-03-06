'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AgentCard } from '@/components/features/agents/agent-card';
import { AgentDetailModal } from '@/components/features/agents/agent-detail-modal';
import { agents, AGENT_CATEGORY_LABELS } from '@/lib/agents/config';
import type { AgentConfig, AgentCategory } from '@/lib/agents/config';
import { Search, Bot } from 'lucide-react';

const categories = Object.keys(AGENT_CATEGORY_LABELS) as AgentCategory[];

export default function AgentsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<AgentCategory | 'all'>('all');
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);

  const filtered = useMemo(() => {
    let list = agents;

    if (activeCategory !== 'all') {
      list = list.filter((a) => a.category === activeCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.whenToUse.toLowerCase().includes(q)
      );
    }

    return list;
  }, [search, activeCategory]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Agentes IA</h1>
        <p className="text-sm text-muted-foreground">
          {agents.length} agentes especializados do sistema AIOS
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar agentes..."
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
              {AGENT_CATEGORY_LABELS[cat]}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bot className="mb-3 size-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Nenhum agente encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onClick={setSelectedAgent}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AgentDetailModal
        agent={selectedAgent}
        open={!!selectedAgent}
        onOpenChange={(open) => !open && setSelectedAgent(null)}
      />
    </div>
  );
}
