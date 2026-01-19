import { useState, useMemo } from 'react';
import { List, LayoutGrid, Calendar } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { TaskListView } from '../components/TaskListView';
import { TaskKanbanView } from '../components/TaskKanbanView';
import { TaskFiltersComponent, type TaskFilters } from '../components/TaskFilters';
import { CreateTaskDialog } from '../components/CreateTaskDialog';
import { mockTasks, taskTags, createTask, type Task } from '@/mocks/tasks';

type ViewMode = 'list' | 'kanban' | 'calendar';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: [],
    priority: [],
    assignee: '',
  });

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
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status, updatedAt: new Date().toISOString() } : task
    ));
  };

  const handleEditTask = (task: Task) => {
    // In a real app, this would open an edit dialog
    console.log('Edit task:', task);
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleTaskClick = (task: Task) => {
    // In a real app, this would open a task detail view
    console.log('Task clicked:', task);
  };

  const handleCreateTask = async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const task = await createTask(newTask);
    setTasks([task, ...tasks]);
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
        Showing {filteredTasks.length} of {tasks.length} tasks
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
        <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/50">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Calendar view coming soon</p>
            <p className="text-sm">Tasks will be displayed on a calendar by due date</p>
          </div>
        </div>
      )}
    </div>
  );
}
