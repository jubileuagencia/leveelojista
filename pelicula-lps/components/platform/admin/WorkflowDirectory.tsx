"use client";

import type { WorkflowData } from "@/lib/aios-parser";

export default function WorkflowDirectory({ workflows }: { workflows: WorkflowData[] }) {
  return (
    <div className="space-y-3">
      {workflows.map((wf) => (
        <div
          key={wf.id}
          className="bg-card border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-text truncate">{wf.name}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted shrink-0">
                  v{wf.version}
                </span>
              </div>
              <p className="text-sm text-text-soft leading-relaxed line-clamp-2">
                {wf.description}
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-aspect-blue/20 text-aspect-blue">
                {wf.type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
            {wf.phaseCount > 0 && (
              <span className="text-xs text-text-muted">
                {wf.phaseCount} fase{wf.phaseCount !== 1 ? "s" : ""}
              </span>
            )}
            {wf.stepCount > 0 && (
              <span className="text-xs text-text-muted">
                {wf.stepCount} step{wf.stepCount !== 1 ? "s" : ""}
              </span>
            )}
            <span className="text-xs text-text-muted font-mono ml-auto">
              {wf.fileName}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
