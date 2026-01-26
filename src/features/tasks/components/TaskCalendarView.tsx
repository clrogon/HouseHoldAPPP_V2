import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { Task } from '@/mocks/tasks';

interface TaskCalendarViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClick: (task: Task) => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Add days from previous month to fill the first week
  const startDayOfWeek = firstDay.getDay();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }

  // Add all days of current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  // Add days from next month to fill the last week
  const endDayOfWeek = lastDay.getDay();
  for (let i = 1; i < 7 - endDayOfWeek; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const priorityColors: Record<Task['priority'], string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

const statusStyles: Record<Task['status'], string> = {
  pending: 'bg-muted text-foreground',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 line-through opacity-60',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 line-through opacity-60',
};

export function TaskCalendarView({
  tasks,
  onEdit,
  onClick,
}: TaskCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach(task => {
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        const key = formatDateKey(date);
        const existing = map.get(key) || [];
        map.set(key, [...existing, task]);
      }
    });
    return map;
  }, [tasks]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const today = new Date();

  return (
    <div className="border rounded-lg bg-card">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold ml-2">
            {MONTHS[month]} {year}
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={goToToday}>
          Hoje
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === month;
          const isToday = isSameDay(date, today);
          const dateKey = formatDateKey(date);
          const dayTasks = tasksByDate.get(dateKey) || [];

          return (
            <div
              key={index}
              className={cn(
                'min-h-[100px] border-b border-r p-1',
                !isCurrentMonth && 'bg-muted/30',
                index % 7 === 0 && 'border-l'
              )}
            >
              <div
                className={cn(
                  'text-sm font-medium mb-1 p-1 text-center w-7 h-7 rounded-full',
                  !isCurrentMonth && 'text-muted-foreground',
                  isToday && 'bg-primary text-primary-foreground'
                )}
              >
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map(task => (
                  <button
                    key={task.id}
                    onClick={() => {
                      onClick(task);
                      onEdit(task);
                    }}
                    className={cn(
                      'w-full text-left text-xs p-1 rounded truncate flex items-center gap-1',
                      statusStyles[task.status]
                    )}
                    title={task.title}
                  >
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        priorityColors[task.priority]
                      )}
                    />
                    <span className="truncate">{task.title}</span>
                  </button>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayTasks.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 border-t flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-medium">Prioridade:</span>
          <div className="flex items-center gap-1">
            <span className={cn('w-2 h-2 rounded-full', priorityColors.high)} />
            <span>Alta</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={cn('w-2 h-2 rounded-full', priorityColors.medium)} />
            <span>Média</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={cn('w-2 h-2 rounded-full', priorityColors.low)} />
            <span>Baixa</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Estado:</span>
          <div className={cn('px-2 py-0.5 rounded', statusStyles.pending)}>Pendente</div>
          <div className={cn('px-2 py-0.5 rounded', statusStyles.in_progress)}>Em Progresso</div>
          <div className={cn('px-2 py-0.5 rounded', statusStyles.completed)}>Concluída</div>
        </div>
      </div>
    </div>
  );
}
