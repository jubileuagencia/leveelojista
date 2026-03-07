import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkCommunityAccess } from "@/lib/community-access";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const hasAccess = await checkCommunityAccess(supabase, user.id);
  if (!hasAccess) {
    return NextResponse.json({ error: "Sem acesso à comunidade" }, { status: 403 });
  }

  const { post_id, body, parent_id } = await request.json();

  if (!post_id || !body?.trim()) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  // Check if post is locked
  const { data: post } = await supabase
    .from("community_posts")
    .select("is_locked")
    .eq("id", post_id)
    .single();

  if (!post) {
    return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
  }

  if (post.is_locked) {
    return NextResponse.json({ error: "Post fechado para comentários" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("community_comments")
    .insert({
      post_id,
      author_id: user.id,
      parent_id: parent_id || null,
      body: body.trim(),
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
