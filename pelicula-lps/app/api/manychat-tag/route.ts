import { NextResponse } from "next/server";

const MANYCHAT_API_TOKEN = process.env.MANYCHAT_API_TOKEN ?? "";

export async function POST(request: Request) {
  try {
    const { subscriber_id, tag_id } = await request.json();

    if (!subscriber_id || !tag_id) {
      return NextResponse.json({ error: "subscriber_id e tag_id obrigatórios" }, { status: 400 });
    }

    if (!MANYCHAT_API_TOKEN) {
      return NextResponse.json({ error: "ManyChat não configurado" }, { status: 500 });
    }

    const res = await fetch("https://api.manychat.com/fb/subscriber/addTag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MANYCHAT_API_TOKEN}`,
      },
      body: JSON.stringify({ subscriber_id, tag_id }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("ManyChat addTag error:", res.status, text);
      return NextResponse.json({ error: "Erro ao adicionar tag" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ManyChat tag route error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
