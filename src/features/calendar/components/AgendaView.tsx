import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  format,
  isToday,
  isTomorrow,
} from 'date-fns';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import type { CalendarEvent } from '../types/calendar.types';

interface AgendaViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function AgendaView({ currentDate, events, onEventClick }: AgendaViewProps) {
  const groupedEvents = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    const filteredEvents = events
      .filter(event => {
        const eventStart = new Date(event.start);
        return eventStart >= monthStart && eventStart <= monthEnd;
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const groups: { [key: string]: CalendarEvent[] } = {};
    filteredEvents.forEach(event => {
      const dateKey = format(new Date(event.start), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    return groups;
  }, [events, currentDate]);

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM d');
  };

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    const labels: Record<CalendarEvent['type'], string> = {
      appointment: 'Appointment',
      reminder: 'Reminder',
      task: 'Task',
      birthday: 'Birthday',
      holiday: 'Holiday',
      other: 'Event',
    };
    return labels[type];
  };

  const sortedDates = Object.keys(groupedEvents).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
        <Calendar className="h-12 w-12 mb-4" />
        <p className="text-lg">No events this month</p>
        <p className="text-sm">Events you create will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map(dateStr => {
        const dayEvents = groupedEvents[dateStr];
        const date = new Date(dateStr);

        return (
          <div key={dateStr}>
            <div
              className={cn(
                'sticky top-0 bg-background py-2 border-b mb-3',
                isToday(date) && 'text-primary font-semibold'
              )}
            >
              <h3 className="text-lg">{getDateLabel(dateStr)}</h3>
              <p className="text-sm text-muted-foreground">
                {format(date, 'MMMM d, yyyy')}
              </p>
            </div>

            <div className="space-y-3">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-1 h-full min-h-[60px] rounded-full"
                      style={{ backgroundColor: event.color || '#3b82f6' }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>

                      {event.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {event.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.allDay ? (
                            'All day'
                          ) : (
                            <>
                              {format(new Date(event.start), 'h:mm a')} -{' '}
                              {format(new Date(event.end), 'h:mm a')}
                            </>
                          )}
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        )}

                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.attendees.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
