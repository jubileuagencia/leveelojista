import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNav";

export default function PlatformShell({
  children,
  userName,
  userRole = "member",
}: {
  children: React.ReactNode;
  userName: string;
  userRole?: "member" | "admin" | "moderator";
}) {
  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar userName={userName} />
        <main className="flex-1 p-6 pb-20 lg:pb-6">{children}</main>
      </div>
      <MobileNav userRole={userRole} />
    </div>
  );
}
