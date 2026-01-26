// Stub file - API integration pending

// Re-export types from features for compatibility
export type { CalendarEvent, CalendarView } from '@/features/calendar/types/calendar.types';

import type { CalendarEvent } from '@/features/calendar/types/calendar.types';

export const mockEvents: CalendarEvent[] = [];

export async function getEvents(): Promise<CalendarEvent[]> {
  return [];
}

export async function createEvent(_data: Partial<CalendarEvent>): Promise<CalendarEvent> {
  throw new Error('API integration required');
}

export async function updateEvent(_id: string, _data: Partial<CalendarEvent>): Promise<CalendarEvent> {
  throw new Error('API integration required');
}

export async function deleteEvent(_id: string): Promise<void> {
  return;
}
