import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import AdminNav from "@/components/platform/admin/AdminNav";
import UserRoleManager from "@/components/platform/admin/UserRoleManager";

export const metadata: Metadata = {
  title: "Usuários — Admin",
  robots: "noindex",
};

export default async function AdminUsersPage() {
  const supabase = await requireAdmin();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: users } = await supabase
    .from("user_profiles")
    .select("id, full_name, role, avatar_emoji, zodiac_sign, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text mb-4">
        Gerenciar Usuarios
      </h1>
      <AdminNav />

      <UserRoleManager users={users || []} currentUserId={user!.id} />
    </div>
  );
}
