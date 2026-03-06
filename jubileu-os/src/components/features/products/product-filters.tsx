'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { Category } from '@/types';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: 'active' | 'inactive' | 'all';
  onStatusChange: (value: 'active' | 'inactive' | 'all') => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];
}

export function ProductFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  categoryId,
  onCategoryChange,
  categories,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou #ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select value={status} onValueChange={(v) => onStatusChange(v as 'active' | 'inactive' | 'all')}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Ativos</SelectItem>
          <SelectItem value="inactive">Inativos</SelectItem>
          <SelectItem value="all">Todos</SelectItem>
        </SelectContent>
      </Select>

      <Select value={categoryId || '_all'} onValueChange={(v) => onCategoryChange(v === '_all' ? '' : v)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">Todas categorias</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
