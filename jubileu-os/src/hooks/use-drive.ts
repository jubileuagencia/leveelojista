'use client';

import { useQuery } from '@tanstack/react-query';
import type { DriveFile } from '@/app/api/drive/route';

export type { DriveFile };

export function useDriveFiles(folderId: string) {
  return useQuery<{ files: DriveFile[]; folderId: string }>({
    queryKey: ['drive', folderId],
    queryFn: async () => {
      const res = await fetch(`/api/drive?folderId=${folderId}`);
      if (!res.ok) throw new Error('Erro ao carregar arquivos');
      return res.json();
    },
    staleTime: 30_000,
  });
}
