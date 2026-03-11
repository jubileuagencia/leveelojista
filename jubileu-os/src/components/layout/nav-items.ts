import {
  LayoutDashboard,
  CheckSquare,
  Users,
  FileText,
  Settings,
  Bot,
  Zap,
  Package,
  Activity,
  FileCheck,
  LayoutGrid,
  Bell,
  Calendar,
  HardDrive,
  MessageSquare,
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
    title: 'Produtos',
    href: '/products',
    icon: Package,
    roles: ['admin', 'member'],
  },
  {
    title: 'Entregas',
    href: '/deliverables',
    icon: FileCheck,
    roles: ['admin', 'member'],
  },
  {
    title: 'Documentos',
    href: '/docs',
    icon: FileText,
    roles: ['admin', 'member', 'client'],
  },
  {
    title: 'Drive',
    href: '/drive',
    icon: HardDrive,
    roles: ['admin', 'member'],
  },
  {
    title: 'Mensagens',
    href: '/messages',
    icon: MessageSquare,
    roles: ['admin', 'member'],
  },
  {
    title: 'Inbox',
    href: '/inbox',
    icon: Bell,
    roles: ['admin', 'member'],
  },
  {
    title: 'Calendario',
    href: '/calendar',
    icon: Calendar,
    roles: ['admin', 'member', 'client'],
  },
  {
    title: 'Atividade',
    href: '/activity',
    icon: Activity,
    roles: ['admin', 'member'],
  },
  {
    title: 'Portal',
    href: '/portal',
    icon: LayoutGrid,
    roles: ['client'],
  },
  {
    title: 'Entregas',
    href: '/portal/deliverables',
    icon: FileCheck,
    roles: ['client'],
  },
  {
    title: 'Agentes',
    href: '/agents',
    icon: Bot,
    roles: ['admin', 'member'],
  },
  {
    title: 'Workflows',
    href: '/workflows',
    icon: Zap,
    roles: ['admin', 'member'],
  },
];

export const bottomNavItems: NavItemConfig[] = [
  {
    title: 'Configuracoes',
    href: '/settings',
    icon: Settings,
    roles: ['admin'],
  },
];
