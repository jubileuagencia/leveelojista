'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { NotionSearchResult, NotionBlock, NotionPage, NotionIcon } from '@/lib/notion/types';

interface PageData {
  page: {
    id: string;
    title: string;
    icon: NotionIcon | null;
    cover: unknown;
    lastEdited: string;
    url: string;
    parent: unknown;
  };
  blocks: NotionBlock[];
}

interface SearchResponse {
  results: NotionSearchResult[];
  has_more: boolean;
  next_cursor: string | null;
}

export function useNotionSearch(query: string) {
  return useQuery({
    queryKey: ['notion', 'search', query],
    queryFn: () => api.get<SearchResponse>(`/notion/search?q=${encodeURIComponent(query)}`),
    enabled: query.length > 0,
    staleTime: 60 * 1000,
  });
}

export function useNotionPage(pageId: string | null) {
  return useQuery({
    queryKey: ['notion', 'page', pageId],
    queryFn: () => api.get<PageData>(`/notion/pages/${pageId}`),
    enabled: !!pageId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useNotionChildren(pageId: string | null) {
  return useQuery({
    queryKey: ['notion', 'children', pageId],
    queryFn: () => api.get<NotionSearchResult[]>(`/notion/pages/${pageId}/children`),
    enabled: !!pageId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useNotionBrowse() {
  // Browse root pages (empty search returns recent pages)
  return useQuery({
    queryKey: ['notion', 'browse'],
    queryFn: () => api.get<SearchResponse>('/notion/search?q='),
    staleTime: 60 * 1000,
  });
}

export function useCreateNotionPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { parentId: string; title: string; parentType?: 'page' | 'database' }) =>
      api.post<NotionPage>('/notion/pages', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion'] });
    },
  });
}
