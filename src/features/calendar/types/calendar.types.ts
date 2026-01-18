export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay: boolean;
  type: 'appointment' | 'reminder' | 'task' | 'birthday' | 'holiday' | 'other';
  color?: string;
  location?: string;
  attendees?: string[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
  createdBy: string;
  householdId: string;
}

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';
