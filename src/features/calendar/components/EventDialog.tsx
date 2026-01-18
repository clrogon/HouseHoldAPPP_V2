import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, Repeat, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import type { CalendarEvent } from '../types/calendar.types';

interface EventDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

export function EventDialog({ event, open, onOpenChange, onEdit, onDelete }: EventDialogProps) {
  if (!event) return null;

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    const labels: Record<CalendarEvent['type'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      appointment: { label: 'Appointment', variant: 'default' },
      reminder: { label: 'Reminder', variant: 'destructive' },
      task: { label: 'Task', variant: 'secondary' },
      birthday: { label: 'Birthday', variant: 'default' },
      holiday: { label: 'Holiday', variant: 'outline' },
      other: { label: 'Event', variant: 'secondary' },
    };
    return labels[type];
  };

  const typeInfo = getEventTypeLabel(event.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: event.color || '#3b82f6' }}
            />
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
            {event.recurrence && (
              <Badge variant="outline">
                <Repeat className="h-3 w-3 mr-1" />
                Recurring
              </Badge>
            )}
          </div>

          {event.description && (
            <p className="text-muted-foreground">{event.description}</p>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {format(new Date(event.start), 'EEEE, MMMM d, yyyy')}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {event.allDay ? (
                  'All day'
                ) : (
                  <>
                    {format(new Date(event.start), 'h:mm a')} -{' '}
                    {format(new Date(event.end), 'h:mm a')}
                  </>
                )}
              </span>
            </div>

            {event.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            )}

            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-start gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {event.attendees.map((attendee, index) => (
                    <Badge key={index} variant="outline">
                      {attendee}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {event.recurrence && (
              <div className="flex items-center gap-3 text-sm">
                <Repeat className="h-4 w-4 text-muted-foreground" />
                <span>
                  Repeats {event.recurrence.frequency}
                  {event.recurrence.interval > 1 && ` every ${event.recurrence.interval}`}
                  {event.recurrence.endDate && ` until ${format(new Date(event.recurrence.endDate), 'MMM d, yyyy')}`}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2 border-t">
              <User className="h-4 w-4" />
              <span>Created by {event.createdBy}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onDelete && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(event.id);
                onOpenChange(false);
              }}
            >
              Delete
            </Button>
          )}
          {onEdit && (
            <Button onClick={() => onEdit(event)}>
              Edit Event
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
