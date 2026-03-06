'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';
import { navItems, bottomNavItems, type NavItemConfig } from './nav-items';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import type { UserRole } from '@/types';

interface SidebarProps {
  userRole: UserRole;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  const filteredItems = navItems.filter(
    (item) => item.roles.includes(userRole) && !item.phase
  );
  const filteredBottomItems = bottomNavItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside
      className={cn(
        'hidden h-screen flex-col border-r bg-card transition-all duration-200 lg:flex',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        {sidebarOpen ? (
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            Jubileu OS
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto text-lg font-bold">
            J
          </Link>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 p-2">
        {filteredItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
            collapsed={!sidebarOpen}
          />
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="space-y-1 border-t p-2">
        {filteredBottomItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname.startsWith(item.href)}
            collapsed={!sidebarOpen}
          />
        ))}
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {sidebarOpen ? (
            <>
              <PanelLeftClose className="size-4 shrink-0" />
              <span>Recolher</span>
            </>
          ) : (
            <PanelLeft className="mx-auto size-4" />
          )}
        </button>
      </div>
    </aside>
  );
}

function NavLink({
  item,
  isActive,
  collapsed,
}: {
  item: NavItemConfig;
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-muted text-primary'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
      )}
    >
      <Icon className={cn('size-4 shrink-0', collapsed && 'mx-auto')} />
      {!collapsed && <span>{item.title}</span>}
      {!collapsed && item.badge && (
        <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
