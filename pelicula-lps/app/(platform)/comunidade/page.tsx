import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { checkCommunityAccess } from "@/lib/community-access";
import { redirect } from "next/navigation";
import CommunityFeed from "@/components/platform/community/CommunityFeed";

export const metadata: Metadata = {
  title: "Camarim Sideral — Comunidade",
  robots: "noindex",
};

export default async function ComunidadePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check community access
  const hasAccess = await checkCommunityAccess(supabase, user.id);

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-6">🔮</div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text mb-3">
          Camarim Sideral
        </h1>
        <p className="text-text-muted mb-6 max-w-md mx-auto">
          A comunidade exclusiva para assinantes. Aqui você troca experiências,
          tira dúvidas e se conecta com outros estudantes de astrologia.
        </p>
        <a
          href="/checkout"
          className="inline-block px-6 py-3 bg-gold text-void font-semibold rounded-lg hover:bg-gold-light transition-colors"
        >
          Assinar para ter acesso
        </a>
      </div>
    );
  }

  const params = await searchParams;
  const activeCategory = params.categoria || null;

  // Fetch categories
  const { data: categories } = await supabase
    .from("community_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  // Fetch posts with author info
  let postsQuery = supabase
    .from("community_posts")
    .select(
      `
      *,
      author:user_profiles!author_id (id, full_name, avatar_emoji, zodiac_sign, role),
      category:community_categories!category_id (slug, name, emoji)
    `
    )
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  if (activeCategory) {
    const cat = (categories || []).find((c) => c.slug === activeCategory);
    if (cat) {
      postsQuery = postsQuery.eq("category_id", cat.id);
    }
  }

  const { data: posts } = await postsQuery;

  // Get user profile for creating posts
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, full_name, avatar_emoji, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text">
            Camarim Sideral
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Comunidade exclusiva de astrologia
          </p>
        </div>
      </div>

      <CommunityFeed
        categories={categories || []}
        posts={posts || []}
        activeCategory={activeCategory}
        userId={user.id}
        userRole={profile?.role || "member"}
      />
    </div>
  );
}
