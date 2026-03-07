import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { clients } from "@/lib/clients-config";
import AdminNav from "@/components/platform/admin/AdminNav";
import ClientDirectory from "@/components/platform/admin/ClientDirectory";

export const metadata: Metadata = {
  title: "Clientes — Admin",
  robots: "noindex",
};

export default async function AdminClientesPage() {
  await requireAdmin();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text mb-4">
        Clientes
      </h1>
      <AdminNav />
      <ClientDirectory clients={clients} />
    </div>
  );
}
