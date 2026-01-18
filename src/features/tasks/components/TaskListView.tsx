import { TaskCard } from './TaskCard';
import type { Task } from '@/mocks/tasks';

interface TaskListViewProps {
  tasks: Task[];
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onClick?: (task: Task) => void;
}

export function TaskListView({ tasks, onStatusChange, onEdit, onDelete, onClick }: TaskListViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No tasks found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}
    </div>
  );
}
