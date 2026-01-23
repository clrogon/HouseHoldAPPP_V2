// Stub file - API integration pending

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assigneeId?: string;
  assigneeName?: string;
  tags: string[];
  subtasks: Subtask[];
  createdBy: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}

export const mockTasks: Task[] = [];

export const taskTags: string[] = [
  'urgent',
  'home',
  'shopping',
  'cleaning',
  'maintenance',
  'bills',
  'health',
  'education',
];

export async function createTask(data: Partial<Task>): Promise<Task> {
  const task: Task = {
    id: String(Date.now()),
    title: data.title || '',
    description: data.description,
    status: data.status || 'pending',
    priority: data.priority || 'medium',
    dueDate: data.dueDate,
    assigneeId: data.assigneeId,
    assigneeName: data.assigneeName,
    tags: data.tags || [],
    subtasks: data.subtasks || [],
    createdBy: data.createdBy || '',
    householdId: data.householdId || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return task;
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  return {
    id,
    title: data.title || '',
    status: data.status || 'pending',
    priority: data.priority || 'medium',
    tags: data.tags || [],
    subtasks: data.subtasks || [],
    createdBy: data.createdBy || '',
    householdId: data.householdId || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };
}

export async function deleteTask(_id: string): Promise<void> {
  return;
}

export async function getTasks(): Promise<Task[]> {
  return [];
}
