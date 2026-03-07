"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CommunityCategory, UserRole } from "@/lib/types/database";
import CreatePostForm from "./CreatePostForm";

type PostData = {
  id: string;
  title: string;
  body: string;
  is_pinned: boolean;
  is_locked: boolean;
  reaction_count: number;
  comment_count: number;
  created_at: string;
  author: { id: string; full_name: string; avatar_emoji: string | null; zodiac_sign: string | null; role: string };
  category: { slug: string; name: string; emoji: string | null };
};

export default function CommunityFeed({
  categories,
  posts,
  activeCategory,
  userId,
  userRole,
}: {
  categories: CommunityCategory[];
  posts: PostData[];
  activeCategory: string | null;
  userId: string;
  userRole: UserRole;
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "agora";
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    return `${Math.floor(days / 30)}m`;
  }

  function roleBadge(role: string) {
    if (role === "admin") return <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/20 text-gold font-medium">Admin</span>;
    if (role === "moderator") return <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple/20 text-purple-light font-medium">Mod</span>;
    return null;
  }

  return (
    <div>
      {/* Category pills */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        <Link
          href="/comunidade"
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm transition-colors ${
            !activeCategory
              ? "bg-gold/20 text-gold border border-gold/30"
              : "bg-card border border-white/5 text-text-muted hover:text-text"
          }`}
        >
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/comunidade?categoria=${cat.slug}`}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm transition-colors ${
              activeCategory === cat.slug
                ? "bg-gold/20 text-gold border border-gold/30"
                : "bg-card border border-white/5 text-text-muted hover:text-text"
            }`}
          >
            {cat.emoji} {cat.name}
          </Link>
        ))}
      </div>

      {/* Create post button / form */}
      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full mb-5 p-4 bg-card border border-white/5 rounded-xl text-left text-text-muted text-sm hover:border-gold/20 hover:text-text-soft transition-colors"
        >
          Compartilhe algo com a comunidade...
        </button>
      ) : (
        <CreatePostForm
          categories={categories}
          userId={userId}
          onCancel={() => setShowCreateForm(false)}
          onCreated={() => {
            setShowCreateForm(false);
            router.refresh();
          }}
        />
      )}

      {/* Posts feed */}
      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/comunidade/${post.id}`}
            className="block bg-card border border-white/5 rounded-xl p-5 hover:border-gold/10 transition-colors"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-purple/20 flex items-center justify-center text-base">
                {post.author.avatar_emoji || "🌟"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text truncate">
                    {post.author.full_name}
                  </span>
                  {roleBadge(post.author.role)}
                  {post.author.zodiac_sign && (
                    <span className="text-text-muted text-xs">
                      {post.author.zodiac_sign}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span>{post.category.emoji} {post.category.name}</span>
                  <span>·</span>
                  <span>{timeAgo(post.created_at)}</span>
                </div>
              </div>
              {post.is_pinned && (
                <span className="text-gold text-xs">📌 Fixado</span>
              )}
            </div>

            {/* Content */}
            <h3 className="text-text font-medium mb-1">{post.title}</h3>
            <p className="text-text-soft text-sm line-clamp-3">{post.body}</p>

            {/* Footer */}
            <div className="flex items-center gap-4 mt-3 text-text-muted text-xs">
              <span className="flex items-center gap-1">
                ⭐ {post.reaction_count}
              </span>
              <span className="flex items-center gap-1">
                💬 {post.comment_count}
              </span>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <div className="text-4xl mb-3">🌌</div>
            <p className="text-sm">Nenhum post ainda nesta categoria.</p>
            <p className="text-xs mt-1">Seja o primeiro a compartilhar!</p>
          </div>
        )}
      </div>
    </div>
  );
}
