"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError("Erro ao enviar email. Tente novamente.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-4">📧</div>
        <p className="text-text font-medium mb-2">Email enviado!</p>
        <p className="text-text-muted text-sm">
          Se existe uma conta com{" "}
          <strong className="text-text">{email}</strong>, você receberá um link
          para redefinir sua senha.
        </p>
        <Link
          href="/login"
          className="inline-block mt-4 text-gold text-sm hover:underline"
        >
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-aspect-red/10 border border-aspect-red/30 rounded-lg p-3 text-sm text-aspect-red">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm text-text-soft mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="seu@email.com"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold hover:bg-gold-light text-void font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Enviando..." : "Enviar link de recuperação"}
      </button>

      <p className="text-center text-sm text-text-muted pt-2">
        <Link href="/login" className="text-gold hover:underline">
          Voltar ao login
        </Link>
      </p>
    </form>
  );
}
