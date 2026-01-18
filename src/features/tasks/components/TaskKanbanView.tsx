import { Circle, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import type { Task } from '@/mocks/tasks';

interface TaskKanbanViewProps {
  tasks: Task[];
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onClick?: (task: Task) => void;
}

const columns = [
  { id: 'pending' as const, title: 'To Do', icon: Circle, color: 'text-slate-500' },
  { id: 'in_progress' as const, title: 'In Progress', icon: Clock, color: 'text-blue-500' },
  { id: 'completed' as const, title: 'Completed', icon: CheckCircle2, color: 'text-green-500' },
];

const priorityColors = {
  low: 'bg-slate-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
};

export function TaskKanbanView({ tasks, onStatusChange, onClick }: TaskKanbanViewProps) {
  const getTasksByStatus = (status: Task['status']) =>
    tasks.filter(task => task.status === status);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && onStatusChange) {
      onStatusChange(taskId, status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-280px)]">
      {columns.map(column => {
        const columnTasks = getTasksByStatus(column.id);
        const Icon = column.icon;

        return (
          <div
            key={column.id}
            className="flex flex-col bg-muted/50 rounded-lg"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center gap-2 p-4 border-b">
              <Icon className={`h-4 w-4 ${column.color}`} />
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary" className="ml-auto">
                {columnTasks.length}
              </Badge>
            </div>

            <ScrollArea className="flex-1 p-2">
              <div className="space-y-2">
                {columnTasks.map(task => (
                  <Card
                    key={task.id}
                    className="cursor-grab active:cursor-grabbing hover:bg-accent/50 transition-colors"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => onClick?.(task)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className={`w-1 h-full rounded-full ${priorityColors[task.priority]}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </p>
                          {task.assigneeName && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {task.assigneeName}
                            </p>
                          )}
                          {task.dueDate && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          )}
                          {task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {task.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No tasks
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}
