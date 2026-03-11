'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentCard } from '@/components/features/agents/agent-card';
import { SkillCard } from '@/components/features/agents/skill-card';
import {
  agents,
  skills,
  AGENT_CATEGORY_LABELS,
  SKILL_CATEGORY_LABELS,
} from '@/lib/agents/config';
import type { AgentCategory, SkillCategory } from '@/lib/agents/config';
import { Search, Bot, Sparkles } from 'lucide-react';

const agentCategories = Object.keys(AGENT_CATEGORY_LABELS) as AgentCategory[];
const skillCategories = Object.keys(SKILL_CATEGORY_LABELS) as SkillCategory[];

export default function AgentsPage() {
  const [search, setSearch] = useState('');
  const [agentCategory, setAgentCategory] = useState<AgentCategory | 'all'>('all');
  const [skillCategory, setSkillCategory] = useState<SkillCategory | 'all'>('all');

  const filteredAgents = useMemo(() => {
    let list = agents;
    if (agentCategory !== 'all') {
      list = list.filter((a) => a.category === agentCategory);
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
  }, [search, agentCategory]);

  const filteredSkills = useMemo(() => {
    let list = skills;
    if (skillCategory !== 'all') {
      list = list.filter((s) => s.category === skillCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, skillCategory]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Agentes & Skills</h1>
        <p className="text-sm text-muted-foreground">
          {agents.length} agentes e {skills.length} skills disponiveis
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar agentes e skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="agents" className="gap-1.5">
            <Bot className="size-4" />
            Agentes
            <span className="ml-1 text-xs text-muted-foreground">
              {filteredAgents.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="gap-1.5">
            <Sparkles className="size-4" />
            Skills
            <span className="ml-1 text-xs text-muted-foreground">
              {filteredSkills.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4 mt-0">
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-1.5 -mt-1">
            <Button
              size="sm"
              variant={agentCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setAgentCategory('all')}
              className="h-7 text-xs"
            >
              Todos
            </Button>
            {agentCategories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={agentCategory === cat ? 'default' : 'outline'}
                onClick={() => setAgentCategory(cat)}
                className="h-7 text-xs"
              >
                {AGENT_CATEGORY_LABELS[cat]}
              </Button>
            ))}
          </div>

          {/* Grid */}
          {filteredAgents.length === 0 ? (
            <EmptyState icon={<Bot className="size-12" />} text="Nenhum agente encontrado." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4 mt-0">
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-1.5 -mt-1">
            <Button
              size="sm"
              variant={skillCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSkillCategory('all')}
              className="h-7 text-xs"
            >
              Todos
            </Button>
            {skillCategories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={skillCategory === cat ? 'default' : 'outline'}
                onClick={() => setSkillCategory(cat)}
                className="h-7 text-xs"
              >
                {SKILL_CATEGORY_LABELS[cat]}
              </Button>
            ))}
          </div>

          {/* Grid */}
          {filteredSkills.length === 0 ? (
            <EmptyState icon={<Sparkles className="size-12" />} text="Nenhum skill encontrado." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-3 text-muted-foreground/50">{icon}</div>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
