import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await request.json();
  if (!videoId) {
    return NextResponse.json(
      { error: "videoId is required" },
      { status: 400 }
    );
  }

  // Get user profile for watermark text
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const watermarkText =
    profile?.full_name && user.email
      ? `${profile.full_name} — ${user.email}`
      : user.email || user.id;

  const secret = new TextEncoder().encode(
    process.env.PANDA_WATERMARK_SECRET || "fallback-dev-secret"
  );

  const token = await new SignJWT({
    sub: user.id,
    video: videoId,
    watermark: watermarkText,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("4h")
    .sign(secret);

  return NextResponse.json({ token });
}
