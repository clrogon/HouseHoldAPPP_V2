import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';
import type { Employee } from '../types/employees.types';

interface ScheduleOverviewProps {
  employees: Employee[];
}

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const dayLabels: Record<(typeof daysOfWeek)[number], string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

export function ScheduleOverview({ employees }: ScheduleOverviewProps) {
  const activeEmployees = employees.filter(e => e.status === 'active' && e.schedule);

  const getEmployeesForDay = (day: (typeof daysOfWeek)[number]) => {
    return activeEmployees.filter(e =>
      e.schedule?.some(s => s.dayOfWeek === day)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map(day => {
            const dayEmployees = getEmployeesForDay(day);
            const isWeekend = day === 'saturday' || day === 'sunday';

            return (
              <div
                key={day}
                className={cn(
                  'p-2 rounded-lg min-h-[120px]',
                  isWeekend ? 'bg-muted/50' : 'bg-muted/30'
                )}
              >
                <div className="text-sm font-medium mb-2 text-center">
                  {dayLabels[day]}
                </div>
                <div className="space-y-2">
                  {dayEmployees.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center">
                      No one scheduled
                    </p>
                  ) : (
                    dayEmployees.map(employee => {
                      const schedule = employee.schedule?.find(
                        s => s.dayOfWeek === day
                      );
                      return (
                        <div
                          key={employee.id}
                          className="p-2 bg-background rounded border text-xs"
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={employee.avatar} />
                              <AvatarFallback className="text-[8px]">
                                {employee.firstName[0]}{employee.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium truncate">
                              {employee.firstName}
                            </span>
                          </div>
                          {schedule && (
                            <div className="text-muted-foreground">
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
