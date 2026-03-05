"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Erro ao redefinir senha. O link pode ter expirado.");
      setLoading(false);
      return;
    }

    router.push("/catalogo");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-aspect-red/10 border border-aspect-red/30 rounded-lg p-3 text-sm text-aspect-red">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="password"
          className="block text-sm text-text-soft mb-1.5"
        >
          Nova senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm text-text-soft mb-1.5"
        >
          Confirmar nova senha
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="Repita a senha"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold hover:bg-gold-light text-void font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Salvando..." : "Redefinir senha"}
      </button>
    </form>
  );
}
