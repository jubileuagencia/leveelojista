'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotionPage } from '@/hooks/use-notion';
import { NotionBlockRenderer } from './notion-block-renderer';
import { ArrowLeft, ExternalLink, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface NotionPageViewerProps {
  pageId: string;
  onBack: () => void;
}

export function NotionPageViewer({ pageId, onBack }: NotionPageViewerProps) {
  const { data, isLoading, error } = useNotionPage(pageId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
        <p className="text-sm text-destructive">
          Erro ao carregar pagina.
        </p>
      </div>
    );
  }

  const { page, blocks } = data;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 mt-0.5">
          <ArrowLeft className="size-4" />
        </Button>

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold leading-tight">
            {page.icon?.emoji && <span className="mr-2">{page.icon.emoji}</span>}
            {page.title}
          </h2>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatRelativeTime(page.lastEdited)}
            </span>
          </div>
        </div>

        <a
          href={page.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            <ExternalLink className="size-3.5" />
            Notion
          </Button>
        </a>
      </div>

      {/* Content */}
      <ScrollArea className="max-h-[calc(100vh-280px)]">
        <div className="pr-4">
          <NotionBlockRenderer blocks={blocks} />
        </div>
      </ScrollArea>
    </div>
  );
}
