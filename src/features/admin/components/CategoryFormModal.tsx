import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useCreateCategory, useUpdateCategory } from '../hooks/useCategories'
import type { Category } from '@/types/database'

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  icon: z.string().optional(),
  color: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface CategoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryFormModal({ open, onOpenChange, category }: CategoryFormModalProps) {
  const isEditing = !!category
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', icon: '', color: '' },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? '',
        icon: category?.icon ?? '',
        color: category?.color ?? '',
      })
    }
  }, [open, category, reset])

  const onSubmit = (values: FormValues) => {
    const data = {
      name: values.name,
      icon: values.icon || undefined,
      color: values.color || undefined,
    }

    if (isEditing) {
      updateMutation.mutate(
        { id: category.id, data },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createMutation.mutate(data, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Altere os dados da categoria.' : 'Preencha os dados da nova categoria.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Nome *</Label>
            <Input
              id="cat-name"
              placeholder="Ex: Bebidas"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cat-icon">Ícone / Emoji</Label>
              <Input
                id="cat-icon"
                placeholder="🍺"
                {...register('icon')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-color">Cor</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cat-color"
                  type="color"
                  className="h-9 w-12 p-1 cursor-pointer"
                  {...register('color')}
                />
                <Input
                  placeholder="#3B82F6"
                  className="flex-1"
                  {...register('color')}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <><Loader2 className="mr-1 size-4 animate-spin" /> Salvando...</>
              ) : isEditing ? (
                'Salvar'
              ) : (
                'Criar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
