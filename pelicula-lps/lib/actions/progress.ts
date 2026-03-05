"use server";

import { createClient } from "@/lib/supabase/server";

export async function upsertLessonProgress({
  lessonId,
  watchedSeconds,
  watchedPercent,
  lastPositionSeconds,
  completed,
}: {
  lessonId: string;
  watchedSeconds?: number;
  watchedPercent?: number;
  lastPositionSeconds?: number;
  completed?: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Build update object with only provided fields
  const updates: Record<string, unknown> = {
    user_id: user.id,
    lesson_id: lessonId,
    updated_at: new Date().toISOString(),
  };

  if (watchedSeconds !== undefined) updates.watched_seconds = watchedSeconds;
  if (watchedPercent !== undefined) updates.watched_percent = watchedPercent;
  if (lastPositionSeconds !== undefined)
    updates.last_position_seconds = lastPositionSeconds;
  if (completed !== undefined) {
    updates.completed = completed;
    if (completed) updates.completed_at = new Date().toISOString();
  }

  const { error } = await supabase.from("lesson_progress").upsert(updates, {
    onConflict: "user_id,lesson_id",
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function getCourseProgress(courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { completed: 0, total: 0, percent: 0 };

  // Get all lessons in course
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, modules!inner(course_id)")
    .eq("modules.course_id", courseId);

  if (!lessons || lessons.length === 0)
    return { completed: 0, total: 0, percent: 0 };

  const lessonIds = lessons.map((l) => l.id);

  // Get completed count
  const { count } = await supabase
    .from("lesson_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .in("lesson_id", lessonIds)
    .eq("completed", true);

  const completed = count || 0;
  const total = lessons.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percent };
}
