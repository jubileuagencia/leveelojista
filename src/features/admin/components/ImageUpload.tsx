import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  onUpload: (file: File) => Promise<string>
  disabled?: boolean
}

export function ImageUpload({ value, onChange, onUpload, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const url = await onUpload(file)
      onChange(url)
    } catch {
      // Error handled by mutation
    } finally {
      setUploading(false)
    }
  }, [onUpload, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }, [handleFile])

  if (value) {
    return (
      <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-lg border bg-muted/30">
        <img src={value} alt="Produto" className="size-full object-cover" />
        <Button
          type="button"
          variant="destructive"
          size="icon-xs"
          className="absolute top-1.5 right-1.5"
          onClick={() => onChange(null)}
          disabled={disabled}
        >
          <X className="size-3" />
        </Button>
      </div>
    )
  }

  return (
    <label
      className={cn(
        'flex aspect-square w-full max-w-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors',
        dragOver ? 'border-emerald-500 bg-emerald-50/50' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        (uploading || disabled) && 'pointer-events-none opacity-50'
      )}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        disabled={uploading || disabled}
      />
      {uploading ? (
        <div className="size-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      ) : (
        <>
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            {dragOver ? <ImageIcon className="size-5 text-emerald-600" /> : <Upload className="size-5 text-muted-foreground" />}
          </div>
          <span className="text-xs text-muted-foreground text-center px-2">
            Arraste ou clique para enviar
          </span>
        </>
      )}
    </label>
  )
}
