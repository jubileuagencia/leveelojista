import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <FileQuestion className="size-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">Pagina nao encontrada</h1>
      <p className="text-muted-foreground">
        A pagina que voce procura nao existe.
      </p>
      <Button asChild>
        <Link href="/dashboard">Voltar ao Dashboard</Link>
      </Button>
    </div>
  );
}
