import {
  UtensilsCrossed,
  Refrigerator,
  Snowflake,
  Sparkles,
  Bath,
  Pill,
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import type { InventoryCategory } from '../types/inventory.types';

interface CategoryCardsProps {
  categories: InventoryCategory[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const iconMap: Record<string, React.ElementType> = {
  UtensilsCrossed,
  Refrigerator,
  Snowflake,
  Sparkles,
  Bath,
  Pill,
};

export function CategoryCards({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map(category => {
        const Icon = iconMap[category.icon] || UtensilsCrossed;
        const isSelected = selectedCategory === category.name;

        return (
          <Card
            key={category.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              isSelected && 'ring-2 ring-primary'
            )}
            onClick={() => onSelectCategory(isSelected ? null : category.name)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <Icon className="h-6 w-6" style={{ color: category.color }} />
              </div>
              <h3 className="font-medium text-sm">{category.name}</h3>
              <p className="text-xs text-muted-foreground">
                {category.itemCount} items
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
