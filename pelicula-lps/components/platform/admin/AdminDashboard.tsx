"use client";

import Link from "next/link";

type Stats = {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  activeSubscriptions: number;
  totalPayments: number;
  totalPosts: number;
};

type RecentUser = {
  id: string;
  full_name: string;
  role: string;
  avatar_emoji: string | null;
  created_at: string;
};

type RecentPayment = {
  id: string;
  amount_cents: number;
  status: string;
  created_at: string;
  user_name: string;
  plan_name: string;
};

const statCards = [
  { key: "totalUsers", label: "Usuários", icon: "👥", color: "text-purple-light" },
  { key: "totalCourses", label: "Cursos", icon: "📚", color: "text-gold" },
  { key: "totalLessons", label: "Aulas", icon: "🎬", color: "text-aspect-blue" },
  { key: "activeSubscriptions", label: "Assinaturas Ativas", icon: "💳", color: "text-aspect-green" },
  { key: "totalPayments", label: "Pagamentos", icon: "💰", color: "text-gold-light" },
  { key: "totalPosts", label: "Posts Comunidade", icon: "💬", color: "text-purple-light" },
] as const;

export default function AdminDashboard({
  stats,
  recentUsers,
  recentPayments,
}: {
  stats: Stats;
  recentUsers: RecentUser[];
  recentPayments: RecentPayment[];
}) {
  function formatPrice(cents: number) {
    return (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }

  function statusBadge(status: string) {
    const colors: Record<string, string> = {
      approved: "bg-aspect-green/20 text-aspect-green",
      authorized: "bg-aspect-green/20 text-aspect-green",
      pending: "bg-gold/20 text-gold",
      rejected: "bg-aspect-red/20 text-aspect-red",
      cancelled: "bg-aspect-red/20 text-aspect-red",
    };
    const labels: Record<string, string> = {
      approved: "Aprovado",
      authorized: "Ativa",
      pending: "Pendente",
      rejected: "Rejeitado",
      cancelled: "Cancelado",
    };
    return (
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
          colors[status] || "bg-white/10 text-text-muted"
        }`}
      >
        {labels[status] || status}
      </span>
    );
  }

  function roleBadge(role: string) {
    if (role === "admin")
      return <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/20 text-gold font-medium">Admin</span>;
    if (role === "moderator")
      return <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple/20 text-purple-light font-medium">Mod</span>;
    return <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted font-medium">Membro</span>;
  }

  return (
    <div>
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="bg-card border border-white/5 rounded-xl p-5"
          >
            <div className="text-text-muted text-xs mb-1">{card.icon} {card.label}</div>
            <div className={`text-2xl font-bold ${card.color}`}>
              {stats[card.key]}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <Link
          href="/admin/users"
          className="px-4 py-2 text-sm bg-card border border-white/5 rounded-lg text-text-soft hover:text-text hover:border-gold/20 transition-colors"
        >
          🔐 Usuarios
        </Link>
        <Link
          href="/admin/agentes"
          className="px-4 py-2 text-sm bg-card border border-white/5 rounded-lg text-text-soft hover:text-text hover:border-gold/20 transition-colors"
        >
          🤖 Agentes IA
        </Link>
        <Link
          href="/admin/workflows"
          className="px-4 py-2 text-sm bg-card border border-white/5 rounded-lg text-text-soft hover:text-text hover:border-gold/20 transition-colors"
        >
          ⚡ Workflows
        </Link>
        <Link
          href="/admin/clientes"
          className="px-4 py-2 text-sm bg-card border border-white/5 rounded-lg text-text-soft hover:text-text hover:border-gold/20 transition-colors"
        >
          👥 Clientes
        </Link>
        <Link
          href="/admin/documentos"
          className="px-4 py-2 text-sm bg-card border border-white/5 rounded-lg text-text-soft hover:text-text hover:border-gold/20 transition-colors"
        >
          📄 Documentos
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent users */}
        <section className="bg-card border border-white/5 rounded-xl p-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text mb-4">
            Usuários Recentes
          </h2>
          <div className="space-y-2">
            {recentUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-purple/20 flex items-center justify-center text-sm">
                  {u.avatar_emoji || "🌟"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text truncate">{u.full_name}</span>
                    {roleBadge(u.role)}
                  </div>
                  <span className="text-xs text-text-muted">{formatDate(u.created_at)}</span>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-text-muted text-sm text-center py-4">
                Nenhum usuário ainda.
              </p>
            )}
          </div>
        </section>

        {/* Recent payments */}
        <section className="bg-card border border-white/5 rounded-xl p-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text mb-4">
            Pagamentos Recentes
          </h2>
          <div className="space-y-2">
            {recentPayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div>
                  <p className="text-sm text-text">{p.user_name}</p>
                  <p className="text-xs text-text-muted">
                    {p.plan_name} · {formatDate(p.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text">{formatPrice(p.amount_cents)}</p>
                  {statusBadge(p.status)}
                </div>
              </div>
            ))}
            {recentPayments.length === 0 && (
              <p className="text-text-muted text-sm text-center py-4">
                Nenhum pagamento ainda.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
