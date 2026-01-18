export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assigneeId?: string;
  assigneeName?: string;
  tags: string[];
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  householdId: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Grocery shopping',
    description: 'Buy weekly groceries from the supermarket. Don\'t forget milk, eggs, and bread.',
    status: 'pending',
    priority: 'high',
    dueDate: new Date().toISOString(),
    assigneeId: '1',
    assigneeName: 'John',
    tags: ['shopping', 'weekly'],
    subtasks: [
      { id: '1-1', title: 'Make shopping list', completed: true },
      { id: '1-2', title: 'Check pantry inventory', completed: true },
      { id: '1-3', title: 'Go to store', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    createdBy: 'Sarah',
    householdId: '1',
  },
  {
    id: '2',
    title: 'Pay electricity bill',
    description: 'Monthly electricity payment due',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    assigneeId: '1',
    assigneeName: 'John',
    tags: ['bills', 'monthly'],
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdBy: 'John',
    householdId: '1',
  },
  {
    id: '3',
    title: 'Schedule vet appointment',
    description: 'Annual checkup for Max the dog',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    assigneeId: '2',
    assigneeName: 'Sarah',
    tags: ['pets', 'appointment'],
    subtasks: [
      { id: '3-1', title: 'Call vet office', completed: true },
      { id: '3-2', title: 'Confirm appointment', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'Sarah',
    householdId: '1',
  },
  {
    id: '4',
    title: 'Clean garage',
    description: 'Organize tools and dispose of old items',
    status: 'pending',
    priority: 'low',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    assigneeId: '3',
    assigneeName: 'Tommy',
    tags: ['cleaning', 'home'],
    subtasks: [
      { id: '4-1', title: 'Sort items', completed: false },
      { id: '4-2', title: 'Take out trash', completed: false },
      { id: '4-3', title: 'Organize tools', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'John',
    householdId: '1',
  },
  {
    id: '5',
    title: 'Car oil change',
    description: 'Honda Civic needs oil change at 50,000 miles',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    assigneeId: '1',
    assigneeName: 'John',
    tags: ['car', 'maintenance'],
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    createdBy: 'John',
    householdId: '1',
  },
  {
    id: '6',
    title: 'Plan birthday party',
    description: 'Emma\'s birthday party next month',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    assigneeId: '2',
    assigneeName: 'Sarah',
    tags: ['family', 'celebration'],
    subtasks: [
      { id: '6-1', title: 'Create guest list', completed: true },
      { id: '6-2', title: 'Book venue', completed: true },
      { id: '6-3', title: 'Order cake', completed: false },
      { id: '6-4', title: 'Send invitations', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdBy: 'Sarah',
    householdId: '1',
  },
  {
    id: '7',
    title: 'Fix leaky faucet',
    description: 'Kitchen sink faucet is dripping',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    assigneeId: '1',
    assigneeName: 'John',
    tags: ['home', 'repair'],
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdBy: 'Sarah',
    householdId: '1',
  },
  {
    id: '8',
    title: 'Mow the lawn',
    description: 'Weekly lawn maintenance',
    status: 'completed',
    priority: 'low',
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    assigneeId: '3',
    assigneeName: 'Tommy',
    tags: ['outdoor', 'weekly'],
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'John',
    householdId: '1',
  },
];

export const taskTags = [
  'shopping', 'weekly', 'bills', 'monthly', 'pets', 'appointment',
  'cleaning', 'home', 'car', 'maintenance', 'family', 'celebration',
  'repair', 'outdoor', 'school', 'work'
];

// Mock API functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getTasks(): Promise<Task[]> {
  await delay(300);
  return [...mockTasks];
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
  await delay(300);
  const newTask: Task = {
    ...task,
    id: String(mockTasks.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTasks.push(newTask);
  return newTask;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  await delay(300);
  const index = mockTasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Task not found');
  mockTasks[index] = { ...mockTasks[index], ...updates, updatedAt: new Date().toISOString() };
  return mockTasks[index];
}

export async function deleteTask(id: string): Promise<void> {
  await delay(300);
  const index = mockTasks.findIndex(t => t.id === id);
  if (index !== -1) {
    mockTasks.splice(index, 1);
  }
}
