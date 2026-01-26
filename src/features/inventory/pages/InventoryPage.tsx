import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { CategoryCards } from '../components/CategoryCards';
import { InventoryList } from '../components/InventoryList';
import { ShoppingList } from '../components/ShoppingList';
import { AddItemDialog } from '../components/AddItemDialog';
import type { InventoryItem, InventoryCategory, ShoppingListItem } from '../types/inventory.types';
import { inventoryApi } from '@/shared/api';
import {
  mockShoppingList,
  addToShoppingList,
  toggleShoppingItem,
  removeFromShoppingList,
} from '@/mocks/inventory';

export function InventoryPage() {
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const categoriesRef = useRef<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, itemsData] = await Promise.all([
          inventoryApi.getCategories(),
          inventoryApi.getItems(),
        ]);
        categoriesRef.current = categoriesData.map(c => ({ id: c.id, name: c.name }));
        setCategories(categoriesData.map(c => ({
          id: c.id,
          name: c.name,
          icon: c.icon || 'Package',
          color: c.color || 'bg-gray-100',
          count: itemsData.filter(i => i.categoryId === c.id).length,
        })));
        setItems(itemsData.map(i => ({
          id: i.id,
          name: i.name,
          category: categoriesData.find(c => c.id === i.categoryId)?.name || 'Uncategorized',
          quantity: i.quantity,
          unit: i.unit,
          minQuantity: i.lowStockThreshold || 0,
          location: i.location || '',
          expirationDate: i.expiryDate,
          lastUpdated: i.updatedAt,
        })));
        setShoppingList(mockShoppingList);
      } catch (error) {
        console.error('Failed to fetch inventory data:', error);
        setShoppingList(mockShoppingList);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesSearch = !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const lowStockItems = useMemo(() => {
    return items.filter(item => item.quantity <= item.minQuantity);
  }, [items]);

  const expiringItems = useMemo(() => {
    return items.filter(item => {
      if (!item.expirationDate) return false;
      const daysUntilExpiration = Math.ceil(
        (new Date(item.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiration <= 7 && daysUntilExpiration > 0;
    });
  }, [items]);

  const handleUpdateQuantity = async (id: string, change: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    try {
      const newQuantity = Math.max(0, item.quantity + change);
      await inventoryApi.updateStock(id, change, 'Manual adjustment');
      setItems(prev =>
        prev.map(i => (i.id === id ? { ...i, quantity: newQuantity } : i))
      );
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleAddToShoppingList = async (item: InventoryItem) => {
    const existingItem = shoppingList.find(
      i => i.name.toLowerCase() === item.name.toLowerCase()
    );
    if (existingItem) return;

    const newShoppingItem = await addToShoppingList({
      name: item.name,
      quantity: item.minQuantity,
      unit: item.unit,
      category: item.category,
      isPurchased: false,
      addedBy: 'Current User',
    });
    setShoppingList(prev => [...prev, newShoppingItem]);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await inventoryApi.deleteItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleAddItem = async (itemData: Omit<InventoryItem, 'id'>) => {
    try {
      const categoryId = categoriesRef.current.find(c => c.name === itemData.category)?.id;
      if (!categoryId) {
        console.error('Category not found');
        return;
      }
      const created = await inventoryApi.createItem({
        name: itemData.name,
        quantity: itemData.quantity,
        unit: itemData.unit,
        location: itemData.location,
        lowStockThreshold: itemData.minQuantity,
        expiryDate: itemData.expirationDate,
        categoryId,
      });
      const newItem: InventoryItem = {
        id: created.id,
        name: created.name,
        category: itemData.category,
        quantity: created.quantity,
        unit: created.unit,
        minQuantity: created.lowStockThreshold || 0,
        location: created.location || '',
        expirationDate: created.expiryDate,
        lastUpdated: created.updatedAt,
      };
      setItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleToggleShoppingItem = async (id: string) => {
    await toggleShoppingItem(id);
    setShoppingList(prev =>
      prev.map(i => (i.id === id ? { ...i, isPurchased: !i.isPurchased } : i))
    );
  };

  const handleRemoveFromShoppingList = async (id: string) => {
    await removeFromShoppingList(id);
    setShoppingList(prev => prev.filter(i => i.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Track and manage your household items.
          </p>
        </div>
        <AddItemDialog
          categories={categories.map(c => c.name)}
          onAddItem={handleAddItem}
        />
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="flex gap-4">
          {lowStockItems.length > 0 && (
            <Card className="flex-1 border-orange-200 bg-orange-50">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-orange-700">Low Stock Alert</p>
                  <p className="text-sm text-orange-600">
                    {lowStockItems.length} items are running low
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {expiringItems.length > 0 && (
            <Card className="flex-1 border-yellow-200 bg-yellow-50">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-yellow-700">Expiring Soon</p>
                  <p className="text-sm text-yellow-600">
                    {expiringItems.length} items expiring within 7 days
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Categories */}
      <CategoryCards
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="inventory">
              Inventory
              <Badge variant="secondary" className="ml-2">
                {filteredItems.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="shopping">
              Shopping List
              <Badge variant="secondary" className="ml-2">
                {shoppingList.filter(i => !i.isPurchased).length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <TabsContent value="inventory">
          <Card>
            <CardContent className="p-0">
              <InventoryList
                items={filteredItems}
                onUpdateQuantity={handleUpdateQuantity}
                onAddToShoppingList={handleAddToShoppingList}
                onDelete={handleDeleteItem}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shopping">
          <ShoppingList
            items={shoppingList}
            onToggleItem={handleToggleShoppingItem}
            onRemoveItem={handleRemoveFromShoppingList}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
