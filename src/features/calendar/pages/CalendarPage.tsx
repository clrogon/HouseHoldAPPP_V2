import { useState, useEffect, useCallback } from 'react';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { Card, CardContent } from '@/shared/components/ui/card';
import { CalendarHeader } from '../components/CalendarHeader';
import { MonthView } from '../components/MonthView';
import { WeekView } from '../components/WeekView';
import { DayView } from '../components/DayView';
import { AgendaView } from '../components/AgendaView';
import { EventDialog } from '../components/EventDialog';
import { CreateEventDialog } from '../components/CreateEventDialog';
import type { CalendarEvent, CalendarView } from '../types/calendar.types';
import { calendarApi } from '@/shared/api';

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await calendarApi.getEvents();
        const mappedEvents: CalendarEvent[] = data.map(e => ({
          id: e.id,
          title: e.title,
          description: e.description,
          start: new Date(e.startDate),
          end: new Date(e.endDate),
          allDay: e.allDay,
          location: e.location,
          category: e.category.toLowerCase() as CalendarEvent['category'],
          color: e.color,
          isRecurring: e.isRecurring,
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handlePrevious = useCallback(() => {
    switch (view) {
      case 'month':
        setCurrentDate(prev => subMonths(prev, 1));
        break;
      case 'week':
        setCurrentDate(prev => subWeeks(prev, 1));
        break;
      case 'day':
        setCurrentDate(prev => subDays(prev, 1));
        break;
      case 'agenda':
        setCurrentDate(prev => subMonths(prev, 1));
        break;
    }
  }, [view]);

  const handleNext = useCallback(() => {
    switch (view) {
      case 'month':
        setCurrentDate(prev => addMonths(prev, 1));
        break;
      case 'week':
        setCurrentDate(prev => addWeeks(prev, 1));
        break;
      case 'day':
        setCurrentDate(prev => addDays(prev, 1));
        break;
      case 'agenda':
        setCurrentDate(prev => addMonths(prev, 1));
        break;
    }
  }, [view]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setCurrentDate(date);
    setView('day');
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  }, []);

  const handleCreateEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      const created = await calendarApi.createEvent({
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.start.toISOString(),
        endDate: eventData.end.toISOString(),
        allDay: eventData.allDay,
        location: eventData.location,
        category: eventData.category?.toUpperCase() as 'BIRTHDAY' | 'APPOINTMENT' | 'MEETING' | 'HOLIDAY' | 'SCHOOL' | 'SPORTS' | 'OTHER',
        color: eventData.color,
        isRecurring: eventData.isRecurring,
      });
      const newEvent: CalendarEvent = {
        id: created.id,
        title: created.title,
        description: created.description,
        start: new Date(created.startDate),
        end: new Date(created.endDate),
        allDay: created.allDay,
        location: created.location,
        category: created.category.toLowerCase() as CalendarEvent['category'],
        color: created.color,
        isRecurring: created.isRecurring,
      };
      setEvents(prev => [...prev, newEvent]);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await calendarApi.deleteEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[500px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }

    switch (view) {
      case 'month':
        return (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        );
      case 'week':
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
          />
        );
      case 'day':
        return (
          <DayView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
          />
        );
      case 'agenda':
        return (
          <AgendaView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your household events and schedules.
          </p>
        </div>
        <CreateEventDialog
          defaultDate={currentDate}
          onCreateEvent={handleCreateEvent}
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <CalendarHeader
            currentDate={currentDate}
            view={view}
            onViewChange={setView}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="h-[calc(100vh-300px)] min-h-[500px]">
            {renderView()}
          </div>
        </CardContent>
      </Card>

      <EventDialog
        event={selectedEvent}
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
