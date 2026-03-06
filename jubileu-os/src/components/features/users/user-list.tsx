'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InviteUserDialog } from './invite-user-dialog';
import { EditUserDialog } from './edit-user-dialog';
import { UserPlus, MoreHorizontal, Shield, ShieldAlert, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { formatRelativeTime } from '@/lib/utils';
import type { Profile } from '@/types';

const roleBadge = {
  admin: { label: 'Admin', variant: 'default' as const, icon: ShieldAlert },
  member: { label: 'Membro', variant: 'secondary' as const, icon: Shield },
  client: { label: 'Cliente', variant: 'outline' as const, icon: User },
};

interface UserListProps {
  initialUsers: Profile[];
  currentUserId: string;
}

export function UserList({ initialUsers, currentUserId }: UserListProps) {
  const [users, setUsers] = useState(initialUsers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleToggleActive(user: Profile) {
    if (!user.is_active) {
      await updateUser(user.id, { is_active: true });
      return;
    }
    if (user.id === currentUserId) {
      toast.error('Voce nao pode desativar sua propria conta');
      return;
    }
    setConfirmDeactivate(user);
  }

  async function updateUser(userId: string, data: Partial<Profile>) {
    setLoading(true);
    try {
      const updated = await api.patch<Profile>(`/users/${userId}`, data);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      toast.success('Usuario atualizado');
      setEditUser(null);
      setConfirmDeactivate(null);
    } catch {
      toast.error('Erro ao atualizar usuario');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivateConfirm() {
    if (confirmDeactivate) {
      await updateUser(confirmDeactivate.id, { is_active: false });
    }
  }

  function handleInviteSent() {
    // Refresh users list
    api.get<Profile[]>('/users').then(setUsers).catch(() => {});
    setInviteOpen(false);
    toast.success('Convite enviado');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-sm text-muted-foreground">
            {users.length} usuario{users.length !== 1 && 's'}
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="size-4" />
          Convidar
        </Button>
      </div>

      <div className="rounded-lg border">
        <div className="hidden grid-cols-[1fr_100px_80px_120px_40px] items-center gap-4 border-b px-4 py-2 text-xs font-medium text-muted-foreground md:grid">
          <span>Usuario</span>
          <span>Role</span>
          <span>Status</span>
          <span>Ultimo login</span>
          <span />
        </div>

        {users.map((user) => {
          const role = roleBadge[user.role];
          const RoleIcon = role.icon;
          return (
            <div
              key={user.id}
              className="grid grid-cols-1 items-center gap-2 border-b px-4 py-3 last:border-0 md:grid-cols-[1fr_100px_80px_120px_40px] md:gap-4"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {user.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Badge variant={role.variant} className="w-fit gap-1">
                <RoleIcon className="size-3" />
                {role.label}
              </Badge>

              <Badge
                variant={user.is_active ? 'secondary' : 'outline'}
                className={user.is_active ? 'text-green-500' : 'text-red-500'}
              >
                {user.is_active ? 'Ativo' : 'Inativo'}
              </Badge>

              <span className="text-xs text-muted-foreground">
                {user.last_login_at
                  ? formatRelativeTime(user.last_login_at)
                  : 'Nunca'}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-xs">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditUser(user)}>
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleToggleActive(user)}
                    className={!user.is_active ? 'text-green-500' : 'text-destructive'}
                  >
                    {user.is_active ? 'Desativar' : 'Reativar'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}

        {users.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Nenhum usuario encontrado.
          </div>
        )}
      </div>

      {/* Invite Dialog */}
      <InviteUserDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSuccess={handleInviteSent}
      />

      {/* Edit Dialog */}
      {editUser && (
        <EditUserDialog
          user={editUser}
          open={!!editUser}
          onOpenChange={(open) => !open && setEditUser(null)}
          onSave={(data) => updateUser(editUser.id, data)}
          loading={loading}
        />
      )}

      {/* Deactivate Confirmation */}
      <Dialog
        open={!!confirmDeactivate}
        onOpenChange={(open) => !open && setConfirmDeactivate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desativar usuario</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja desativar{' '}
              <strong>{confirmDeactivate?.full_name}</strong>? O usuario perdera
              acesso ao sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeactivate(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeactivateConfirm}
              disabled={loading}
            >
              Desativar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
