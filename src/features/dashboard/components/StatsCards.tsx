import { CheckSquare, Calendar, Wallet, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatCurrency } from '@/shared/lib/currency';
import type { DashboardStats } from '@/mocks/dashboard';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const budgetPercentage = Math.round((stats.budgetUsed / stats.budgetTotal) * 100);
  const budgetStatus = budgetPercentage > 80 ? 'warning' : 'good';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingTasks}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-green-500">{stats.completedTasksToday}</span> completed today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todaysEvents}</div>
          <p className="text-xs text-muted-foreground">
            {stats.upcomingBills} bills due this week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{budgetPercentage}%</div>
          <p className={`text-xs flex items-center gap-1 ${budgetStatus === 'warning' ? 'text-amber-500' : 'text-muted-foreground'}`}>
            {budgetStatus === 'warning' && <TrendingDown className="h-3 w-3" />}
            {formatCurrency(stats.budgetUsed)} de {formatCurrency(stats.budgetTotal)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.lowStockItems}</div>
          <p className="text-xs text-destructive">
            Needs attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
