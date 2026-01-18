export interface InventoryCategory {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  color: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  location: string;
  expirationDate?: string;
  purchaseDate?: string;
  price?: number;
  barcode?: string;
  notes?: string;
  householdId: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isPurchased: boolean;
  addedBy: string;
  addedAt: string;
}

export const mockCategories: InventoryCategory[] = [
  { id: '1', name: 'Pantry', icon: 'UtensilsCrossed', itemCount: 24, color: '#f59e0b' },
  { id: '2', name: 'Refrigerator', icon: 'Refrigerator', itemCount: 18, color: '#3b82f6' },
  { id: '3', name: 'Freezer', icon: 'Snowflake', itemCount: 12, color: '#06b6d4' },
  { id: '4', name: 'Cleaning', icon: 'Sparkles', itemCount: 8, color: '#10b981' },
  { id: '5', name: 'Bathroom', icon: 'Bath', itemCount: 15, color: '#8b5cf6' },
  { id: '6', name: 'Medicine', icon: 'Pill', itemCount: 6, color: '#ef4444' },
];

export const mockItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Milk',
    category: 'Refrigerator',
    quantity: 2,
    unit: 'gallons',
    minQuantity: 1,
    location: 'Top shelf',
    expirationDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    price: 4.99,
    householdId: '1',
  },
  {
    id: '2',
    name: 'Eggs',
    category: 'Refrigerator',
    quantity: 18,
    unit: 'count',
    minQuantity: 6,
    location: 'Door shelf',
    expirationDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    price: 5.99,
    householdId: '1',
  },
  {
    id: '3',
    name: 'Bread',
    category: 'Pantry',
    quantity: 1,
    unit: 'loaf',
    minQuantity: 1,
    location: 'Counter',
    expirationDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    price: 3.49,
    householdId: '1',
  },
  {
    id: '4',
    name: 'Rice',
    category: 'Pantry',
    quantity: 3,
    unit: 'lbs',
    minQuantity: 2,
    location: 'Cabinet A',
    price: 8.99,
    householdId: '1',
  },
  {
    id: '5',
    name: 'Pasta',
    category: 'Pantry',
    quantity: 4,
    unit: 'boxes',
    minQuantity: 2,
    location: 'Cabinet A',
    price: 1.99,
    householdId: '1',
  },
  {
    id: '6',
    name: 'Chicken Breast',
    category: 'Freezer',
    quantity: 2,
    unit: 'lbs',
    minQuantity: 1,
    location: 'Top drawer',
    expirationDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    price: 12.99,
    householdId: '1',
  },
  {
    id: '7',
    name: 'Frozen Pizza',
    category: 'Freezer',
    quantity: 3,
    unit: 'count',
    minQuantity: 2,
    location: 'Middle shelf',
    expirationDate: new Date(Date.now() + 86400000 * 60).toISOString(),
    price: 6.99,
    householdId: '1',
  },
  {
    id: '8',
    name: 'Dish Soap',
    category: 'Cleaning',
    quantity: 1,
    unit: 'bottle',
    minQuantity: 1,
    location: 'Under sink',
    price: 3.99,
    householdId: '1',
  },
  {
    id: '9',
    name: 'Paper Towels',
    category: 'Cleaning',
    quantity: 6,
    unit: 'rolls',
    minQuantity: 4,
    location: 'Utility closet',
    price: 12.99,
    householdId: '1',
  },
  {
    id: '10',
    name: 'Toothpaste',
    category: 'Bathroom',
    quantity: 2,
    unit: 'tubes',
    minQuantity: 1,
    location: 'Bathroom cabinet',
    price: 4.49,
    householdId: '1',
  },
  {
    id: '11',
    name: 'Shampoo',
    category: 'Bathroom',
    quantity: 1,
    unit: 'bottle',
    minQuantity: 1,
    location: 'Shower',
    price: 7.99,
    householdId: '1',
  },
  {
    id: '12',
    name: 'Ibuprofen',
    category: 'Medicine',
    quantity: 45,
    unit: 'tablets',
    minQuantity: 20,
    location: 'Medicine cabinet',
    expirationDate: new Date(Date.now() + 86400000 * 365).toISOString(),
    price: 9.99,
    householdId: '1',
  },
  {
    id: '13',
    name: 'Butter',
    category: 'Refrigerator',
    quantity: 1,
    unit: 'lb',
    minQuantity: 1,
    location: 'Door shelf',
    expirationDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    price: 5.49,
    householdId: '1',
  },
  {
    id: '14',
    name: 'Cheese',
    category: 'Refrigerator',
    quantity: 0,
    unit: 'blocks',
    minQuantity: 1,
    location: 'Drawer',
    price: 6.99,
    householdId: '1',
  },
  {
    id: '15',
    name: 'Orange Juice',
    category: 'Refrigerator',
    quantity: 1,
    unit: 'carton',
    minQuantity: 1,
    location: 'Top shelf',
    expirationDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    price: 4.99,
    householdId: '1',
  },
];

