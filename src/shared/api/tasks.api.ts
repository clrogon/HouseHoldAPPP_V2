import apiClient, { getApiErrorMessage } from './client';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  creatorId: string;
  assigneeId?: string;
  householdId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assigneeId?: string;
  tags?: string[];
}

export const tasksApi = {
  async createTask(data: CreateTaskData): Promise<Task> {
    try {
      const response = await apiClient.post<Task>('/tasks', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getTasks(options?: {
    status?: TaskStatus;
    assigneeId?: string;
    priority?: TaskPriority;
  }): Promise<Task[]> {
    try {
      const params = new URLSearchParams();
      if (options?.status) params.append('status', options.status);
      if (options?.assigneeId) params.append('assigneeId', options.assigneeId);
      if (options?.priority) params.append('priority', options.priority);

      const response = await apiClient.get<Task[]>(`/tasks?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getTask(id: string): Promise<Task> {
    try {
      const response = await apiClient.get<Task>(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateTask(id: string, data: Partial<CreateTaskData>): Promise<Task> {
    try {
      const response = await apiClient.patch<Task>(`/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      await apiClient.delete(`/tasks/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export default tasksApi;
