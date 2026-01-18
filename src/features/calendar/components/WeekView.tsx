import { useMemo } from 'react';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addHours,
  startOfDay,
} from 'date-fns';
import { cn } from '@/shared/lib/utils';
import type { CalendarEvent } from '../types/calendar.types';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function WeekView({ currentDate, events, onEventClick }: WeekViewProps) {
  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return isSameDay(eventStart, day) && !event.allDay;
    });
  };

  const getAllDayEvents = (day: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return isSameDay(eventStart, day) && event.allDay;
    });
  };

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
      {/* Header with days */}
      <div className="flex border-b">
        <div className="w-16 flex-shrink-0" />
        {days.map(day => (
          <div
            key={day.toISOString()}
            className={cn(
              'flex-1 p-2 text-center border-l',
              isToday(day) && 'bg-primary/5'
            )}
          >
            <div className="text-sm text-muted-foreground">
              {format(day, 'EEE')}
            </div>
            <div
              className={cn(
                'text-2xl font-semibold',
                isToday(day) && 'text-primary'
              )}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* All-day events row */}
      <div className="flex border-b">
        <div className="w-16 flex-shrink-0 p-1 text-xs text-muted-foreground">
          All day
        </div>
        {days.map(day => {
          const allDayEvents = getAllDayEvents(day);
          return (
            <div key={day.toISOString()} className="flex-1 border-l p-1 min-h-[40px]">
              {allDayEvents.map(event => (
                <div
                  key={event.id}
                  className="text-xs p-1 rounded mb-1 truncate cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: event.color || '#3b82f6', color: 'white' }}
                  onClick={() => onEventClick(event)}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex">
          {/* Time column */}
          <div className="w-16 flex-shrink-0">
            {hours.map(hour => (
              <div key={hour} className="h-[60px] border-b relative">
                <span className="absolute -top-2 right-2 text-xs text-muted-foreground">
                  {format(addHours(startOfDay(new Date()), hour), 'h a')}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map(day => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'flex-1 border-l relative',
                  isToday(day) && 'bg-primary/5'
                )}
              >
                {hours.map(hour => (
                  <div key={hour} className="h-[60px] border-b" />
                ))}
                {/* Events */}
                {dayEvents.map(event => {
                  const { top, height } = getEventPosition(event);
                  return (
                    <div
                      key={event.id}
                      className="absolute left-1 right-1 p-1 rounded text-xs overflow-hidden cursor-pointer hover:opacity-80"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        backgroundColor: event.color || '#3b82f6',
                        color: 'white',
                      }}
                      onClick={() => onEventClick(event)}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-white/80 truncate">
                        {format(new Date(event.start), 'h:mm a')}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
