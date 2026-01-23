// Stub file - API integration pending

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completedTasksToday: number;
  totalMembers: number;
  upcomingEvents: number;
  todaysEvents: number;
  upcomingBills: number;
  lowStockItems: number;
  budgetTotal: number;
  budgetUsed: number;
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assigneeName?: string;
}

// Dashboard-specific CalendarEvent with category support
export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  allDay: boolean;
  location?: string;
  category: 'birthday' | 'appointment' | 'meeting' | 'holiday' | 'school' | 'sports' | 'other';
}

// Activity type with userName and message for ActivityWidget
export type ActivityType = 'task_completed' | 'event_created' | 'expense_added' | 'member_joined' | 'item_low_stock';

export interface Activity {
  id: string;
  type: ActivityType;
  userName: string;
  message: string;
  timestamp: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budget: number;
  spent: number;
  color: string;
}

export interface LowStockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  category: string;
}

export const mockDashboardStats: DashboardStats = {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  completedTasksToday: 0,
  totalMembers: 0,
  upcomingEvents: 0,
  todaysEvents: 0,
  upcomingBills: 0,
  lowStockItems: 0,
  budgetTotal: 0,
  budgetUsed: 0,
};

export const mockTasks: Task[] = [];
export const mockEvents: CalendarEvent[] = [];
export const mockActivities: Activity[] = [];
export const mockBudgetCategories: BudgetCategory[] = [];
export const mockLowStockItems: LowStockItem[] = [];

// Aliases for compatibility
export const mockRecentTasks = mockTasks;
export const mockUpcomingEvents = mockEvents;
export const mockRecentActivity = mockActivities;

export async function getDashboardStats(): Promise<DashboardStats> {
  return mockDashboardStats;
}

export async function getRecentTasks(): Promise<Task[]> {
  return [];
}

export async function getUpcomingEvents(): Promise<CalendarEvent[]> {
  return [];
}

export async function getRecentActivity(): Promise<Activity[]> {
  return [];
}
