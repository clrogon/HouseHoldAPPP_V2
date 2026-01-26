import { format } from 'date-fns';
import {
  Package,
  AlertTriangle,
  Calendar,
  MapPin,
  MoreVertical,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/currency';
import type { InventoryItem } from '../types/inventory.types';

interface InventoryListProps {
  items: InventoryItem[];
  onUpdateQuantity: (id: string, change: number) => void;
  onAddToShoppingList: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export function InventoryList({
  items,
  onUpdateQuantity,
  onAddToShoppingList,
  onDelete,
}: InventoryListProps) {
  const isLowStock = (item: InventoryItem) => item.quantity <= item.minQuantity;
  const isExpiringSoon = (item: InventoryItem) => {
    if (!item.expirationDate) return false;
    const daysUntilExpiration = Math.ceil(
      (new Date(item.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiration <= 7 && daysUntilExpiration > 0;
  };
  const isExpired = (item: InventoryItem) => {
    if (!item.expirationDate) return false;
    return new Date(item.expirationDate) < new Date();
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
        <Package className="h-12 w-12 mb-4" />
        <p className="text-lg">No items found</p>
        <p className="text-sm">Add items to track your inventory</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Expiration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="font-medium">{item.name}</div>
              {item.price && (
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(item.price)}
                </div>
              )}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{item.category}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  disabled={item.quantity <= 0}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className={cn('font-medium min-w-[40px] text-center', isLowStock(item) && 'text-orange-500')}>
                  {item.quantity} {item.unit}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {item.location}
              </div>
            </TableCell>
            <TableCell>
              {item.expirationDate ? (
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3" />
                  <span
                    className={cn(
                      isExpired(item) && 'text-red-500',
                      isExpiringSoon(item) && 'text-orange-500'
                    )}
                  >
                    {format(new Date(item.expirationDate), 'MMM d, yyyy')}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {isLowStock(item) && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Low
                  </Badge>
                )}
                {isExpired(item) && (
                  <Badge variant="destructive">
                    Expired
                  </Badge>
                )}
                {isExpiringSoon(item) && !isExpired(item) && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    Expiring Soon
                  </Badge>
                )}
                {!isLowStock(item) && !isExpired(item) && !isExpiringSoon(item) && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    In Stock
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onAddToShoppingList(item)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Shopping List
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
