import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNav";

export default function PlatformShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar userName={userName} />
        <main className="flex-1 p-6 pb-20 lg:pb-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
