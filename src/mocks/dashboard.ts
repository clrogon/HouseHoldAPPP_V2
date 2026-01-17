export interface DashboardStats {
  pendingTasks: number;
  completedTasksToday: number;
  todaysEvents: number;
  upcomingBills: number;
  budgetUsed: number;
  budgetTotal: number;
  lowStockItems: number;
  householdMembers: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assigneeId?: string;
  assigneeName?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  category: 'birthday' | 'appointment' | 'meeting' | 'holiday' | 'school' | 'sports' | 'other';
  startDate: string;
  endDate?: string;
  allDay: boolean;
  location?: string;
}

export interface Activity {
  id: string;
  type: 'task_completed' | 'event_created' | 'expense_added' | 'member_joined' | 'item_low_stock';
  message: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export const mockDashboardStats: DashboardStats = {
  pendingTasks: 8,
  completedTasksToday: 3,
  todaysEvents: 2,
  upcomingBills: 4,
  budgetUsed: 3250,
  budgetTotal: 5000,
  lowStockItems: 6,
  householdMembers: 4,
};

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Grocery shopping',
    description: 'Buy weekly groceries from the supermarket',
    status: 'pending',
    priority: 'high',
    dueDate: new Date().toISOString(),
    assigneeName: 'John',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Pay electricity bill',
    description: 'Monthly electricity payment',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    assigneeName: 'John',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '3',
    title: 'Schedule vet appointment',
    description: 'Annual checkup for Max',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    assigneeName: 'Sarah',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '4',
    title: 'Clean garage',
    description: 'Organize tools and dispose of old items',
    status: 'pending',
    priority: 'low',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    assigneeName: 'Tommy',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '5',
    title: 'Car oil change',
    description: 'Honda Civic needs oil change',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    assigneeName: 'John',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Doctor Appointment',
    description: 'Annual checkup with Dr. Smith',
    category: 'appointment',
    startDate: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    allDay: false,
    location: 'City Medical Center',
  },
  {
    id: '2',
    title: 'Team Meeting',
    description: 'Weekly sync with the team',
    category: 'meeting',
    startDate: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    allDay: false,
    location: 'Zoom',
  },
  {
    id: '3',
    title: "Tommy's Soccer Practice",
    description: 'Weekly soccer training',
    category: 'sports',
    startDate: new Date(Date.now() + 86400000).toISOString(),
    allDay: false,
    location: 'City Sports Complex',
  },
  {
    id: '4',
    title: "Sarah's Birthday",
    category: 'birthday',
    startDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    allDay: true,
  },
  {
    id: '5',
    title: 'Parent-Teacher Conference',
    category: 'school',
    startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    allDay: false,
    location: 'Lincoln Elementary School',
  },
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'task_completed',
    message: 'Completed "Laundry"',
    userId: '2',
    userName: 'Sarah',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '2',
    type: 'expense_added',
    message: 'Added expense: Groceries ($125.50)',
    userId: '1',
    userName: 'John',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    type: 'event_created',
    message: 'Created event: Doctor Appointment',
    userId: '2',
    userName: 'Sarah',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    type: 'item_low_stock',
    message: 'Low stock alert: Milk (2 remaining)',
    userId: 'system',
    userName: 'System',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: '5',
    type: 'task_completed',
    message: 'Completed "Take out trash"',
    userId: '3',
    userName: 'Tommy',
    timestamp: new Date(Date.now() - 21600000).toISOString(),
  },
];

export const mockBudgetCategories = [
  { name: 'Groceries', spent: 850, budget: 1000, color: '#22c55e' },
  { name: 'Utilities', spent: 320, budget: 400, color: '#3b82f6' },
  { name: 'Entertainment', spent: 280, budget: 300, color: '#f59e0b' },
  { name: 'Transportation', spent: 450, budget: 500, color: '#8b5cf6' },
  { name: 'Healthcare', spent: 150, budget: 300, color: '#ef4444' },
  { name: 'Other', spent: 200, budget: 500, color: '#6b7280' },
];

export const mockLowStockItems = [
  { id: '1', name: 'Milk', quantity: 1, unit: 'gallon', category: 'Dairy' },
  { id: '2', name: 'Bread', quantity: 0, unit: 'loaves', category: 'Bakery' },
  { id: '3', name: 'Eggs', quantity: 3, unit: 'pcs', category: 'Dairy' },
  { id: '4', name: 'Butter', quantity: 1, unit: 'stick', category: 'Dairy' },
  { id: '5', name: 'Paper Towels', quantity: 1, unit: 'rolls', category: 'Household' },
  { id: '6', name: 'Dish Soap', quantity: 0, unit: 'bottles', category: 'Cleaning' },
];
