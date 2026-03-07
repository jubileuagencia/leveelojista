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

  const { title, body, category_id } = await request.json();

  if (!title?.trim() || !body?.trim() || !category_id) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      author_id: user.id,
      category_id,
      title: title.trim(),
      body: body.trim(),
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const postId = request.nextUrl.searchParams.get("id");
  if (!postId) {
    return NextResponse.json({ error: "ID do post obrigatório" }, { status: 400 });
  }

  // Check if user is author or admin
  const { data: post } = await supabase
    .from("community_posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (!post) {
    return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (post.author_id !== user.id && profile?.role !== "admin") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  await supabase.from("community_posts").delete().eq("id", postId);

  return NextResponse.json({ ok: true });
}
