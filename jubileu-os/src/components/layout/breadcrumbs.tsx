'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

const labels: Record<string, string> = {
  dashboard: 'Dashboard',
  tasks: 'Tarefas',
  clients: 'Clientes',
  docs: 'Documentos',
  settings: 'Configuracoes',
  users: 'Usuarios',
  agents: 'Agentes',
  workflows: 'Workflows',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const label = labels[segment] || segment;
        const isLast = index === segments.length - 1;

        return (
          <Fragment key={href}>
            {index > 0 && <ChevronRight className="size-3.5" />}
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
