import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkCommunityAccess } from "@/lib/community-access";
import PostDetail from "@/components/platform/community/PostDetail";

export const metadata: Metadata = {
  title: "Post — Camarim Sideral",
  robots: "noindex",
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const hasAccess = await checkCommunityAccess(supabase, user.id);
  if (!hasAccess) redirect("/comunidade");

  // Fetch post with author
  const { data: post } = await supabase
    .from("community_posts")
    .select(
      `
      *,
      author:user_profiles!author_id (id, full_name, avatar_emoji, zodiac_sign, role),
      category:community_categories!category_id (slug, name, emoji)
    `
    )
    .eq("id", postId)
    .single();

  if (!post) notFound();

  // Fetch comments with authors
  const { data: comments } = await supabase
    .from("community_comments")
    .select(
      `
      *,
      author:user_profiles!author_id (id, full_name, avatar_emoji, zodiac_sign, role)
    `
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  // Get user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, full_name, avatar_emoji, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-3xl mx-auto">
      <PostDetail
        post={post}
        comments={comments || []}
        userId={user.id}
        userRole={profile?.role || "member"}
      />
    </div>
  );
}
