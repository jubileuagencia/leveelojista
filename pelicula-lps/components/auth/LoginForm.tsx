"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push(redirectTo || "/catalogo");
    router.refresh();
  }

  async function handleMagicLink() {
    if (!email) {
      setError("Digite seu email primeiro.");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo || "/catalogo")}`,
      },
    });

    if (error) {
      setError("Erro ao enviar link. Tente novamente.");
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
  }

  if (magicLinkSent) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-4">✉️</div>
        <p className="text-text font-medium mb-2">Link enviado!</p>
        <p className="text-text-muted text-sm">
          Verifique seu email <strong className="text-text">{email}</strong> e
          clique no link para entrar.
        </p>
        <button
          onClick={() => setMagicLinkSent(false)}
          className="mt-4 text-gold text-sm hover:underline"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
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

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="password" className="block text-sm text-text-soft">
            Senha
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-gold hover:underline"
          >
            Esqueci a senha
          </Link>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold hover:bg-gold-light text-void font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-text-muted">ou</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleMagicLink}
        disabled={loading}
        className="w-full border border-white/10 hover:border-gold/30 text-text-soft hover:text-text py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
      >
        Entrar com link mágico
      </button>

      <p className="text-center text-sm text-text-muted pt-2">
        Não tem conta?{" "}
        <Link href="/signup" className="text-gold hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
