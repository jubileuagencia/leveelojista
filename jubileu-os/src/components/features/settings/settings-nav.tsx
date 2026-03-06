'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Users, type LucideIcon } from 'lucide-react';
import type { UserRole } from '@/types';

interface NavTab {
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const tabs: NavTab[] = [
  { label: 'Perfil', href: '/settings/profile', icon: User },
  { label: 'Usuarios', href: '/settings/users', icon: Users, adminOnly: true },
];

export function SettingsNav({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();

  const visibleTabs = tabs.filter((t) => !t.adminOnly || userRole === 'admin');

  return (
    <nav className="flex gap-1 border-b">
      {visibleTabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="size-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
