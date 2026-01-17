import { AlertTriangle, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

interface LowStockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

interface LowStockWidgetProps {
  items: LowStockItem[];
}

export function LowStockWidget({ items }: LowStockWidgetProps) {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Low Stock Alert
          </CardTitle>
          <CardDescription>Items that need restocking</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/inventory?filter=low-stock">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Shop
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            All items are well stocked!
          </p>
        ) : (
          <div className="space-y-2">
            {items.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{item.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <span className={`text-sm font-medium ${item.quantity === 0 ? 'text-destructive' : 'text-amber-500'}`}>
                  {item.quantity === 0 ? 'Out' : `${item.quantity} ${item.unit}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
