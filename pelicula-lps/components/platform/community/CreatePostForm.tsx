"use client";

import { useState } from "react";
import type { CommunityCategory } from "@/lib/types/database";

export default function CreatePostForm({
  categories,
  userId,
  onCancel,
  onCreated,
}: {
  categories: CommunityCategory[];
  userId: string;
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), category_id: categoryId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar post");
      }

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-gold/20 rounded-xl p-5 mb-5 space-y-4"
    >
      <div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full bg-deep border border-white/10 rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-gold/30"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.emoji} {cat.name}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="Título do post"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-deep border border-white/10 rounded-lg px-3 py-2 text-text placeholder:text-text-muted focus:outline-none focus:border-gold/30"
        maxLength={200}
      />

      <textarea
        placeholder="O que você quer compartilhar?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        className="w-full bg-deep border border-white/10 rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-gold/30 resize-none"
        maxLength={5000}
      />

      {error && <p className="text-aspect-red text-xs">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !title.trim() || !body.trim()}
          className="px-4 py-2 text-sm bg-gold text-void font-medium rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  );
}
