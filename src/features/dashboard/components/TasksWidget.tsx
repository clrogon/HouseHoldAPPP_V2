import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { Task } from '@/mocks/dashboard';

interface TasksWidgetProps {
  tasks: Task[];
}

const priorityColors = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

function formatDueDate(dateString: string): { text: string; isOverdue: boolean } {
  const date = new Date(dateString);
  const isOverdue = isPast(date) && !isToday(date);

  if (isToday(date)) {
    return { text: 'Today', isOverdue: false };
  }
  if (isTomorrow(date)) {
    return { text: 'Tomorrow', isOverdue: false };
  }
  if (isOverdue) {
    return { text: `Overdue (${format(date, 'MMM d')})`, isOverdue: true };
  }
  return { text: format(date, 'MMM d'), isOverdue: false };
}

export function TasksWidget({ tasks }: TasksWidgetProps) {
  const pendingTasks = tasks
    .filter(t => t.status !== 'completed')
    .slice(0, 5);

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Tasks</CardTitle>
          <CardDescription>Your upcoming tasks</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/tasks">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {pendingTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No pending tasks. Great job!
          </p>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => {
              const dueInfo = formatDueDate(task.dueDate);
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="mt-0.5">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : task.status === 'in_progress' ? (
                      <Clock className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{task.title}</p>
                      <Badge variant="secondary" className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${dueInfo.isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                        {dueInfo.isOverdue && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                        {dueInfo.text}
                      </span>
                      {task.assigneeName && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{task.assigneeName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
