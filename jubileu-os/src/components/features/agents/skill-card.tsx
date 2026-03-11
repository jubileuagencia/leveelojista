'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { SKILL_CATEGORY_LABELS, SKILL_CATEGORY_COLORS } from '@/lib/agents/config';
import type { SkillConfig } from '@/lib/agents/config';
import { Sparkles } from 'lucide-react';

interface SkillCardProps {
  skill: SkillConfig;
}

export function SkillCard({ skill }: SkillCardProps) {
  const router = useRouter();

  return (
    <button
      onClick={() =>
        router.push(
          `/agents/${skill.agentId}/chat?skill=${skill.id}&prompt=${encodeURIComponent(skill.initialPrompt)}`
        )
      }
      className="flex flex-col items-start gap-3 rounded-xl border bg-card p-4 text-left transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.98] w-full"
    >
      {/* Top row */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-3xl leading-none" role="img" aria-label={skill.name}>
          {skill.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold truncate">{skill.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <Sparkles className="size-3.5" />
          <span className="hidden sm:inline">Skill</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {skill.description}
      </p>

      {/* Footer */}
      <Badge
        variant="outline"
        className={SKILL_CATEGORY_COLORS[skill.category]}
      >
        {SKILL_CATEGORY_LABELS[skill.category]}
      </Badge>
    </button>
  );
}
