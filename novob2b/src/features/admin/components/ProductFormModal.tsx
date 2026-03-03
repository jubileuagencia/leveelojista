import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUpload } from './ImageUpload'
import { useCategories, useCreateProduct, useUpdateProduct, useUploadProductImage } from '../hooks/useProducts'
import { useIsMobile } from '@/hooks/use-mobile'
import type { Product, ProductUnit } from '@/types/database'

const UNITS: { value: ProductUnit; label: string }[] = [
  { value: 'un', label: 'Unidade' },
  { value: 'kg', label: 'Quilograma' },
  { value: 'cx', label: 'Caixa' },
  { value: 'maco', label: 'Maço' },
  { value: 'dz', label: 'Dúzia' },
]

const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser maior que zero'),
  unit: z.enum(['un', 'kg', 'cx', 'maco', 'dz'] as const),
  category_id: z.string().optional(),
  image_url: z.string().nullable().optional(),
  is_active: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

export function ProductFormModal({ open, onOpenChange, product }: ProductFormModalProps) {
  const isMobile = useIsMobile()
  const isEditing = !!product
  const { data: categories } = useCategories()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const uploadMutation = useUploadProductImage()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      unit: 'un',
      category_id: '',
      image_url: null,
      is_active: true,
    },
  })

  const imageUrl = watch('image_url')
  const unit = watch('unit')
  const categoryId = watch('category_id')
  const isActive = watch('is_active')

  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          name: product.name,
          description: product.description ?? '',
          price: product.price,
          unit: product.unit,
          category_id: product.category_id ?? '',
          image_url: product.image_url ?? null,
          is_active: product.is_active,
        })
      } else {
        reset({
          name: '',
          description: '',
          price: 0,
          unit: 'un',
          category_id: '',
          image_url: null,
          is_active: true,
        })
      }
    }
  }, [open, product, reset])

  const onSubmit = async (data: ProductFormData) => {
    const input = {
      ...data,
      category_id: data.category_id || undefined,
      image_url: data.image_url || undefined,
    }

    if (isEditing) {
      await updateMutation.mutateAsync({ id: product.id, input })
    } else {
      await createMutation.mutateAsync(input)
    }

    onOpenChange(false)
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  const title = isEditing ? 'Editar Produto' : 'Novo Produto'
  const description = isEditing
    ? 'Atualize os dados do produto abaixo.'
    : 'Preencha os dados para criar um novo produto.'

  const formFields = (
    <>
      {/* Image */}
      <div className="space-y-2">
        <Label>Imagem</Label>
        <ImageUpload
          value={imageUrl}
          onChange={(url) => setValue('image_url', url)}
          onUpload={(file) => uploadMutation.mutateAsync(file)}
          disabled={isPending}
        />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          placeholder="Nome do produto"
          {...register('name')}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Price + Unit row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="price">Preço *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            {...register('price', { valueAsNumber: true })}
            aria-invalid={!!errors.price}
          />
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Unidade *</Label>
          <Select value={unit} onValueChange={(v) => setValue('unit', v as ProductUnit)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select value={categoryId || ''} onValueChange={(v) => setValue('category_id', v === 'none' ? '' : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sem categoria</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descrição do produto (opcional)"
          rows={3}
          {...register('description')}
        />
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label className="text-sm font-medium">Produto ativo</Label>
          <p className="text-xs text-muted-foreground">
            Produtos inativos não aparecem no catálogo
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={(v) => setValue('is_active', v)}
        />
      </div>
    </>
  )

  const formButtons = (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isPending}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
      </Button>
    </div>
  )

  // ── Mobile: Sheet (bottom drawer) com scroll nativo ──
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex h-[92dvh] flex-col overflow-hidden rounded-t-2xl p-0"
          showCloseButton={false}
        >
          {/* Drag handle */}
          <div className="flex shrink-0 justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          <SheetHeader className="shrink-0 px-4 pb-2">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>

          {/* Scrollable form — usa overflow nativo, não ScrollArea */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="-webkit-overflow-scrolling-touch flex-1 overflow-y-auto px-4 pb-4">
              <div className="space-y-4">
                {formFields}
              </div>
            </div>

            {/* Fixed footer */}
            <div className="shrink-0 border-t bg-background px-4 py-3">
              {formButtons}
            </div>
          </form>
        </SheetContent>
      </Sheet>
    )
  }

  // ── Desktop: Dialog com scroll ──
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <div className="space-y-4">
              {formFields}
            </div>
          </div>

          <div className="shrink-0 border-t px-6 py-4">
            {formButtons}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
