"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/types/database";

type PostAuthor = {
  id: string;
  full_name: string;
  avatar_emoji: string | null;
  zodiac_sign: string | null;
  role: string;
};

type PostData = {
  id: string;
  title: string;
  body: string;
  is_pinned: boolean;
  is_locked: boolean;
  reaction_count: number;
  comment_count: number;
  created_at: string;
  author: PostAuthor;
  category: { slug: string; name: string; emoji: string | null };
};

type CommentData = {
  id: string;
  body: string;
  parent_id: string | null;
  reaction_count: number;
  created_at: string;
  author: PostAuthor;
};

export default function PostDetail({
  post,
  comments,
  userId,
  userRole,
}: {
  post: PostData;
  comments: CommentData[];
  userId: string;
  userRole: UserRole;
}) {
  const router = useRouter();
  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reacting, setReacting] = useState(false);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function roleBadge(role: string) {
    if (role === "admin")
      return (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/20 text-gold font-medium">
          Admin
        </span>
      );
    if (role === "moderator")
      return (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple/20 text-purple-light font-medium">
          Mod
        </span>
      );
    return null;
  }

  async function handleReact() {
    if (reacting) return;
    setReacting(true);
    try {
      await fetch("/api/community/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id }),
      });
      router.refresh();
    } finally {
      setReacting(false);
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentBody.trim() || submitting || post.is_locked) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id, body: commentBody.trim() }),
      });

      if (res.ok) {
        setCommentBody("");
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    await fetch(`/api/community/posts?id=${post.id}`, { method: "DELETE" });
    router.push("/comunidade");
    router.refresh();
  }

  const canDelete = userId === post.author.id || userRole === "admin";

  // Separate top-level comments from replies
  const topComments = comments.filter((c) => !c.parent_id);

  return (
    <div>
      {/* Back */}
      <Link
        href="/comunidade"
        className="inline-flex items-center gap-1 text-text-muted text-sm hover:text-text mb-5 transition-colors"
      >
        ← Voltar
      </Link>

      {/* Post */}
      <article className="bg-card border border-white/5 rounded-xl p-6 mb-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center text-lg">
            {post.author.avatar_emoji || "🌟"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text">
                {post.author.full_name}
              </span>
              {roleBadge(post.author.role)}
            </div>
            <div className="text-xs text-text-muted">
              {post.category.emoji} {post.category.name} ·{" "}
              {formatDate(post.created_at)}
            </div>
          </div>
          {canDelete && (
            <button
              onClick={handleDelete}
              className="text-text-muted hover:text-aspect-red text-xs transition-colors"
            >
              Excluir
            </button>
          )}
        </div>

        {post.is_pinned && (
          <div className="text-gold text-xs mb-3">📌 Post fixado</div>
        )}

        <h1 className="font-[family-name:var(--font-display)] text-xl font-bold text-text mb-3">
          {post.title}
        </h1>

        <div className="text-text-soft text-sm leading-relaxed whitespace-pre-wrap">
          {post.body}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/5">
          <button
            onClick={handleReact}
            disabled={reacting}
            className="flex items-center gap-1.5 text-text-muted hover:text-gold text-sm transition-colors disabled:opacity-50"
          >
            ⭐ {post.reaction_count}
          </button>
          <span className="text-text-muted text-sm">
            💬 {comments.length}
          </span>
        </div>
      </article>

      {/* Comment form */}
      {!post.is_locked ? (
        <form onSubmit={handleComment} className="mb-6">
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="Escreva um comentário..."
            rows={3}
            className="w-full bg-card border border-white/5 rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-gold/30 resize-none"
            maxLength={3000}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !commentBody.trim()}
              className="px-4 py-2 text-sm bg-gold text-void font-medium rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Enviando..." : "Comentar"}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 text-text-muted text-sm mb-6">
          🔒 Este post está fechado para comentários.
        </div>
      )}

      {/* Comments */}
      <div className="space-y-3">
        {topComments.map((comment) => (
          <div
            key={comment.id}
            className="bg-card border border-white/5 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-purple/20 flex items-center justify-center text-sm">
                {comment.author.avatar_emoji || "🌟"}
              </div>
              <span className="text-sm font-medium text-text">
                {comment.author.full_name}
              </span>
              {roleBadge(comment.author.role)}
              <span className="text-text-muted text-xs ml-auto">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <p className="text-text-soft text-sm whitespace-pre-wrap">
              {comment.body}
            </p>
          </div>
        ))}

        {topComments.length === 0 && (
          <div className="text-center py-8 text-text-muted text-sm">
            Nenhum comentário ainda. Seja o primeiro!
          </div>
        )}
      </div>
    </div>
  );
}
