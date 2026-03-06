'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { MoreHorizontal, Pencil, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateProduct, useDeleteProduct } from '@/hooks/use-products';
import { PRODUCT_UNIT_LABELS } from '@/types';
import type { Product } from '@/types';

interface ProductsTableProps {
  products: Product[];
  loading?: boolean;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onEdit: (product: Product) => void;
}

function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDisplayId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

export function ProductsTable({
  products,
  loading,
  selectedIds,
  onSelectionChange,
  onEdit,
}: ProductsTableProps) {
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id));

  function toggleAll() {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(products.map((p) => p.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  }

  async function handleToggleActive(product: Product) {
    try {
      await updateProduct.mutateAsync({
        productId: product.id,
        body: { is_active: !product.is_active },
      });
      toast.success(product.is_active ? 'Produto desativado' : 'Produto ativado');
    } catch {
      toast.error('Erro ao atualizar status');
    }
  }

  async function handleDelete(product: Product) {
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success('Produto excluido');
      setDeleteConfirm(null);
      // Remove from selection
      const next = new Set(selectedIds);
      next.delete(product.id);
      onSelectionChange(next);
    } catch {
      toast.error('Erro ao excluir produto');
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="mb-3 size-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">Nenhum produto encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead className="w-16">#</TableHead>
              <TableHead className="w-14">Img</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="w-28">Preco</TableHead>
              <TableHead className="w-24">Unidade</TableHead>
              <TableHead className="w-32">Categoria</TableHead>
              <TableHead className="w-20">Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} data-state={selectedIds.has(product.id) ? 'selected' : undefined}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(product.id)}
                    onCheckedChange={() => toggleOne(product.id)}
                    aria-label={`Selecionar ${product.name}`}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {formatDisplayId(product.display_id)}
                </TableCell>
                <TableCell>
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={36}
                      height={36}
                      className="size-9 rounded border object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex size-9 items-center justify-center rounded border bg-muted">
                      <Package className="size-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {PRODUCT_UNIT_LABELS[product.unit]}
                </TableCell>
                <TableCell>
                  {product.categories ? (
                    <Badge variant="outline">{product.categories.name}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={product.is_active}
                    onCheckedChange={() => handleToggleActive(product)}
                    aria-label={product.is_active ? 'Desativar' : 'Ativar'}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Pencil className="mr-2 size-3.5" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteConfirm(product)}
                      >
                        <Trash2 className="mr-2 size-3.5" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir produto?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            O produto <strong>{deleteConfirm?.name}</strong> sera desativado e removido da listagem.
            Esta acao pode ser revertida.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleteProduct.isPending}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
