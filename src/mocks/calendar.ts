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

// Generate dates relative to today
const today = new Date();
const getDate = (daysOffset: number, hours: number = 10, minutes: number = 0) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Family Dinner',
    description: 'Weekly family dinner at home',
    start: getDate(0, 18, 0),
    end: getDate(0, 20, 0),
    allDay: false,
    type: 'other',
    color: '#10b981',
    location: 'Home',
    attendees: ['John', 'Sarah', 'Tommy', 'Emma'],
    createdBy: 'John Smith',
    householdId: '1',
  },
  {
    id: '2',
    title: 'Dentist Appointment - Tommy',
    description: 'Regular checkup',
    start: getDate(1, 9, 30),
    end: getDate(1, 10, 30),
    allDay: false,
    type: 'appointment',
    color: '#3b82f6',
    location: 'Dr. Smith Dental Clinic',
    attendees: ['Tommy', 'Sarah'],
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '3',
    title: 'Grocery Shopping',
    description: 'Weekly grocery run',
    start: getDate(2, 10, 0),
    end: getDate(2, 12, 0),
    allDay: false,
    type: 'task',
    color: '#f59e0b',
    location: 'Whole Foods',
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '4',
    title: "Emma's Birthday",
    description: 'Emma turns 14!',
    start: getDate(5, 0, 0),
    end: getDate(5, 23, 59),
    allDay: true,
    type: 'birthday',
    color: '#ec4899',
    createdBy: 'John Smith',
    householdId: '1',
  },
  {
    id: '5',
    title: 'Parent-Teacher Conference',
    description: "Meeting with Tommy's teacher",
    start: getDate(3, 15, 0),
    end: getDate(3, 16, 0),
    allDay: false,
    type: 'appointment',
    color: '#3b82f6',
    location: 'Springfield Elementary School',
    attendees: ['John', 'Sarah'],
    createdBy: 'John Smith',
    householdId: '1',
  },
  {
    id: '6',
    title: 'Car Service',
    description: 'Honda Accord oil change and inspection',
    start: getDate(4, 8, 0),
    end: getDate(4, 10, 0),
    allDay: false,
    type: 'appointment',
    color: '#6366f1',
    location: 'AutoCare Center',
    createdBy: 'John Smith',
    householdId: '1',
  },
  {
    id: '7',
    title: 'Pay Bills',
    start: getDate(7, 0, 0),
    end: getDate(7, 23, 59),
    allDay: true,
    type: 'reminder',
    color: '#ef4444',
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '8',
    title: 'Soccer Practice - Tommy',
    description: 'Weekly soccer practice',
    start: getDate(1, 16, 0),
    end: getDate(1, 17, 30),
    allDay: false,
    type: 'other',
    color: '#10b981',
    location: 'Community Park',
    attendees: ['Tommy'],
    recurrence: {
      frequency: 'weekly',
      interval: 1,
    },
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '9',
    title: 'Dance Class - Emma',
    description: 'Ballet lesson',
    start: getDate(2, 15, 0),
    end: getDate(2, 16, 0),
    allDay: false,
    type: 'other',
    color: '#ec4899',
    location: 'Dance Academy',
    attendees: ['Emma'],
    recurrence: {
      frequency: 'weekly',
      interval: 1,
    },
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '10',
    title: 'House Cleaning',
    description: 'Maria scheduled cleaning',
    start: getDate(0, 9, 0),
    end: getDate(0, 13, 0),
    allDay: false,
    type: 'task',
    color: '#f59e0b',
    location: 'Home',
    attendees: ['Maria'],
    createdBy: 'Maria Garcia',
    householdId: '1',
  },
  {
    id: '11',
    title: 'Movie Night',
    description: 'Family movie night',
    start: getDate(6, 19, 0),
    end: getDate(6, 22, 0),
    allDay: false,
    type: 'other',
    color: '#8b5cf6',
    location: 'Home',
    attendees: ['John', 'Sarah', 'Tommy', 'Emma'],
    createdBy: 'John Smith',
    householdId: '1',
  },
  {
    id: '12',
    title: 'Vet Appointment - Max',
    description: 'Annual vaccination for Max',
    start: getDate(8, 11, 0),
    end: getDate(8, 12, 0),
    allDay: false,
    type: 'appointment',
    color: '#3b82f6',
    location: 'Happy Paws Vet Clinic',
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
];

// Mock API functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getEvents(): Promise<CalendarEvent[]> {
  await delay(300);
  return mockEvents;
}

export async function getEventsByDateRange(start: Date, end: Date): Promise<CalendarEvent[]> {
  await delay(300);
  return mockEvents.filter(event => {
    const eventStart = new Date(event.start);
    return eventStart >= start && eventStart <= end;
  });
}

export async function createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
  await delay(500);
  const newEvent: CalendarEvent = {
    ...event,
    id: String(mockEvents.length + 1),
  };
  mockEvents.push(newEvent);
  return newEvent;
}

export async function updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
  await delay(300);
  const index = mockEvents.findIndex(e => e.id === id);
  if (index === -1) throw new Error('Event not found');
  mockEvents[index] = { ...mockEvents[index], ...updates };
  return mockEvents[index];
}

export async function deleteEvent(id: string): Promise<void> {
  await delay(300);
  const index = mockEvents.findIndex(e => e.id === id);
  if (index !== -1) {
    mockEvents.splice(index, 1);
  }
}
