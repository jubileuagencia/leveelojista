import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { listDocs } from "@/lib/docs-reader";
import AdminNav from "@/components/platform/admin/AdminNav";
import DocumentBrowser from "@/components/platform/admin/DocumentBrowser";

export const metadata: Metadata = {
  title: "Documentos — Admin",
  robots: "noindex",
};

export default async function AdminDocumentosPage() {
  await requireAdmin();
  const docs = listDocs();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text mb-1">
        Documentos
      </h1>
      <p className="text-sm text-text-muted mb-4">
        {docs.length} documentos no repositorio
      </p>
      <AdminNav />
      <DocumentBrowser docs={docs} />
    </div>
  );
}
