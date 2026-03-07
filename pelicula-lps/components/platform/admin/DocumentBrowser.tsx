"use client";

import { useState } from "react";
import Link from "next/link";
import type { DocEntry, DocCategory } from "@/lib/docs-shared";
import { categoryLabels, categoryColors } from "@/lib/docs-shared";

export default function DocumentBrowser({ docs }: { docs: DocEntry[] }) {
  const [filter, setFilter] = useState<DocCategory | "all">("all");
  const [search, setSearch] = useState("");

  const categories = Array.from(new Set(docs.map((d) => d.category)));

  const filtered = docs.filter((d) => {
    if (filter !== "all" && d.category !== filter) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar documento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border border-white/5 rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-gold/30 w-64"
        />

        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
              filter === "all"
                ? "bg-gold/20 text-gold"
                : "bg-white/5 text-text-muted hover:text-text"
            }`}
          >
            Todos ({docs.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                filter === cat
                  ? categoryColors[cat]
                  : "bg-white/5 text-text-muted hover:text-text"
              }`}
            >
              {categoryLabels[cat]} ({docs.filter((d) => d.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Doc list */}
      <div className="space-y-2">
        {filtered.map((doc) => (
          <Link
            key={doc.slug}
            href={`/admin/documentos/${doc.slug}`}
            className="flex items-center gap-3 bg-card border border-white/5 rounded-lg px-4 py-3 hover:border-gold/20 transition-colors group"
          >
            <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-text group-hover:text-gold transition-colors truncate">
                {doc.title}
              </p>
              <p className="text-xs text-text-muted truncate">{doc.relativePath}</p>
            </div>

            <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${categoryColors[doc.category]}`}>
              {categoryLabels[doc.category]}
            </span>

            <span className="text-xs text-text-muted shrink-0">{doc.sizeKb}kb</span>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className="text-text-muted text-sm text-center py-8">
            Nenhum documento encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
