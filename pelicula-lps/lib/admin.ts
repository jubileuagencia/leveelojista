import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const isDevBypass = process.env.NODE_ENV === "development" && process.env.DEV_ADMIN_BYPASS === "true";

export async function checkIsAdmin(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  if (isDevBypass) return true;

  const { data } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return data?.role === "admin";
}

export async function requireAdmin(): Promise<SupabaseClient> {
  const supabase = await createClient();

  if (isDevBypass) return supabase;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const isAdmin = await checkIsAdmin(supabase, user.id);
  if (!isAdmin) redirect("/catalogo");

  return supabase;
}

export async function checkIsModerator(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return data?.role === "admin" || data?.role === "moderator";
}
