import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { readDoc } from "@/lib/docs-reader";
import DocumentViewer from "@/components/platform/admin/DocumentViewer";

export const metadata: Metadata = {
  title: "Documento — Admin",
  robots: "noindex",
};

export default async function AdminDocViewerPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  await requireAdmin();

  const { slug } = await params;
  const slugPath = slug.join("/");
  const doc = readDoc(slugPath);

  if (!doc) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/documentos"
        className="text-text-muted hover:text-text text-sm transition-colors inline-block mb-4"
      >
        ← Documentos
      </Link>

      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text mb-4">
        {doc.entry.title}
      </h1>

      <DocumentViewer content={doc.content} entry={doc.entry} />
    </div>
  );
}
