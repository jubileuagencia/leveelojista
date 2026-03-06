'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDriveFiles } from '@/hooks/use-drive';
import type { DriveFile } from '@/hooks/use-drive';
import {
  Folder,
  FileText,
  Image,
  Film,
  FileSpreadsheet,
  File,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  HardDrive,
} from 'lucide-react';

const MIME_ICONS: Record<string, typeof File> = {
  'application/vnd.google-apps.folder': Folder,
  'application/vnd.google-apps.document': FileText,
  'application/vnd.google-apps.spreadsheet': FileSpreadsheet,
  'application/pdf': FileText,
  'image/png': Image,
  'image/jpeg': Image,
  'image/webp': Image,
  'video/mp4': Film,
};

const MIME_COLORS: Record<string, string> = {
  'application/vnd.google-apps.folder': 'text-amber-500',
  'application/vnd.google-apps.document': 'text-blue-500',
  'application/vnd.google-apps.spreadsheet': 'text-green-500',
  'application/pdf': 'text-red-500',
  'image/png': 'text-purple-500',
  'image/jpeg': 'text-purple-500',
  'video/mp4': 'text-pink-500',
};

function formatSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h atras`;
  const days = Math.floor(hours / 24);
  return `${days}d atras`;
}

export default function DrivePage() {
  const [folderStack, setFolderStack] = useState<{ id: string; name: string }[]>([
    { id: 'root', name: 'Meu Drive' },
  ]);
  const currentFolder = folderStack[folderStack.length - 1];
  const { data, isLoading } = useDriveFiles(currentFolder.id);

  function navigateToFolder(file: DriveFile) {
    setFolderStack([...folderStack, { id: file.id, name: file.name }]);
  }

  function navigateBack() {
    if (folderStack.length > 1) {
      setFolderStack(folderStack.slice(0, -1));
    }
  }

  function navigateToBreadcrumb(index: number) {
    setFolderStack(folderStack.slice(0, index + 1));
  }

  function handleFileClick(file: DriveFile) {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      navigateToFolder(file);
    } else if (file.webViewLink) {
      window.open(file.webViewLink, '_blank');
    }
  }

  const files = data?.files ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Google Drive</h1>
        <p className="text-sm text-muted-foreground">
          Navegue pelos arquivos da agencia.
        </p>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-sm">
        {folderStack.length > 1 && (
          <Button variant="ghost" size="icon" className="size-7" onClick={navigateBack}>
            <ArrowLeft className="size-4" />
          </Button>
        )}
        {folderStack.map((folder, idx) => (
          <div key={folder.id} className="flex items-center">
            {idx > 0 && <ChevronRight className="size-3 text-muted-foreground mx-1" />}
            <button
              className={`hover:underline ${
                idx === folderStack.length - 1 ? 'font-medium' : 'text-muted-foreground'
              }`}
              onClick={() => navigateToBreadcrumb(idx)}
            >
              {folder.name}
            </button>
          </div>
        ))}
      </div>

      {/* File List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <HardDrive className="mb-3 size-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Pasta vazia.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {files.map((file) => {
                const Icon = MIME_ICONS[file.mimeType] ?? File;
                const color = MIME_COLORS[file.mimeType] ?? 'text-muted-foreground';
                const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-accent/50"
                    onClick={() => handleFileClick(file)}
                  >
                    <Icon className={`size-5 shrink-0 ${color}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-xs text-muted-foreground">
                      {file.size && <span>{formatSize(file.size)}</span>}
                      <span className="hidden sm:inline">{timeAgo(file.modifiedTime)}</span>
                      {isFolder ? (
                        <ChevronRight className="size-4" />
                      ) : file.webViewLink ? (
                        <ExternalLink className="size-3" />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
