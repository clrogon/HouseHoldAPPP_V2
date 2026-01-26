import apiClient, { getApiErrorMessage } from './client';

export type EventCategory = 'BIRTHDAY' | 'APPOINTMENT' | 'MEETING' | 'HOLIDAY' | 'SCHOOL' | 'SPORTS' | 'OTHER';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  location?: string;
  category: EventCategory;
  color?: string;
  creatorId: string;
  householdId: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  location?: string;
  category?: EventCategory;
  color?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
}

export const calendarApi = {
  async createEvent(data: CreateEventData): Promise<CalendarEvent> {
    try {
      const response = await apiClient.post<CalendarEvent>('/calendar/events', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getEvents(options?: {
    startDate?: string;
    endDate?: string;
    category?: EventCategory;
  }): Promise<CalendarEvent[]> {
    try {
      const params = new URLSearchParams();
      if (options?.startDate) params.append('startDate', options.startDate);
      if (options?.endDate) params.append('endDate', options.endDate);
      if (options?.category) params.append('category', options.category);

      const response = await apiClient.get<CalendarEvent[]>(`/calendar/events?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getEvent(id: string): Promise<CalendarEvent> {
    try {
      const response = await apiClient.get<CalendarEvent>(`/calendar/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateEvent(id: string, data: Partial<CreateEventData>): Promise<CalendarEvent> {
    try {
      const response = await apiClient.patch<CalendarEvent>(`/calendar/events/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async deleteEvent(id: string): Promise<void> {
    try {
      await apiClient.delete(`/calendar/events/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export default calendarApi;
