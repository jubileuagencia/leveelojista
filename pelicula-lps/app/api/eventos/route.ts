import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  try {
    const supabase = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    let query;

    if (slug) {
      // Buscar evento específico por slug
      query = sb
        .from("eventos")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
    } else {
      // Buscar evento ativo mais recente
      query = sb
        .from("eventos")
        .select("*")
        .eq("is_active", true)
        .order("data_evento", { ascending: false })
        .limit(1)
        .maybeSingle();
    }

    const { data: evento, error } = await query;

    if (error) {
      console.error("Erro ao buscar evento:", error);
      return NextResponse.json({ error: "Erro ao buscar evento" }, { status: 500 });
    }

    if (!evento) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    return NextResponse.json(evento);
  } catch (err) {
    console.error("Eventos API error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
