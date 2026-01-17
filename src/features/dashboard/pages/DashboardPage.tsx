import { useAuthStore } from '@/features/auth';
import { StatsCards } from '../components/StatsCards';
import { TasksWidget } from '../components/TasksWidget';
import { EventsWidget } from '../components/EventsWidget';
import { BudgetWidget } from '../components/BudgetWidget';
import { ActivityWidget } from '../components/ActivityWidget';
import { QuickActions } from '../components/QuickActions';
import { LowStockWidget } from '../components/LowStockWidget';
import {
  mockDashboardStats,
  mockTasks,
  mockEvents,
  mockActivities,
  mockBudgetCategories,
  mockLowStockItems,
} from '@/mocks/dashboard';

export function DashboardPage() {
  const { user } = useAuthStore();

  const totalSpent = mockBudgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalBudget = mockBudgetCategories.reduce((sum, cat) => sum + cat.budget, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your household today.
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Cards */}
      <StatsCards stats={mockDashboardStats} />

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Tasks Widget */}
        <TasksWidget tasks={mockTasks} />

        {/* Events Widget */}
        <EventsWidget events={mockEvents} />

        {/* Budget Widget - Only for ADMIN/PARENT */}
        {(user?.role === 'ADMIN' || user?.role === 'PARENT') && (
          <BudgetWidget
            categories={mockBudgetCategories}
            totalSpent={totalSpent}
            totalBudget={totalBudget}
          />
        )}

        {/* Low Stock Widget */}
        <LowStockWidget items={mockLowStockItems} />

        {/* Activity Widget - spans 2 columns on larger screens */}
        <ActivityWidget activities={mockActivities} />
      </div>
    </div>
  );
}
