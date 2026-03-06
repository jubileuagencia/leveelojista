'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from './image-upload';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateProduct, useUpdateProduct } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { PRODUCT_UNIT_LABELS } from '@/types';
import type { Product, ProductUnit } from '@/types';

interface ProductFormModalProps {
  product?: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductFormModal({ product, open, onOpenChange }: ProductFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
        </DialogHeader>
        {/* key forces React to remount the form when switching products */}
        <ProductForm
          key={product?.id ?? 'new'}
          product={product}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function ProductForm({
  product,
  onClose,
}: {
  product?: Product | null;
  onClose: () => void;
}) {
  const isEdit = !!product;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: categories } = useCategories();

  // Initial values from product (edit) or empty (create)
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [unit, setUnit] = useState<ProductUnit>(product?.unit ?? 'un');
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '');
  const [imageUrl, setImageUrl] = useState<string | null>(product?.image_url ?? null);

  const loading = createProduct.isPending || updateProduct.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error('Nome obrigatorio (min 2 caracteres)');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error('Preco invalido');
      return;
    }

    try {
      if (isEdit && product) {
        await updateProduct.mutateAsync({
          productId: product.id,
          body: {
            name: name.trim(),
            description: description.trim() || null,
            price: parsedPrice,
            unit,
            category_id: categoryId || null,
            image_url: imageUrl,
          },
        });
        toast.success('Produto atualizado');
      } else {
        await createProduct.mutateAsync({
          name: name.trim(),
          description: description.trim() || null,
          price: parsedPrice,
          unit,
          category_id: categoryId || null,
          image_url: imageUrl,
          is_active: true,
        });
        toast.success('Produto criado');
      }
      onClose();
    } catch {
      toast.error(isEdit ? 'Erro ao atualizar produto' : 'Erro ao criar produto');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do produto"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Preco (R$) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label>Unidade *</Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as ProductUnit)} disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(PRODUCT_UNIT_LABELS) as [ProductUnit, string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select
          value={categoryId || '_none'}
          onValueChange={(v) => setCategoryId(v === '_none' ? '' : v)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_none">Sem categoria</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descricao</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descricao do produto (opcional)"
          rows={3}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>Imagem</Label>
        <ImageUpload value={imageUrl} onChange={setImageUrl} disabled={loading} />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isEdit ? 'Salvar' : 'Criar Produto'}
        </Button>
      </DialogFooter>
    </form>
  );
}
