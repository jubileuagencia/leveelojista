"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  full_name: string;
  role: string;
  avatar_emoji: string | null;
  zodiac_sign: string | null;
  created_at: string;
};

export default function UserRoleManager({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function roleBadge(role: string) {
    if (role === "admin")
      return <span className="text-xs px-2 py-0.5 rounded bg-gold/20 text-gold font-medium">Admin</span>;
    if (role === "moderator")
      return <span className="text-xs px-2 py-0.5 rounded bg-purple/20 text-purple-light font-medium">Moderador</span>;
    return <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-text-muted font-medium">Membro</span>;
  }

  async function changeRole(userId: string, newRole: string) {
    if (userId === currentUserId) {
      alert("Você não pode alterar seu próprio role.");
      return;
    }

    setUpdating(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, role: newRole }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao atualizar role");
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 px-4 text-text-muted font-medium text-xs">Usuário</th>
              <th className="text-left py-3 px-4 text-text-muted font-medium text-xs">Role</th>
              <th className="text-left py-3 px-4 text-text-muted font-medium text-xs">Desde</th>
              <th className="text-right py-3 px-4 text-text-muted font-medium text-xs">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 last:border-0">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple/20 flex items-center justify-center text-sm">
                      {u.avatar_emoji || "🌟"}
                    </div>
                    <div>
                      <span className="text-text">{u.full_name}</span>
                      {u.zodiac_sign && (
                        <span className="text-text-muted text-xs ml-1">
                          {u.zodiac_sign}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{roleBadge(u.role)}</td>
                <td className="py-3 px-4 text-text-muted text-xs">
                  {formatDate(u.created_at)}
                </td>
                <td className="py-3 px-4 text-right">
                  {u.id !== currentUserId ? (
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      disabled={updating === u.id}
                      className="bg-deep border border-white/10 rounded px-2 py-1 text-xs text-text focus:outline-none focus:border-gold/30 disabled:opacity-50"
                    >
                      <option value="member">Membro</option>
                      <option value="moderator">Moderador</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className="text-text-muted text-xs">Você</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
