import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { parseAgentFiles } from "@/lib/aios-parser";
import AdminNav from "@/components/platform/admin/AdminNav";
import AgentDirectory from "@/components/platform/admin/AgentDirectory";

export const metadata: Metadata = {
  title: "Agentes IA — Admin",
  robots: "noindex",
};

export default async function AdminAgentesPage() {
  await requireAdmin();
  const agents = parseAgentFiles();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text mb-1">
        Agentes IA
      </h1>
      <p className="text-sm text-text-muted mb-4">
        {agents.length} agentes configurados no AIOS
      </p>
      <AdminNav />
      <AgentDirectory agents={agents} />
    </div>
  );
}
