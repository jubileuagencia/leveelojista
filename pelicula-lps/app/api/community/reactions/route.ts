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

  const { post_id, comment_id } = await request.json();

  if (!post_id && !comment_id) {
    return NextResponse.json({ error: "post_id ou comment_id obrigatório" }, { status: 400 });
  }

  // Toggle reaction: if already exists, remove it; otherwise, create it
  if (post_id) {
    const { data: existing } = await supabase
      .from("community_reactions")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", post_id)
      .maybeSingle();

    if (existing) {
      await supabase.from("community_reactions").delete().eq("id", existing.id);
      return NextResponse.json({ action: "removed" });
    }

    await supabase.from("community_reactions").insert({
      user_id: user.id,
      post_id,
    });
    return NextResponse.json({ action: "added" }, { status: 201 });
  }

  if (comment_id) {
    const { data: existing } = await supabase
      .from("community_reactions")
      .select("id")
      .eq("user_id", user.id)
      .eq("comment_id", comment_id)
      .maybeSingle();

    if (existing) {
      await supabase.from("community_reactions").delete().eq("id", existing.id);
      return NextResponse.json({ action: "removed" });
    }

    await supabase.from("community_reactions").insert({
      user_id: user.id,
      comment_id,
    });
    return NextResponse.json({ action: "added" }, { status: 201 });
  }

  return NextResponse.json({ error: "Alvo inválido" }, { status: 400 });
}
