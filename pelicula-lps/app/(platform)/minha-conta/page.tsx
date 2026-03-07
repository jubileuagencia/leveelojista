import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/access";
import ProgressBar from "@/components/platform/ProgressBar";

export const metadata: Metadata = {
  title: "Minha Conta — Película Sideral",
  robots: "noindex",
};

export default async function MinhaContaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get accessible courses with error handling
  let coursesWithProgress: {
    id: string;
    slug: string;
    title: string;
    total_lessons: number;
    completed_lessons: number;
  }[] = [];

  try {
    const accessibleCourseIds = await getUserAccess(supabase, user.id);

    if (accessibleCourseIds.length > 0) {
      const { data: courses } = await supabase
        .from("courses")
        .select("id, slug, title, total_lessons")
        .in("id", accessibleCourseIds);

      if (courses) {
        for (const course of courses) {
          const { data: lessons } = await supabase
            .from("lessons")
            .select("id, modules!inner(course_id)")
            .eq("modules.course_id", course.id);

          const lessonIds = (lessons || []).map((l) => l.id);
          let completed = 0;

          if (lessonIds.length > 0) {
            const { count } = await supabase
              .from("lesson_progress")
              .select("id", { count: "exact", head: true })
              .eq("user_id", user.id)
              .in("lesson_id", lessonIds)
              .eq("completed", true);

            completed = count || 0;
          }

          coursesWithProgress.push({
            ...course,
            total_lessons: lessonIds.length || course.total_lessons,
            completed_lessons: completed,
          });
        }
      }
    }
  } catch {
    // Supabase query error — show empty state gracefully
  }

  // Get active subscriptions
  let subscriptions: Array<{
    id: string;
    status: string;
    plans: unknown;
  }> = [];
  try {
    const { data } = await supabase
      .from("subscriptions")
      .select("*, plans(name, price_cents, billing_period)")
      .eq("user_id", user.id)
      .in("status", ["authorized", "pending"]);
    subscriptions = data || [];
  } catch {
    // graceful fallback
  }

  // Get recent payments
  let payments: Array<{
    id: string;
    amount_cents: number;
    status: string;
    created_at: string;
    plans: unknown;
  }> = [];
  try {
    const { data } = await supabase
      .from("payments")
      .select("*, plans(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    payments = data || [];
  } catch {
    // graceful fallback
  }

  function formatPrice(cents: number) {
    return (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function statusLabel(status: string) {
    const labels: Record<string, string> = {
      authorized: "Ativa",
      pending: "Pendente",
      paused: "Pausada",
      cancelled: "Cancelada",
      expired: "Expirada",
      approved: "Aprovado",
      rejected: "Rejeitado",
      refunded: "Reembolsado",
    };
    return labels[status] || status;
  }

  function statusColor(status: string) {
    if (["authorized", "approved"].includes(status)) return "text-aspect-green";
    if (["pending"].includes(status)) return "text-gold";
    return "text-text-muted";
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text">
        Minha conta
      </h1>

      {/* Profile */}
      <section className="bg-card border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text mb-4">
          Perfil
        </h2>
        <div>
          <label className="block text-sm text-text-muted mb-1">Nome</label>
          <p className="text-text">{profile?.full_name || "—"}</p>
        </div>
        <div>
          <label className="block text-sm text-text-muted mb-1">Email</label>
          <p className="text-text">{user.email}</p>
        </div>
        <div>
          <label className="block text-sm text-text-muted mb-1">
            Membro desde
          </label>
          <p className="text-text">
            {new Date(user.created_at).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        {profile?.zodiac_sign && (
          <div>
            <label className="block text-sm text-text-muted mb-1">Signo</label>
            <p className="text-text">{profile.zodiac_sign}</p>
          </div>
        )}
        {profile?.bio && (
          <div>
            <label className="block text-sm text-text-muted mb-1">Bio</label>
            <p className="text-text-soft text-sm">{profile.bio}</p>
          </div>
        )}
      </section>

      {/* Courses & Progress */}
      <section className="bg-card border border-white/5 rounded-xl p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text mb-4">
          Meus cursos
        </h2>
        {coursesWithProgress.length > 0 ? (
          <div className="space-y-4">
            {coursesWithProgress.map((course) => {
              const percent =
                course.total_lessons > 0
                  ? Math.round(
                      (course.completed_lessons / course.total_lessons) * 100
                    )
                  : 0;
              return (
                <Link
                  key={course.id}
                  href={`/curso/${course.slug}`}
                  className="block p-4 bg-deep rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text font-medium text-sm">
                      {course.title}
                    </span>
                    <span className="text-text-muted text-xs">
                      {course.completed_lessons}/{course.total_lessons} aulas
                    </span>
                  </div>
                  <ProgressBar percent={percent} />
                  <p className="text-xs text-text-muted mt-1">{percent}% concluído</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-text-muted">
            <p className="text-sm">Você ainda não tem acesso a nenhum curso.</p>
            <Link
              href="/checkout"
              className="inline-block mt-3 text-gold text-sm hover:underline"
            >
              Ver planos disponíveis
            </Link>
          </div>
        )}
      </section>

      {/* Subscriptions */}
      {subscriptions.length > 0 && (
        <section className="bg-card border border-white/5 rounded-xl p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text mb-4">
            Assinaturas
          </h2>
          <div className="space-y-3">
            {subscriptions.map((sub) => {
              const plan = sub.plans as unknown as {
                name: string;
                price_cents: number;
                billing_period: string;
              };
              return (
                <div
                  key={sub.id}
                  className="p-4 bg-deep rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="text-text font-medium text-sm">{plan.name}</p>
                    <p className="text-text-muted text-xs mt-0.5">
                      {formatPrice(plan.price_cents)}
                      {plan.billing_period === "monthly" ? "/mês" : "/ano"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium ${statusColor(sub.status)}`}
                  >
                    {statusLabel(sub.status)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Payment history */}
      {payments.length > 0 && (
        <section className="bg-card border border-white/5 rounded-xl p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text mb-4">
            Histórico de pagamentos
          </h2>
          <div className="space-y-2">
            {payments.map((payment) => {
              const plan = payment.plans as unknown as { name: string };
              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-text text-sm">{plan.name}</p>
                    <p className="text-text-muted text-xs">
                      {new Date(payment.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-text text-sm">
                      {formatPrice(payment.amount_cents)}
                    </p>
                    <p
                      className={`text-xs ${statusColor(payment.status)}`}
                    >
                      {statusLabel(payment.status)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
