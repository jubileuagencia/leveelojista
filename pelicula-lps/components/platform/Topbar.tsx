"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Topbar({ userName }: { userName: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 bg-deep/80 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-6">
      {/* Mobile logo */}
      <Link href="/catalogo" className="lg:hidden">
        <span className="font-[family-name:var(--font-display)] text-lg font-bold text-gold">
          Película
        </span>
      </Link>

      <div className="hidden lg:block" />

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 text-sm text-text-soft hover:text-text transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-semibold">
            {initials || "?"}
          </div>
          <span className="hidden sm:inline">{userName}</span>
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-white/10 rounded-lg shadow-xl py-1 z-50">
              <Link
                href="/minha-conta"
                className="block px-4 py-2 text-sm text-text-soft hover:text-text hover:bg-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Minha conta
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-aspect-red hover:bg-white/5 transition-colors"
              >
                Sair
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
