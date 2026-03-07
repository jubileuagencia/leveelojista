import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { parseWorkflowFiles } from "@/lib/aios-parser";
import AdminNav from "@/components/platform/admin/AdminNav";
import WorkflowDirectory from "@/components/platform/admin/WorkflowDirectory";

export const metadata: Metadata = {
  title: "Workflows — Admin",
  robots: "noindex",
};

export default async function AdminWorkflowsPage() {
  await requireAdmin();
  const workflows = parseWorkflowFiles();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text mb-1">
        Workflows
      </h1>
      <p className="text-sm text-text-muted mb-4">
        {workflows.length} workflows configurados no AIOS
      </p>
      <AdminNav />
      <WorkflowDirectory workflows={workflows} />
    </div>
  );
}
