import { useMemo } from 'react';
import { format, isSameDay, addHours, startOfDay } from 'date-fns';
import type { CalendarEvent } from '../types/calendar.types';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function DayView({ currentDate, events, onEventClick }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayEvents = useMemo(() => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return isSameDay(eventStart, currentDate) && !event.allDay;
    });
  }, [events, currentDate]);

  const allDayEvents = useMemo(() => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return isSameDay(eventStart, currentDate) && event.allDay;
    });
  }, [events, currentDate]);

  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const top = startHour * 60;
    const height = Math.max((endHour - startHour) * 60, 30);
    return { top, height };
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* All-day events section */}
      {allDayEvents.length > 0 && (
        <div className="border-b p-2">
          <div className="text-sm text-muted-foreground mb-2">All-day events</div>
          <div className="space-y-1">
            {allDayEvents.map(event => (
              <div
                key={event.id}
                className="p-2 rounded cursor-pointer hover:opacity-80"
                style={{ backgroundColor: event.color || '#3b82f6', color: 'white' }}
                onClick={() => onEventClick(event)}
              >
                <div className="font-medium">{event.title}</div>
                {event.description && (
                  <div className="text-sm text-white/80">{event.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex">
          {/* Time column */}
          <div className="w-20 flex-shrink-0">
            {hours.map(hour => (
              <div key={hour} className="h-[60px] border-b relative">
                <span className="absolute -top-2 right-2 text-sm text-muted-foreground">
                  {format(addHours(startOfDay(new Date()), hour), 'h a')}
                </span>
              </div>
            ))}
          </div>

          {/* Events column */}
          <div className="flex-1 border-l relative">
            {hours.map(hour => (
              <div key={hour} className="h-[60px] border-b" />
            ))}
            {/* Events */}
            {dayEvents.map(event => {
              const { top, height } = getEventPosition(event);
              return (
                <div
                  key={event.id}
                  className="absolute left-2 right-2 p-2 rounded overflow-hidden cursor-pointer hover:opacity-80"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    backgroundColor: event.color || '#3b82f6',
                    color: 'white',
                  }}
                  onClick={() => onEventClick(event)}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-white/80">
                    {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                  </div>
                  {event.location && (
                    <div className="text-sm text-white/80">{event.location}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
