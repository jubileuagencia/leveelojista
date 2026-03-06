'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { formatDateTime } from '@/lib/utils';
import { Save, Shield, ShieldAlert, User } from 'lucide-react';
import type { Profile } from '@/types';

const roleConfig = {
  admin: { label: 'Admin', variant: 'default' as const, icon: ShieldAlert },
  member: { label: 'Membro', variant: 'secondary' as const, icon: Shield },
  client: { label: 'Cliente', variant: 'outline' as const, icon: User },
};

interface ProfileFormProps {
  user: Profile;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [fullName, setFullName] = useState(user.full_name);
  const [saving, setSaving] = useState(false);

  const role = roleConfig[user.role];
  const RoleIcon = role.icon;

  const initials = user.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const hasChanges = fullName !== user.full_name;

  async function handleSave() {
    if (!fullName.trim()) {
      toast.error('Nome nao pode ser vazio');
      return;
    }
    setSaving(true);
    try {
      await api.patch('/profile', { full_name: fullName.trim() });
      toast.success('Perfil atualizado');
    } catch {
      toast.error('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Profile card */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Informacoes Pessoais</CardTitle>
          <CardDescription>
            Atualize seu nome e informacoes de perfil.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.full_name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="fullName">
              Nome completo
            </label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={user.email} disabled />
            <p className="text-xs text-muted-foreground">
              O email nao pode ser alterado por aqui.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            <Save className="size-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </CardContent>
      </Card>

      {/* Account info sidebar */}
      <Card>
        <CardHeader>
          <CardTitle>Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Role</p>
            <Badge variant={role.variant} className="gap-1">
              <RoleIcon className="size-3" />
              {role.label}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge
              variant="secondary"
              className={user.is_active ? 'text-green-500' : 'text-red-500'}
            >
              {user.is_active ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Membro desde</p>
            <p className="text-sm">{formatDateTime(user.created_at)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Ultimo login</p>
            <p className="text-sm">
              {user.last_login_at
                ? formatDateTime(user.last_login_at)
                : 'Nunca'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
