import {
  LayoutDashboard,
  CheckSquare,
  Users,
  FileText,
  Settings,
  Bot,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/types';

export interface NavItemConfig {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  badge?: number;
  phase?: number;
}

export const navItems: NavItemConfig[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'member', 'client'],
  },
  {
    title: 'Tarefas',
    href: '/tasks',
    icon: CheckSquare,
    roles: ['admin', 'member'],
  },
  {
    title: 'Clientes',
    href: '/clients',
    icon: Users,
    roles: ['admin', 'member'],
  },
  {
    title: 'Documentos',
    href: '/docs',
    icon: FileText,
    roles: ['admin', 'member', 'client'],
  },
  {
    title: 'Agentes',
    href: '/agents',
    icon: Bot,
    roles: ['admin'],
    phase: 2,
  },
  {
    title: 'Workflows',
    href: '/workflows',
    icon: Zap,
    roles: ['admin'],
    phase: 2,
  },
];

export const bottomNavItems: NavItemConfig[] = [
  {
    title: 'Configuracoes',
    href: '/settings/users',
    icon: Settings,
    roles: ['admin'],
  },
];
