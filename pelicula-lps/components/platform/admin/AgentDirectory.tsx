"use client";

import { useState } from "react";
import type { AgentData } from "@/lib/aios-parser";

function AgentDetail({ agent, onClose }: { agent: AgentData; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-deep border-l border-white/5 overflow-y-auto">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{agent.icon}</span>
            <div>
              <h2 className="text-lg font-semibold text-text">{agent.name}</h2>
              <p className="text-sm text-text-muted">{agent.title}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Arquetipo</p>
              <span className="text-sm px-2 py-0.5 rounded bg-purple/20 text-purple-light">
                {agent.archetype}
              </span>
            </div>

            {agent.role && (
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Role</p>
                <p className="text-sm text-text-soft">{agent.role}</p>
              </div>
            )}

            {agent.focus && (
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Foco</p>
                <p className="text-sm text-text-soft">{agent.focus}</p>
              </div>
            )}

            {agent.whenToUse && (
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Quando usar</p>
                <p className="text-sm text-text-soft">{agent.whenToUse}</p>
              </div>
            )}

            {agent.commands.length > 0 && (
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                  Comandos ({agent.commands.length})
                </p>
                <div className="space-y-2">
                  {agent.commands.map((cmd) => (
                    <div key={cmd.name} className="bg-card rounded-lg p-3 border border-white/5">
                      <code className="text-xs text-gold font-mono">*{cmd.name}</code>
                      <p className="text-xs text-text-muted mt-1">{cmd.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentDirectory({ agents }: { agents: AgentData[] }) {
  const [selected, setSelected] = useState<AgentData | null>(null);

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setSelected(agent)}
            className="bg-card border border-white/5 rounded-xl p-5 text-left hover:border-gold/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{agent.icon}</span>
              <div>
                <h3 className="font-semibold text-text">{agent.name}</h3>
                <p className="text-xs text-text-muted">@{agent.id}</p>
              </div>
            </div>

            <p className="text-sm text-text-soft mb-3">{agent.title}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple/20 text-purple-light">
                {agent.archetype}
              </span>
              {agent.commands.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted">
                  {agent.commands.length} cmd{agent.commands.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {selected && <AgentDetail agent={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
