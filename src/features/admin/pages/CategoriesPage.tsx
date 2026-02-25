import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CategoriesTable } from '../components/CategoriesTable'
import { CategoryFormModal } from '../components/CategoryFormModal'
import {
  useAdminCategories,
  useDeleteCategory,
  useReorderCategories,
} from '../hooks/useCategories'
import type { Category } from '@/types/database'

export default function CategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories()
  const deleteMutation = useDeleteCategory()
  const reorderMutation = useReorderCategories()

  const [formOpen, setFormOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const handleCreate = () => {
    setEditCategory(null)
    setFormOpen(true)
  }

  const handleEdit = (cat: Category) => {
    setEditCategory(cat)
    setFormOpen(true)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  const handleMoveUp = useCallback(
    (index: number) => {
      if (!categories || index === 0) return
      const ids = categories.map((c) => c.id)
      ;[ids[index - 1], ids[index]] = [ids[index], ids[index - 1]]
      reorderMutation.mutate(ids)
    },
    [categories, reorderMutation]
  )

  const handleMoveDown = useCallback(
    (index: number) => {
      if (!categories || index >= categories.length - 1) return
      const ids = categories.map((c) => c.id)
      ;[ids[index], ids[index + 1]] = [ids[index + 1], ids[index]]
      reorderMutation.mutate(ids)
    },
    [categories, reorderMutation]
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold lg:text-xl">Categorias</h2>
          <p className="text-sm text-muted-foreground">
            {categories?.length ?? 0} categoria{(categories?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-1 size-4" />
          Nova
        </Button>
      </div>

      {/* Table */}
      <CategoriesTable
        categories={categories ?? []}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
      />

      {/* Form modal */}
      <CategoryFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editCategory}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              A categoria &quot;{deleteTarget?.name}&quot; será excluída permanentemente.
              Produtos nesta categoria ficarão sem categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
