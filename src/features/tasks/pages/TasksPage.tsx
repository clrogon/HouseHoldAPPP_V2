import { useState, useMemo, useEffect } from 'react';
import { List, LayoutGrid, Calendar } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { TaskListView } from '../components/TaskListView';
import { TaskKanbanView } from '../components/TaskKanbanView';
import { TaskCalendarView } from '../components/TaskCalendarView';
import { TaskFiltersComponent, type TaskFilters } from '../components/TaskFilters';
import { CreateTaskDialog } from '../components/CreateTaskDialog';
import { EditTaskDialog } from '../components/EditTaskDialog';
import { tasksApi } from '@/shared/api';
import { taskTags, type Task } from '@/mocks/tasks';

type ViewMode = 'list' | 'kanban' | 'calendar';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: [],
    priority: [],
    assignee: '',
  });

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await tasksApi.getTasks();
        // Map API response to local Task type
        const mappedTasks: Task[] = data.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status.toLowerCase() as Task['status'],
          priority: t.priority.toLowerCase() as Task['priority'],
          dueDate: t.dueDate,
          assigneeId: t.assigneeId,
          assigneeName: undefined, // API doesn't return assignee name
          tags: t.tags || [],
          subtasks: [],
          createdBy: t.creatorId,
          householdId: t.householdId,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }));
        setTasks(mappedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Get unique assignees from tasks
  const assignees = useMemo(() => {
    const uniqueAssignees = new Map<string, string>();
    tasks.forEach(task => {
      if (task.assigneeId && task.assigneeName) {
        uniqueAssignees.set(task.assigneeId, task.assigneeName);
      }
    });
    return Array.from(uniqueAssignees, ([id, name]) => ({ id, name }));
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(task.status)) {
        return false;
      }

      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
        return false;
      }

      // Assignee filter
      if (filters.assignee && task.assigneeId !== filters.assignee) {
        return false;
      }

      return true;
    });
  }, [tasks, filters]);

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      await tasksApi.updateTask(taskId, { status: status.toUpperCase() as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' });
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status, updatedAt: new Date().toISOString() } : task
      ));
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      const saved = await tasksApi.updateTask(updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH',
        status: updatedTask.status.toUpperCase() as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
        dueDate: updatedTask.dueDate,
        assigneeId: updatedTask.assigneeId,
        tags: updatedTask.tags,
      });
      const mappedTask: Task = {
        ...updatedTask,
        id: saved.id,
        status: saved.status.toLowerCase() as Task['status'],
        priority: saved.priority.toLowerCase() as Task['priority'],
        updatedAt: saved.updatedAt,
      };
      setTasks(tasks.map(t => t.id === mappedTask.id ? mappedTask : t));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksApi.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleTaskClick = (task: Task) => {
    // In a real app, this would open a task detail view
    console.log('Task clicked:', task);
  };

  const handleCreateTask = async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await tasksApi.createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH',
        status: newTask.status.toUpperCase() as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
        dueDate: newTask.dueDate,
        assigneeId: newTask.assigneeId,
        tags: newTask.tags,
      });
      const task: Task = {
        id: created.id,
        title: created.title,
        description: created.description,
        status: created.status.toLowerCase() as Task['status'],
        priority: created.priority.toLowerCase() as Task['priority'],
        dueDate: created.dueDate,
        assigneeId: created.assigneeId,
        assigneeName: newTask.assigneeName,
        tags: created.tags || [],
        subtasks: [],
        createdBy: created.creatorId,
        householdId: created.householdId,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      };
      setTasks([task, ...tasks]);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track your household tasks
          </p>
        </div>
        <CreateTaskDialog
          assignees={assignees}
          availableTags={taskTags}
          onCreateTask={handleCreateTask}
        />
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <TaskFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          assignees={assignees}
        />

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </TabsTrigger>
            <TabsTrigger value="kanban" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Board</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Task Count */}
      <div className="text-sm text-muted-foreground">
        {loading ? 'Loading tasks...' : `Showing ${filteredTasks.length} of ${tasks.length} tasks`}
      </div>

      {/* Task Views */}
      {viewMode === 'list' && (
        <TaskListView
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onClick={handleTaskClick}
        />
      )}

      {viewMode === 'kanban' && (
        <TaskKanbanView
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onClick={handleTaskClick}
        />
      )}

      {viewMode === 'calendar' && (
        <TaskCalendarView
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onClick={handleTaskClick}
        />
      )}

      {/* Edit Task Dialog */}
      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          assignees={assignees}
          availableTags={taskTags}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}
