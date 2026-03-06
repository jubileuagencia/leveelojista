'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      toast.error('Formato invalido. Use JPG, PNG ou WebP.');
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error('Imagem muito grande. Maximo 2MB.');
      return;
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await res.json();
      onChange(url);
      setPreview(url);
    } catch {
      toast.error('Erro ao fazer upload da imagem');
      setPreview(value);
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        disabled={disabled || uploading}
      />

      {preview ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-32 rounded-lg border object-cover"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 size-6"
              onClick={handleRemove}
            >
              <X className="size-3" />
            </Button>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
              <Loader2 className="size-6 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-32 w-32"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
        >
          <div className="flex flex-col items-center gap-1">
            <ImagePlus className="size-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Upload</span>
          </div>
        </Button>
      )}
    </div>
  );
}
