import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { Calendar, CheckCircle2, Circle, Clock, MoreVertical, AlertTriangle, User } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { Task } from '@/mocks/tasks';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onClick?: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const statusIcons = {
  pending: Circle,
  in_progress: Clock,
  completed: CheckCircle2,
  cancelled: AlertTriangle,
};

const statusColors = {
  pending: 'text-muted-foreground',
  in_progress: 'text-blue-500',
  completed: 'text-green-500',
  cancelled: 'text-destructive',
};

function formatDueDate(dateString?: string): { text: string; isOverdue: boolean } | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  const isOverdue = isPast(date) && !isToday(date);

  if (isToday(date)) {
    return { text: 'Today', isOverdue: false };
  }
  if (isTomorrow(date)) {
    return { text: 'Tomorrow', isOverdue: false };
  }
  if (isOverdue) {
    return { text: `Overdue`, isOverdue: true };
  }
  return { text: format(date, 'MMM d'), isOverdue: false };
}

export function TaskCard({ task, onStatusChange, onEdit, onDelete, onClick }: TaskCardProps) {
  const StatusIcon = statusIcons[task.status];
  const dueInfo = formatDueDate(task.dueDate);
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === 'completed') {
      onStatusChange?.(task.id, 'pending');
    } else {
      onStatusChange?.(task.id, 'completed');
    }
  };

  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onClick?.(task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Status Checkbox */}
          <button
            onClick={handleStatusToggle}
            className="mt-0.5 flex-shrink-0"
          >
            <StatusIcon className={`h-5 w-5 ${statusColors[task.status]}`} />
          </button>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}>
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange?.(task.id, 'pending'); }}>
                    Mark as Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange?.(task.id, 'in_progress'); }}>
                    Mark as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange?.(task.id, 'completed'); }}>
                    Mark as Completed
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => { e.stopPropagation(); onDelete?.(task.id); }}
                  >
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Subtasks Progress */}
            {totalSubtasks > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Subtasks</span>
                  <span>{completedSubtasks}/{totalSubtasks}</span>
                </div>
                <Progress value={subtaskProgress} className="h-1.5" />
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {/* Priority */}
              <Badge variant="secondary" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>

              {/* Due Date */}
              {dueInfo && (
                <Badge
                  variant="outline"
                  className={dueInfo.isOverdue ? 'border-destructive text-destructive' : ''}
                >
                  {dueInfo.isOverdue && <AlertTriangle className="h-3 w-3 mr-1" />}
                  <Calendar className="h-3 w-3 mr-1" />
                  {dueInfo.text}
                </Badge>
              )}

              {/* Assignee */}
              {task.assigneeName && (
                <Badge variant="outline">
                  <User className="h-3 w-3 mr-1" />
                  {task.assigneeName}
                </Badge>
              )}

              {/* Tags */}
              {task.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{task.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
