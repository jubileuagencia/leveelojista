'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems, bottomNavItems } from './nav-items';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import type { UserRole } from '@/types';

interface MobileSidebarProps {
  userRole: UserRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ userRole, open, onOpenChange }: MobileSidebarProps) {
  const pathname = usePathname();

  const filteredItems = navItems.filter(
    (item) => item.roles.includes(userRole) && !item.phase
  );
  const filteredBottomItems = bottomNavItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
        <SheetTitle className="sr-only">Menu de navegacao</SheetTitle>
        <div className="flex h-14 items-center border-b px-4">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-tight"
            onClick={() => onOpenChange(false)}
          >
            Jubileu OS
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 border-t p-2">
          {filteredBottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
