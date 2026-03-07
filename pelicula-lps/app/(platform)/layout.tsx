import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PlatformShell from "@/components/platform/PlatformShell";
import { ToastProvider } from "@/components/ui/Toast";

const isDevBypass = process.env.NODE_ENV === "development" && process.env.DEV_ADMIN_BYPASS === "true";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isDevBypass) {
    redirect("/login");
  }

  let userName = "Dev Admin";
  let userRole: "member" | "admin" | "moderator" = "admin";

  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    userName =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Usuário";

    userRole = (profile?.role as "member" | "admin" | "moderator") || "member";

    if (isDevBypass) userRole = "admin";
  }

  return (
    <ToastProvider>
      <PlatformShell userName={userName} userRole={userRole}>{children}</PlatformShell>
    </ToastProvider>
  );
}
