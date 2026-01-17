import { Plus, CheckSquare, Calendar, DollarSign, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

const quickActions = [
  {
    label: 'New Task',
    icon: CheckSquare,
    href: '/tasks?action=new',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    label: 'Add Event',
    icon: Calendar,
    href: '/calendar?action=new',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    label: 'Add Expense',
    icon: DollarSign,
    href: '/finance?action=new',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    label: 'Add Item',
    icon: Package,
    href: '/inventory?action=new',
    color: 'bg-amber-500 hover:bg-amber-600',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              asChild
            >
              <Link to={action.href}>
                <div className={`p-2 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
