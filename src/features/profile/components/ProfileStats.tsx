import { CheckSquare, Calendar, BookOpen, Package, Banknote, ClipboardList } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/currency';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { UserStats } from '../types/profile.types';

interface ProfileStatsProps {
  stats: UserStats;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    {
      label: 'Tasks Completed',
      value: stats.tasksCompleted,
      icon: CheckSquare,
      color: 'text-green-500',
    },
    {
      label: 'Tasks Assigned',
      value: stats.tasksAssigned,
      icon: ClipboardList,
      color: 'text-blue-500',
    },
    {
      label: 'Events Created',
      value: stats.eventsCreated,
      icon: Calendar,
      color: 'text-purple-500',
    },
    {
      label: 'Recipes Added',
      value: stats.recipesAdded,
      icon: BookOpen,
      color: 'text-orange-500',
    },
    {
      label: 'Inventory Items',
      value: stats.inventoryItems,
      icon: Package,
      color: 'text-cyan-500',
    },
    {
      label: 'Total Despesas',
      value: formatCurrency(stats.totalExpenses),
      icon: Banknote,
      color: 'text-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4 text-center">
            <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
