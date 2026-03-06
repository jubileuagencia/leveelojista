'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotionSearch, useNotionBrowse } from '@/hooks/use-notion';
import { NotionPageViewer } from '@/components/features/docs/notion-page-viewer';
import { CreatePageDialog } from '@/components/features/docs/create-page-dialog';
import { Search, FileText, Plus, ExternalLink, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import type { NotionSearchResult } from '@/lib/notion/types';

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'skills', label: 'Skills' },
  { id: 'roteiros', label: 'Roteiros' },
  { id: 'sops', label: 'SOPs' },
  { id: 'briefings', label: 'Briefings' },
];

export default function DocsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: searchData, isLoading: searchLoading } = useNotionSearch(search || ' ');
  const { data: browseData, isLoading: browseLoading } = useNotionBrowse();

  const isLoading = search ? searchLoading : browseLoading;
  const pages = search ? (searchData?.results ?? []) : (browseData?.results ?? []);

  // Simple category filter by title keyword
  const filtered = (() => {
    if (category === 'all') return pages;
    return pages.filter((p) =>
      p.title.toLowerCase().includes(category.toLowerCase())
    );
  })();

  // If viewing a page, show the viewer
  if (selectedPageId) {
    return (
      <div className="space-y-4">
        <NotionPageViewer
          pageId={selectedPageId}
          onBack={() => setSelectedPageId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Documentos</h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Nova Pagina
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar paginas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={category === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory(cat.id)}
            className="shrink-0"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Pages grid */}
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center">
          <FileText className="mx-auto mb-3 size-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            {search ? 'Nenhuma pagina encontrada.' : 'Nenhuma pagina disponivel.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              onClick={() => setSelectedPageId(page.id)}
            />
          ))}
        </div>
      )}

      <CreatePageDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        parentId={pages[0]?.id}
        onCreated={(id) => setSelectedPageId(id)}
      />
    </div>
  );
}

function PageCard({
  page,
  onClick,
}: {
  page: NotionSearchResult;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
    >
      <div className="mb-2 flex items-start gap-2">
        <span className="text-lg">
          {page.icon?.emoji || '📄'}
        </span>
        <h3 className="min-w-0 flex-1 text-sm font-medium leading-snug line-clamp-2">
          {page.title || 'Untitled'}
        </h3>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <Clock className="size-3" />
        <span>{formatRelativeTime(page.lastEdited)}</span>

        <a
          href={page.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="size-3" />
        </a>
      </div>
    </div>
  );
}
