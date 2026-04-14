import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, ChevronsUpDown, Plus, Star, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
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
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ImageUpload } from './ImageUpload'
import {
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useUploadProductImage,
  useSaveVariants,
} from '../hooks/useProducts'
import { useIsMobile } from '@/hooks/use-mobile'
import { UNIT_LABELS } from '@/lib/unit-labels'
import type { Product, ProductUnit } from '@/types/database'

const UNITS: { value: ProductUnit; label: string }[] = [
  { value: 'un', label: 'Unidade' },
  { value: 'kg', label: 'Quilograma' },
  { value: 'cx', label: 'Caixa' },
  { value: 'maco', label: 'Maco' },
  { value: 'dz', label: 'Duzia' },
  { value: 'bj', label: 'Bandeja' },
  { value: 'pc', label: 'Pacote' },
]

const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  price: z.number().positive('Preco deve ser maior que zero'),
  unit: z.enum(['un', 'kg', 'cx', 'maco', 'dz', 'bj', 'pc'] as const),
  categoryIds: z.array(z.string()),
  primaryCategoryId: z.string().optional(),
  image_url: z.string().nullable().optional(),
  is_active: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

interface VariantRow {
  id?: string
  unit_type: string
  unit_label: string
  unit_price: number
  weight_grams: number | null
  allows_fractional: boolean
  is_default: boolean
}

function createEmptyVariant(isDefault = false): VariantRow {
  return {
    unit_type: 'un',
    unit_label: '',
    unit_price: 0,
    weight_grams: null,
    allows_fractional: false,
    is_default: isDefault,
  }
}

