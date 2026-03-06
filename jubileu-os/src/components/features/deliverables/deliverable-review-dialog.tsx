'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useUpdateDeliverable } from '@/hooks/use-deliverables';
import {
  DELIVERABLE_STATUS_LABELS,
  DELIVERABLE_TYPE_LABELS,
} from '@/types';
import type { Deliverable } from '@/types';
import {
  CheckCircle2,
  AlertTriangle,
  Send,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface DeliverableReviewDialogProps {
  deliverable: Deliverable | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isClient?: boolean;
}

export function DeliverableReviewDialog({
  deliverable,
  open,
  onOpenChange,
  isClient = false,
}: DeliverableReviewDialogProps) {
  const [reviewNote, setReviewNote] = useState('');
  const updateMutation = useUpdateDeliverable();

  if (!deliverable) return null;

  function handleApprove() {
    if (!deliverable) return;
    updateMutation.mutate(
      { id: deliverable.id, status: 'approved', review_note: reviewNote || 'Aprovado' },
      {
        onSuccess: () => {
          toast.success('Entrega aprovada!');
          onOpenChange(false);
          setReviewNote('');
        },
      }
    );
  }

  function handleRequestRevision() {
    if (!deliverable) return;
    if (!reviewNote.trim()) {
      toast.error('Descreva o que precisa ser alterado');
      return;
    }
    updateMutation.mutate(
      { id: deliverable.id, status: 'revision_requested', review_note: reviewNote },
      {
        onSuccess: () => {
          toast.success('Revisao solicitada');
          onOpenChange(false);
          setReviewNote('');
        },
      }
    );
  }

  function handleSubmitForReview() {
    if (!deliverable) return;
    updateMutation.mutate(
      { id: deliverable.id, status: 'pending_review' },
      {
        onSuccess: () => {
          toast.success('Entrega enviada para aprovacao');
          onOpenChange(false);
        },
      }
    );
  }

  const canReview = isClient && deliverable.status === 'pending_review';
  const canSubmit = !isClient && (deliverable.status === 'draft' || deliverable.status === 'revision_requested');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{deliverable.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {deliverable.description && (
            <p className="text-sm text-muted-foreground">{deliverable.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{DELIVERABLE_TYPE_LABELS[deliverable.type]}</Badge>
            <Badge variant="secondary">{DELIVERABLE_STATUS_LABELS[deliverable.status]}</Badge>
            {deliverable.clients && (
              <Badge variant="outline">{deliverable.clients.name}</Badge>
            )}
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            {deliverable.profiles && <p>Criado por: {deliverable.profiles.full_name}</p>}
            {deliverable.due_date && (
              <p className="flex items-center gap-1">
                <Clock className="size-3" />
                Prazo: {new Date(deliverable.due_date).toLocaleDateString('pt-BR')}
              </p>
            )}
            {deliverable.submitted_at && (
              <p>Enviado em: {new Date(deliverable.submitted_at).toLocaleDateString('pt-BR')}</p>
            )}
            {deliverable.reviewed_at && (
              <p>Revisado em: {new Date(deliverable.reviewed_at).toLocaleDateString('pt-BR')}</p>
            )}
          </div>

          {deliverable.file_url && (
            <a
              href={deliverable.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ExternalLink className="size-3" />
              Ver arquivo
            </a>
          )}

          {deliverable.review_note && (
            <div className="rounded-md border p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Nota de revisao:</p>
              <p className="text-sm">{deliverable.review_note}</p>
            </div>
          )}

          {(canReview || canSubmit) && (
            <div className="space-y-2">
              <Label htmlFor="review-note">
                {canReview ? 'Comentario (opcional para aprovar, obrigatorio para revisao)' : 'Nota'}
              </Label>
              <Input
                id="review-note"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder={canReview ? 'Descreva alteracoes necessarias...' : 'Nota opcional...'}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {canReview && (
            <>
              <Button
                variant="outline"
                onClick={handleRequestRevision}
                disabled={updateMutation.isPending}
              >
                <AlertTriangle className="size-4" />
                Solicitar Revisao
              </Button>
              <Button onClick={handleApprove} disabled={updateMutation.isPending}>
                <CheckCircle2 className="size-4" />
                Aprovar
              </Button>
            </>
          )}
          {canSubmit && (
            <Button onClick={handleSubmitForReview} disabled={updateMutation.isPending}>
              <Send className="size-4" />
              Enviar para Aprovacao
            </Button>
          )}
          {!canReview && !canSubmit && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
