import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { formatCurrency } from '@/shared/lib/currency';

interface BudgetCategory {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface BudgetWidgetProps {
  categories: BudgetCategory[];
  totalSpent: number;
  totalBudget: number;
}

export function BudgetWidget({ categories, totalSpent, totalBudget }: BudgetWidgetProps) {
  const percentage = Math.round((totalSpent / totalBudget) * 100);
  const remaining = totalBudget - totalSpent;

  const pieData = categories.map(cat => ({
    name: cat.name,
    value: cat.spent,
    color: cat.color,
  }));

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>This month's spending</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/finance">Details</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Gasto</span>
              <span className="font-medium">{formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}</span>
            </div>
            <Progress
              value={percentage}
              className={percentage > 80 ? '[&>div]:bg-amber-500' : percentage > 95 ? '[&>div]:bg-red-500' : ''}
            />
            <p className={`text-xs ${remaining < 500 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              {formatCurrency(remaining)} restante
            </p>
          </div>

          {/* Pie Chart */}
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), 'Gasto']}
                />
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  iconSize={8}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Categories */}
          <div className="space-y-2">
            {categories.slice(0, 3).map((cat) => {
              const catPercentage = Math.round((cat.spent / cat.budget) * 100);
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className={catPercentage > 90 ? 'text-amber-500' : ''}>
                      {catPercentage}%
                    </span>
                  </div>
                  <Progress
                    value={catPercentage}
                    className="h-1.5"
                    style={{ '--progress-color': cat.color } as React.CSSProperties}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
