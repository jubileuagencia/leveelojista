import { requireAuth } from '@/lib/auth';
import { SettingsNav } from '@/components/features/settings/settings-nav';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuracoes</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seu perfil e configuracoes da plataforma.
        </p>
      </div>
      <SettingsNav userRole={user.role} />
      {children}
    </div>
  );
}
