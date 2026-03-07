import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/lib/admin";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const isAdmin = await checkIsAdmin(supabase, user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { user_id, role } = await request.json();

  if (!user_id || !role) {
    return NextResponse.json({ error: "user_id e role obrigatórios" }, { status: 400 });
  }

  if (!["member", "moderator", "admin"].includes(role)) {
    return NextResponse.json({ error: "Role inválido" }, { status: 400 });
  }

  // Prevent self-modification
  if (user_id === user.id) {
    return NextResponse.json({ error: "Não pode alterar próprio role" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_profiles")
    .update({ role })
    .eq("id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
