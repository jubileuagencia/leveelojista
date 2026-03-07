import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import AdminDashboard from "@/components/platform/admin/AdminDashboard";
import AdminNav from "@/components/platform/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin — Película Sideral",
  robots: "noindex",
};

export default async function AdminPage() {
  const supabase = await requireAdmin();

  // Fetch stats
  const [
    { count: totalUsers },
    { count: totalCourses },
    { count: totalLessons },
    { count: activeSubscriptions },
    { count: totalPayments },
    { count: totalPosts },
  ] = await Promise.all([
    supabase.from("user_profiles").select("id", { count: "exact", head: true }),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("lessons").select("id", { count: "exact", head: true }),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "authorized"),
    supabase.from("payments").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("community_posts").select("id", { count: "exact", head: true }),
  ]);

  // Recent users
  const { data: recentUsers } = await supabase
    .from("user_profiles")
    .select("id, full_name, role, avatar_emoji, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  // Recent payments
  const { data: recentPayments } = await supabase
    .from("payments")
    .select("id, amount_cents, status, created_at, user_id, plans(name)")
    .order("created_at", { ascending: false })
    .limit(10);

  // Get user emails for recent payments
  let paymentUsers: Record<string, string> = {};
  if (recentPayments && recentPayments.length > 0) {
    const userIds = [...new Set(recentPayments.map((p) => p.user_id))];
    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("id, full_name")
      .in("id", userIds);
    if (profiles) {
      paymentUsers = Object.fromEntries(profiles.map((p) => [p.id, p.full_name]));
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text mb-4">
        Painel Admin
      </h1>
      <AdminNav />

      <AdminDashboard
        stats={{
          totalUsers: totalUsers || 0,
          totalCourses: totalCourses || 0,
          totalLessons: totalLessons || 0,
          activeSubscriptions: activeSubscriptions || 0,
          totalPayments: totalPayments || 0,
          totalPosts: totalPosts || 0,
        }}
        recentUsers={recentUsers || []}
        recentPayments={(recentPayments || []).map((p) => ({
          ...p,
          user_name: paymentUsers[p.user_id] || "Usuário",
          plan_name: (p.plans as unknown as { name: string })?.name || "—",
        }))}
      />
    </div>
  );
}
