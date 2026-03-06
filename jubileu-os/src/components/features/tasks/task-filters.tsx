'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (statuses: string[]) => void;
  availableStatuses: string[];
}

export function TaskFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  availableStatuses,
}: TaskFiltersProps) {
  function toggleStatus(status: string) {
    if (statusFilter.includes(status)) {
      onStatusFilterChange(statusFilter.filter((s) => s !== status));
    } else {
      onStatusFilterChange([...statusFilter, status]);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon-xs"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => onSearchChange('')}
          >
            <X className="size-3" />
          </Button>
        )}
      </div>

      {availableStatuses.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {availableStatuses.map((status) => (
            <Badge
              key={status}
              variant={statusFilter.includes(status) ? 'default' : 'outline'}
              className="cursor-pointer select-none"
              onClick={() => toggleStatus(status)}
            >
              {status}
            </Badge>
          ))}
          {statusFilter.length > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onStatusFilterChange([])}
            >
              Limpar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
