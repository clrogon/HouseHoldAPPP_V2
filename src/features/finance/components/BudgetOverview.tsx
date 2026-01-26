import {
  Home,
  Zap,
  ShoppingCart,
  Car,
  Tv,
  Heart,
  GraduationCap,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/currency';
import type { BudgetCategory } from '../types/finance.types';

interface BudgetOverviewProps {
  categories: BudgetCategory[];
}

const iconMap: Record<string, React.ElementType> = {
  Home,
  Zap,
  ShoppingCart,
  Car,
  Tv,
  Heart,
  GraduationCap,
  User,
};

export function BudgetOverview({ categories }: BudgetOverviewProps) {
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const overallPercentage = (totalSpent / totalBudget) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Resumo do Orçamento</CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
            </div>
            <p className="text-sm text-muted-foreground">
              {overallPercentage.toFixed(1)}% do orçamento utilizado
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <Progress
            value={Math.min(overallPercentage, 100)}
            className="h-3"
          />
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          {categories.map(category => {
            const Icon = iconMap[category.icon] || User;
            const percentage = (category.spent / category.budget) * 100;
            const isOverBudget = percentage > 100;

            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: category.color }} />
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={cn('font-medium', isOverBudget && 'text-red-500')}>
                      {formatCurrency(category.spent)}
                    </span>
                    <span className="text-muted-foreground">
                      {' '}/ {formatCurrency(category.budget)}
                    </span>
                  </div>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className={cn('h-2', isOverBudget && '[&>div]:bg-red-500')}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