export const mockShoppingList: ShoppingListItem[] = [
  {
    id: '1',
    name: 'Cheese',
    quantity: 2,
    unit: 'blocks',
    category: 'Refrigerator',
    isPurchased: false,
    addedBy: 'Sarah Smith',
    addedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    name: 'Coffee',
    quantity: 1,
    unit: 'bag',
    category: 'Pantry',
    isPurchased: false,
    addedBy: 'John Smith',
    addedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '3',
    name: 'Laundry Detergent',
    quantity: 1,
    unit: 'bottle',
    category: 'Cleaning',
    isPurchased: true,
    addedBy: 'Sarah Smith',
    addedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '4',
    name: 'Bananas',
    quantity: 1,
    unit: 'bunch',
    category: 'Pantry',
    isPurchased: false,
    addedBy: 'Tommy Smith',
    addedAt: new Date().toISOString(),
  },
];

// Mock API functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCategories(): Promise<InventoryCategory[]> {
  await delay(300);
  return mockCategories;
}

export async function getItems(): Promise<InventoryItem[]> {
  await delay(300);
  return mockItems;
}

export async function getItemsByCategory(category: string): Promise<InventoryItem[]> {
  await delay(300);
  return mockItems.filter(item => item.category === category);
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  await delay(300);
  return mockItems.filter(item => item.quantity <= item.minQuantity);
}

export async function getShoppingList(): Promise<ShoppingListItem[]> {
  await delay(300);
  return mockShoppingList;
}

export async function addItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
  await delay(500);
  const newItem: InventoryItem = {
    ...item,
    id: String(mockItems.length + 1),
  };
  mockItems.push(newItem);
  return newItem;
}

export async function updateItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
  await delay(300);
  const index = mockItems.findIndex(i => i.id === id);
  if (index === -1) throw new Error('Item not found');
  mockItems[index] = { ...mockItems[index], ...updates };
  return mockItems[index];
}

export async function deleteItem(id: string): Promise<void> {
  await delay(300);
  const index = mockItems.findIndex(i => i.id === id);
  if (index !== -1) {
    mockItems.splice(index, 1);
  }
}

export async function addToShoppingList(item: Omit<ShoppingListItem, 'id' | 'addedAt'>): Promise<ShoppingListItem> {
  await delay(500);
  const newItem: ShoppingListItem = {
    ...item,
    id: String(mockShoppingList.length + 1),
    addedAt: new Date().toISOString(),
  };
  mockShoppingList.push(newItem);
  return newItem;
}

export async function toggleShoppingItem(id: string): Promise<ShoppingListItem> {
  await delay(300);
  const item = mockShoppingList.find(i => i.id === id);
  if (!item) throw new Error('Item not found');
  item.isPurchased = !item.isPurchased;
  return item;
}

export async function removeFromShoppingList(id: string): Promise<void> {
  await delay(300);
  const index = mockShoppingList.findIndex(i => i.id === id);
  if (index !== -1) {
    mockShoppingList.splice(index, 1);
  }
}
