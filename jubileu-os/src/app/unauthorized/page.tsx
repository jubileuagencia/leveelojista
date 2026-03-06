import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <ShieldX className="size-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">Acesso Negado</h1>
      <p className="text-muted-foreground">
        Voce nao tem permissao para acessar esta pagina.
      </p>
      <Button asChild>
        <Link href="/dashboard">Voltar ao Dashboard</Link>
      </Button>
    </div>
  );
}
