import { SupabaseClient } from "@supabase/supabase-js";

export async function checkCommunityAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  // Check role first (admin/moderator always have access)
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profile?.role === "admin" || profile?.role === "moderator") {
    return true;
  }

  // Check for active camarim subscription
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, plans!inner(slug)")
    .eq("user_id", userId)
    .eq("status", "authorized")
    .in("plans.slug", ["camarim-mensal", "pacote-anual"])
    .limit(1);

  return !!subs && subs.length > 0;
}
