"use client";

import type { ClientData } from "@/lib/clients-config";

export default function ClientDirectory({ clients }: { clients: ClientData[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <div
          key={client.id}
          className="bg-card border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{client.emoji}</span>
            <div>
              <h3 className={`font-semibold ${client.color}`}>{client.name}</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted font-mono">
                {client.clickupTag}
              </span>
            </div>
          </div>

          <p className="text-sm text-text-soft mb-4 leading-relaxed">
            {client.description}
          </p>

          <div className="space-y-1.5">
            <p className="text-xs text-text-muted uppercase tracking-wider">Contatos</p>
            {client.contacts.map((contact) => (
              <div key={contact.name} className="flex items-center justify-between text-sm">
                <span className="text-text">{contact.name}</span>
                <span className="text-text-muted text-xs">{contact.role}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5">
            <p className="text-xs text-text-muted">
              📁 {client.folderPath}/
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
