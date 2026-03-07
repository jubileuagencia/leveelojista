"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/agentes", label: "Agentes IA", icon: "🤖" },
  { href: "/admin/workflows", label: "Workflows", icon: "⚡" },
  { href: "/admin/clientes", label: "Clientes", icon: "👥" },
  { href: "/admin/documentos", label: "Documentos", icon: "📄" },
  { href: "/admin/users", label: "Usuarios", icon: "🔐" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1.5 flex-wrap mb-6">
      {adminLinks.map((link) => {
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              isActive
                ? "bg-gold/20 text-gold"
                : "bg-white/5 text-text-muted hover:text-text hover:bg-white/10"
            }`}
          >
            {link.icon} {link.label}
          </Link>
        );
      })}
    </div>
  );
}
