'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useCalendarEvents, useCreateCalendarEvent, useDeleteCalendarEvent } from '@/hooks/use-calendar';
import type { CalendarEvent } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Trash2,
} from 'lucide-react';

const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month fill
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: new Date(year, month, d), isCurrentMonth: true });
  }
  // Next month fill
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
  }

  return days;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newAllDay, setNewAllDay] = useState(true);

  const from = new Date(year, month, 1).toISOString();
  const to = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
  const { data: events = [] } = useCalendarEvents({ from, to });
  const createEvent = useCreateCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();

  const days = useMemo(() => getMonthDays(year, month), [year, month]);

  function goToPrevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  }

  function goToNextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  }

  function goToToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }

  function getEventsForDay(date: Date): CalendarEvent[] {
    return events.filter((e) => isSameDay(new Date(e.start_date), date));
  }

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const startDate = newAllDay
      ? new Date(newDate + 'T00:00:00').toISOString()
      : new Date(newDate + 'T' + (newTime || '09:00')).toISOString();

    createEvent.mutate(
      { title: newTitle.trim(), start_date: startDate, all_day: newAllDay },
      {
        onSuccess: () => {
          setCreateOpen(false);
          setNewTitle('');
          setNewDate('');
          setNewTime('');
          setNewAllDay(true);
        },
      }
    );
  }

  function openCreate(date?: Date) {
    if (date) {
      setNewDate(date.toISOString().split('T')[0]);
    }
    setCreateOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">
            {MONTHS_PT[month]} {year}
          </h1>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={goToPrevMonth}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
        <Button onClick={() => openCreate()}>
          <Plus className="size-4" />
          Novo Evento
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg border">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b">
          {DAYS_PT.map((day) => (
            <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dayEvents = getEventsForDay(day.date);
            const isToday = isSameDay(day.date, today);
            const isSelected = selectedDate ? isSameDay(day.date, selectedDate) : false;

            return (
              <div
                key={idx}
                className={`min-h-[80px] border-b border-r p-1 cursor-pointer transition-colors hover:bg-accent/50 ${
                  !day.isCurrentMonth ? 'bg-muted/30' : ''
                } ${isSelected ? 'bg-accent' : ''}`}
                onClick={() => setSelectedDate(day.date)}
                onDoubleClick={() => openCreate(day.date)}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-full text-xs ${
                      isToday
                        ? 'bg-primary text-primary-foreground font-bold'
                        : !day.isCurrentMonth
                        ? 'text-muted-foreground/50'
                        : ''
                    }`}
                  >
                    {day.date.getDate()}
                  </span>
                </div>
                <div className="mt-0.5 space-y-0.5">
                  {dayEvents.slice(0, 3).map((evt) => (
                    <div
                      key={evt.id}
                      className="truncate rounded px-1 text-[10px] leading-4"
                      style={{
                        backgroundColor: (evt.color || '#3b82f6') + '20',
                        color: evt.color || '#3b82f6',
                      }}
                    >
                      {evt.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-muted-foreground px-1">
                      +{dayEvents.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Events */}
      {selectedDate && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">
              {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
            {selectedEvents.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                <CalendarIcon className="size-4" />
                Nenhum evento neste dia.
                <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => openCreate(selectedDate)}>
                  Criar evento
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full shrink-0"
                        style={{ backgroundColor: evt.color || '#3b82f6' }}
                      />
                      <div>
                        <p className="text-sm font-medium">{evt.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {evt.all_day ? 'Dia inteiro' : formatTime(evt.start_date)}
                          {evt.source !== 'manual' && ` · ${evt.source}`}
                        </p>
                      </div>
                    </div>
                    {evt.source === 'manual' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => deleteEvent.mutate(evt.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Event Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Evento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evt-title">Titulo</Label>
              <Input
                id="evt-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Reuniao com cliente"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="evt-date">Data</Label>
                <Input
                  id="evt-date"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>
              {!newAllDay && (
                <div className="space-y-2">
                  <Label htmlFor="evt-time">Horario</Label>
                  <Input
                    id="evt-time"
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="all-day"
                checked={newAllDay}
                onChange={(e) => setNewAllDay(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="all-day" className="text-sm font-normal">
                Dia inteiro
              </Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!newTitle.trim() || !newDate || createEvent.isPending}>
                {createEvent.isPending ? 'Criando...' : 'Criar Evento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