function variantsFromProduct(product: Product): VariantRow[] {
  const variants = product.variants
  if (!variants || variants.length === 0) {
    return [createEmptyVariant(true)]
  }
  return variants
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({
      id: v.id,
      unit_type: v.unit_type,
      unit_label: v.unit_label ?? '',
      unit_price: v.unit_price,
      weight_grams: v.weight_grams,
      allows_fractional: v.allows_fractional,
      is_default: v.is_default,
    }))
}

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
  const variantsMutation = useSaveVariants()

  const [variants, setVariants] = useState<VariantRow[]>([createEmptyVariant(true)])

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
      categoryIds: [],
      primaryCategoryId: undefined,
      image_url: null,
      is_active: true,
    },
  })

  const imageUrl = watch('image_url')
  const unit = watch('unit')
  const categoryIds = watch('categoryIds')
  const primaryCategoryId = watch('primaryCategoryId')
  const isActive = watch('is_active')
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  useEffect(() => {
    if (open) {
      if (product) {
        const productCategoryIds = product.categories?.map((c) => c.id) ?? []
        reset({
          name: product.name,
          description: product.description ?? '',
          price: product.price,
          unit: product.unit,
          categoryIds: productCategoryIds,
          primaryCategoryId: product.primaryCategory?.id,
          image_url: product.image_url ?? null,
          is_active: product.is_active,
        })
        setVariants(variantsFromProduct(product))
      } else {
        reset({
          name: '',
          description: '',
          price: 0,
          unit: 'un',
          categoryIds: [],
          primaryCategoryId: undefined,
          image_url: null,
          is_active: true,
        })
        setVariants([createEmptyVariant(true)])
      }
    }
  }, [open, product, reset])

  // ── Category helpers ──
  const toggleCategory = (id: string) => {
    const next = categoryIds.includes(id)
      ? categoryIds.filter((c) => c !== id)
      : [...categoryIds, id]
    setValue('categoryIds', next, { shouldDirty: true })
    // Se a primária foi removida, re-elege a primeira remanescente
    if (!next.includes(primaryCategoryId ?? '')) {
      setValue('primaryCategoryId', next[0], { shouldDirty: true })
    }
  }

  const markPrimary = (id: string) => {
    setValue('primaryCategoryId', id, { shouldDirty: true })
  }

  // ── Variant helpers ──
  const addVariant = () => {
    setVariants((prev) => [...prev, createEmptyVariant(false)])
  }

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return
    setVariants((prev) => {
      const next = prev.filter((_, i) => i !== index)
      // Ensure at least one is default
      if (!next.some((v) => v.is_default) && next.length > 0) {
        next[0].is_default = true
      }
      return next
    })
  }

  const updateVariant = (index: number, field: keyof VariantRow, value: unknown) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== index) {
          // If setting default, unset others
          if (field === 'is_default' && value === true) {
            return { ...v, is_default: false }
          }
          return v
        }
        return { ...v, [field]: value }
      })
    )
  }

  const onSubmit = async (data: ProductFormData) => {
    // Validate variants
    const invalidVariant = variants.find((v) => v.unit_price <= 0)
    if (invalidVariant) {
      toast.error('Todas as variantes devem ter preco maior que zero')
      return
    }

    const { categoryIds: selectedIds, primaryCategoryId: primaryId, ...rest } = data
    const input = {
      ...rest,
      categoryIds: selectedIds,
      primaryCategoryId: primaryId,
      image_url: data.image_url || undefined,
    }

    let productId: string

    if (isEditing) {
      const result = await updateMutation.mutateAsync({ id: product.id, input })
      productId = result.id
    } else {
      const result = await createMutation.mutateAsync(input)
      productId = result.id
    }

    // Save variants
    await variantsMutation.mutateAsync({
      productId,
      variants: variants.map((v, i) => ({
        id: v.id,
        unit_type: v.unit_type,
        unit_label: v.unit_label || null,
        unit_price: v.unit_price,
        weight_grams: v.weight_grams,
        allows_fractional: v.allows_fractional,
        is_default: v.is_default,
        sort_order: i,
      })),
    })

    onOpenChange(false)
  }

  const isPending =
    createMutation.isPending || updateMutation.isPending || variantsMutation.isPending

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
          <Label htmlFor="price">Preco base *</Label>
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
          <Label>Unidade principal *</Label>
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

      {/* Categories (multi-select + primary) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Categorias</Label>
          {categoryIds.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {categoryIds.length} selecionada{categoryIds.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <Popover open={categoriesOpen} onOpenChange={setCategoriesOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={categoriesOpen}
              className="w-full justify-between font-normal"
            >
              {categoryIds.length === 0
                ? 'Selecione uma ou mais categorias'
                : `${categoryIds.length} selecionada${categoryIds.length > 1 ? 's' : ''}`}
              <ChevronsUpDown className="size-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar categoria..." />
              <CommandList>
                <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                <CommandGroup>
                  {categories?.map((cat) => {
                    const isSelected = categoryIds.includes(cat.id)
                    return (
                      <CommandItem
                        key={cat.id}
                        value={cat.name}
                        onSelect={() => toggleCategory(cat.id)}
                      >
                        <Check
                          className={cn(
                            'mr-2 size-4',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {cat.name}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected categories with primary indicator */}
        {categoryIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {categoryIds.map((id) => {
              const cat = categories?.find((c) => c.id === id)
              if (!cat) return null
              const isPrimary = primaryCategoryId === id
              return (
                <Badge
                  key={id}
                  variant={isPrimary ? 'default' : 'secondary'}
                  className="gap-1 pr-1"
                >
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => markPrimary(id)}
                      className="inline-flex size-3.5 items-center justify-center rounded-sm opacity-60 hover:opacity-100"
                      title="Marcar como categoria principal"
                      aria-label={`Marcar ${cat.name} como principal`}
                    >
                      <Star className="size-3" />
                    </button>
                  )}
                  {isPrimary && <Star className="size-3 fill-current" />}
                  <span>{cat.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleCategory(id)}
                    className="inline-flex size-3.5 items-center justify-center rounded-sm hover:bg-background/20"
                    aria-label={`Remover ${cat.name}`}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        )}

        {categoryIds.length > 1 && (
          <p className="text-[11px] text-muted-foreground">
            ★ indica a categoria principal. Clique na estrela de outra para trocar.
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descricao</Label>
        <Textarea
          id="description"
          placeholder="Descricao do produto (opcional)"
          rows={3}
          {...register('description')}
        />
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label className="text-sm font-medium">Produto ativo</Label>
          <p className="text-xs text-muted-foreground">
            Produtos inativos nao aparecem no catalogo
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={(v) => setValue('is_active', v)}
        />
      </div>

      <Separator />

      {/* ── Variantes de Venda ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-semibold">Variantes de Venda</Label>
            <p className="text-xs text-muted-foreground">
              Defina as opcoes de compra (ex: unidade, kg, caixa)
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
            onClick={addVariant}
          >
            <Plus className="size-3.5" />
            Adicionar
          </Button>
        </div>

        {variants.map((variant, index) => (
          <div
            key={index}
            className="rounded-lg border bg-muted/30 p-3 space-y-3"
          >
            {/* Row 1: Unit type + Label + Remove */}
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Tipo de unidade</Label>
                <Select
                  value={variant.unit_type}
                  onValueChange={(v) => updateVariant(index, 'unit_type', v)}
                >
                  <SelectTrigger className="h-9">
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
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Rotulo (opcional)</Label>
                <Input
                  className="h-9"
                  placeholder={UNIT_LABELS[variant.unit_type] ?? ''}
                  value={variant.unit_label}
                  onChange={(e) => updateVariant(index, 'unit_label', e.target.value)}
                />
              </div>
              {variants.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-5 size-9 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeVariant(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>

            {/* Row 2: Price + Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Preco (R$) *</Label>
                <Input
                  className="h-9"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={variant.unit_price || ''}
                  onChange={(e) =>
                    updateVariant(index, 'unit_price', parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Peso (g)</Label>
                <Input
                  className="h-9"
                  type="number"
                  min="0"
                  placeholder="Opcional"
                  value={variant.weight_grams ?? ''}
                  onChange={(e) =>
                    updateVariant(
                      index,
                      'weight_grams',
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                />
              </div>
            </div>

            {/* Row 3: Switches */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <Switch
                  checked={variant.allows_fractional}
                  onCheckedChange={(v) => updateVariant(index, 'allows_fractional', v)}
                  className="scale-75"
                />
                Permite fracionado
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <Switch
                  checked={variant.is_default}
                  onCheckedChange={(v) => {
                    if (v) updateVariant(index, 'is_default', true)
                  }}
                  className="scale-75"
                />
                Padrao
              </label>
            </div>
          </div>
        ))}
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

          {/* Scrollable form — usa overflow nativo, nao ScrollArea */}
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
