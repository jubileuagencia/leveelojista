import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { lessonId, watchedSeconds, watchedPercent, lastPositionSeconds, completed } = body;

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    user_id: user.id,
    lesson_id: lessonId,
    updated_at: new Date().toISOString(),
  };

  if (watchedSeconds !== undefined) updates.watched_seconds = watchedSeconds;
  if (watchedPercent !== undefined) updates.watched_percent = Math.min(100, watchedPercent);
  if (lastPositionSeconds !== undefined) updates.last_position_seconds = lastPositionSeconds;
  if (completed !== undefined) {
    updates.completed = completed;
    if (completed) updates.completed_at = new Date().toISOString();
  }

  const { error } = await supabase.from("lesson_progress").upsert(updates, {
    onConflict: "user_id,lesson_id",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
