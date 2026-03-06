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
import { Separator } from '@/components/ui/separator';
import { useUpdateClient } from '@/hooks/use-clients';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { Client, ContactInfo } from '@/types';

interface EditClientDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditClientDialog({ client, open, onOpenChange }: EditClientDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        {client && (
          <EditClientForm
            key={client.id}
            client={client}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditClientForm({ client, onClose }: { client: Client; onClose: () => void }) {
  const [name, setName] = useState(client.name);
  const [clickupTag, setClickupTag] = useState(client.clickup_tag ?? '');
  const [notionPageId, setNotionPageId] = useState(client.notion_root_page_id ?? '');
  const [contacts, setContacts] = useState<ContactInfo[]>(client.contacts ?? []);
  const [links, setLinks] = useState<Record<string, string>>(client.links ?? {});
  const [newLinkKey, setNewLinkKey] = useState('');
  const [newLinkValue, setNewLinkValue] = useState('');
  const updateClient = useUpdateClient();

  function addContact() {
    setContacts([...contacts, { name: '', role: '', email: '', phone: '' }]);
  }

  function updateContact(index: number, field: keyof ContactInfo, value: string) {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  }

  function removeContact(index: number) {
    setContacts(contacts.filter((_, i) => i !== index));
  }

  function addLink() {
    if (!newLinkKey.trim() || !newLinkValue.trim()) return;
    setLinks({ ...links, [newLinkKey.trim()]: newLinkValue.trim() });
    setNewLinkKey('');
    setNewLinkValue('');
  }

  function removeLink(key: string) {
    const updated = { ...links };
    delete updated[key];
    setLinks(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await updateClient.mutateAsync({
        clientId: client.id,
        body: {
          name: name.trim(),
          clickup_tag: clickupTag.trim() || null,
          notion_root_page_id: notionPageId.trim() || null,
          contacts: contacts.filter((c) => c.name.trim()),
          links,
        },
      });
      toast.success('Cliente atualizado');
      onClose();
    } catch {
      toast.error('Erro ao atualizar cliente');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="edit-name" className="text-sm font-medium">Nome *</label>
        <Input
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="edit-tag" className="text-sm font-medium">Tag ClickUp</label>
        <Input
          id="edit-tag"
          placeholder="ex: pelicula-sideral"
          value={clickupTag}
          onChange={(e) => setClickupTag(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="edit-notion" className="text-sm font-medium">Notion Page ID</label>
        <Input
          id="edit-notion"
          placeholder="ID da pagina raiz no Notion"
          value={notionPageId}
          onChange={(e) => setNotionPageId(e.target.value)}
        />
      </div>

      <Separator />

      {/* Contacts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Contatos</label>
          <Button type="button" variant="outline" size="sm" onClick={addContact}>
            <Plus className="mr-1 size-3" />
            Adicionar
          </Button>
        </div>
        {contacts.map((contact, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 rounded-md border p-2">
            <Input
              placeholder="Nome"
              value={contact.name}
              onChange={(e) => updateContact(i, 'name', e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Cargo"
              value={contact.role}
              onChange={(e) => updateContact(i, 'role', e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Email"
              value={contact.email ?? ''}
              onChange={(e) => updateContact(i, 'email', e.target.value)}
              className="text-sm"
            />
            <div className="flex gap-1">
              <Input
                placeholder="Telefone"
                value={contact.phone ?? ''}
                onChange={(e) => updateContact(i, 'phone', e.target.value)}
                className="text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-destructive"
                onClick={() => removeContact(i)}
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Links */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Links</label>
        {Object.entries(links).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2 text-sm">
            <span className="w-20 truncate font-medium">{key}</span>
            <span className="min-w-0 flex-1 truncate text-muted-foreground">{value}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6 shrink-0 text-destructive"
              onClick={() => removeLink(key)}
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Label (ex: instagram)"
            value={newLinkKey}
            onChange={(e) => setNewLinkKey(e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="URL"
            value={newLinkValue}
            onChange={(e) => setNewLinkValue(e.target.value)}
            className="text-sm"
          />
          <Button type="button" variant="outline" size="sm" onClick={addLink}>
            <Plus className="size-3" />
          </Button>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!name.trim() || updateClient.isPending}>
          {updateClient.isPending && <Loader2 className="animate-spin" />}
          Salvar
        </Button>
      </DialogFooter>
    </form>
  );
}
