import { format, isToday, isTomorrow } from 'date-fns';
import { Calendar, MapPin, Cake, Stethoscope, Users, GraduationCap, Trophy, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import type { CalendarEvent } from '@/mocks/dashboard';

interface EventsWidgetProps {
  events: CalendarEvent[];
}

const categoryIcons = {
  birthday: Cake,
  appointment: Stethoscope,
  meeting: Users,
  holiday: Calendar,
  school: GraduationCap,
  sports: Trophy,
  other: Tag,
};

const categoryColors = {
  birthday: 'text-pink-500 bg-pink-50 dark:bg-pink-950',
  appointment: 'text-blue-500 bg-blue-50 dark:bg-blue-950',
  meeting: 'text-purple-500 bg-purple-50 dark:bg-purple-950',
  holiday: 'text-green-500 bg-green-50 dark:bg-green-950',
  school: 'text-amber-500 bg-amber-50 dark:bg-amber-950',
  sports: 'text-orange-500 bg-orange-50 dark:bg-orange-950',
  other: 'text-slate-500 bg-slate-50 dark:bg-slate-950',
};

function formatEventDate(dateString: string, allDay: boolean): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return allDay ? 'Today (All day)' : `Today at ${format(date, 'h:mm a')}`;
  }
  if (isTomorrow(date)) {
    return allDay ? 'Tomorrow (All day)' : `Tomorrow at ${format(date, 'h:mm a')}`;
  }
  return allDay ? format(date, 'MMM d') : format(date, 'MMM d, h:mm a');
}

export function EventsWidget({ events }: EventsWidgetProps) {
  const upcomingEvents = events.slice(0, 5);

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Next 7 days</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/calendar">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming events.
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => {
              const Icon = categoryIcons[event.category];
              const colorClass = categoryColors[event.category];

              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{event.title}</p>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatEventDate(event.startDate, event.allDay)}
                      </span>
                      {event.location && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
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
