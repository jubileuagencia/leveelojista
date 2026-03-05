import { SupabaseClient } from "@supabase/supabase-js";

export async function checkCourseAccess(
  supabase: SupabaseClient,
  userId: string,
  courseId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("user_course_access")
    .select("id, expires_at")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .limit(1);

  if (!data || data.length === 0) return false;

  const access = data[0];
  if (!access.expires_at) return true; // Lifetime access

  return new Date(access.expires_at) > new Date();
}

export async function getUserAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data } = await supabase
    .from("user_course_access")
    .select("course_id, expires_at")
    .eq("user_id", userId);

  if (!data) return [];

  const now = new Date();
  return data
    .filter((a) => !a.expires_at || new Date(a.expires_at) > now)
    .map((a) => a.course_id);
}
