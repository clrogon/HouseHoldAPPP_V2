import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Calendar, DollarSign, UserPlus, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import type { Activity } from '@/mocks/dashboard';

interface ActivityWidgetProps {
  activities: Activity[];
}

const activityIcons = {
  task_completed: CheckCircle,
  event_created: Calendar,
  expense_added: DollarSign,
  member_joined: UserPlus,
  item_low_stock: AlertTriangle,
};

const activityColors = {
  task_completed: 'text-green-500',
  event_created: 'text-blue-500',
  expense_added: 'text-purple-500',
  member_joined: 'text-cyan-500',
  item_low_stock: 'text-amber-500',
};

export function ActivityWidget({ activities }: ActivityWidgetProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your household</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity.
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];

              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {activity.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{activity.userName}</span>
                      <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
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
