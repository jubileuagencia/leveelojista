'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTask, useTaskComments, useAddComment } from '@/hooks/use-clickup';
import { getStatusColor, getPriorityInfo, formatDueDate } from './task-utils';
import {
  Flag,
  Calendar,
  MessageSquare,
  ExternalLink,
  Send,
  CheckSquare,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TaskDetailPanelProps {
  taskId: string | null;
  onClose: () => void;
}

export function TaskDetailPanel({ taskId, onClose }: TaskDetailPanelProps) {
  const { data: task, isLoading } = useTask(taskId);
  const { data: comments, isLoading: commentsLoading } = useTaskComments(taskId);
  const addComment = useAddComment();
  const [commentText, setCommentText] = useState('');

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!taskId || !commentText.trim()) return;

    try {
      await addComment.mutateAsync({ taskId, text: commentText });
      setCommentText('');
      toast.success('Comentario adicionado');
    } catch {
      toast.error('Erro ao adicionar comentario');
    }
  }

  return (
    <Sheet open={!!taskId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full p-0 sm:max-w-lg"
        showCloseButton
      >
        <SheetTitle className="sr-only">Detalhes da tarefa</SheetTitle>
        {isLoading ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : task ? (
          <ScrollArea className="h-full">
            <div className="space-y-6 p-6">
              {/* Header */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold leading-snug pr-8">
                  {task.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="gap-1.5">
                    <span className={cn('size-2 rounded-full', getStatusColor(task.status.status))} />
                    {task.status.status}
                  </Badge>
                  {task.priority && (
                    <Badge variant="outline" className="gap-1">
                      <Flag className={cn('size-3', getPriorityInfo(task.priority).color)} />
                      {getPriorityInfo(task.priority).label}
                    </Badge>
                  )}
                  {task.due_date && (
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="size-3" />
                      {formatDueDate(task.due_date)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Assignees */}
              {task.assignees.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Responsaveis</p>
                  <div className="flex flex-wrap gap-2">
                    {task.assignees.map((a) => (
                      <div key={a.id} className="flex items-center gap-2 rounded-md bg-muted px-2 py-1">
                        <Avatar className="size-5">
                          <AvatarFallback className="text-[8px]">{a.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{a.username}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map((tag) => (
                      <Badge key={tag.name} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {task.text_content && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Descricao</p>
                  <div className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                    {task.text_content}
                  </div>
                </div>
              )}

              {/* Checklists */}
              {task.checklists.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <CheckSquare className="size-3.5" />
                    Checklists
                  </p>
                  {task.checklists.map((cl) => (
                    <div key={cl.id} className="space-y-1.5">
                      <p className="text-sm font-medium">
                        {cl.name}{' '}
                        <span className="text-xs text-muted-foreground">
                          ({cl.resolved}/{cl.resolved + cl.unresolved})
                        </span>
                      </p>
                      {cl.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 pl-2">
                          <div className={cn(
                            'size-3.5 rounded border',
                            item.resolved ? 'border-green-500 bg-green-500' : 'border-muted-foreground'
                          )} />
                          <span className={cn('text-sm', item.resolved && 'text-muted-foreground line-through')}>
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* ClickUp link */}
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="size-3" />
                Abrir no ClickUp
              </a>

              <Separator />

              {/* Comments */}
              <div className="space-y-4">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare className="size-3.5" />
                  Comentarios
                  {comments && <span>({comments.length})</span>}
                </p>

                {commentsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {comments?.map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <Avatar className="size-6 shrink-0">
                          <AvatarFallback className="text-[8px]">
                            {comment.user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-medium">{comment.user.username}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(parseInt(comment.date, 10)).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{comment.comment_text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add comment */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <Input
                    placeholder="Adicionar comentario..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="text-sm"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!commentText.trim() || addComment.isPending}
                  >
                    {addComment.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </ScrollArea>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
