// Stub file - API integration pending

// Re-export types from features for compatibility
export type { InventoryCategory, InventoryItem, ShoppingListItem } from '@/features/inventory/types/inventory.types';

import type { InventoryCategory, InventoryItem, ShoppingListItem } from '@/features/inventory/types/inventory.types';

export const mockCategories: InventoryCategory[] = [];
export const mockItems: InventoryItem[] = [];
export const mockShoppingList: ShoppingListItem[] = [];

export async function getCategories(): Promise<InventoryCategory[]> {
  return [];
}

export async function createCategory(_data: Partial<InventoryCategory>): Promise<InventoryCategory> {
  throw new Error('API integration required');
}

export async function updateCategory(_id: string, _data: Partial<InventoryCategory>): Promise<InventoryCategory> {
  throw new Error('API integration required');
}

export async function deleteCategory(_id: string): Promise<void> {
  return;
}

export async function getItems(_categoryId?: string): Promise<InventoryItem[]> {
  return [];
}

export async function createItem(_data: Partial<InventoryItem>): Promise<InventoryItem> {
  throw new Error('API integration required');
}

export async function addItem(data: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
  return {
    id: String(Date.now()),
    ...data,
  };
}

export async function updateItem(_id: string, _data: Partial<InventoryItem>): Promise<InventoryItem> {
  throw new Error('API integration required');
}

export async function deleteItem(_id: string): Promise<void> {
  return;
}

export async function updateItemQuantity(_id: string, _change: number): Promise<InventoryItem> {
  throw new Error('API integration required');
}

export async function addToShoppingList(_itemOrId: string | Omit<ShoppingListItem, 'id' | 'addedAt'>): Promise<ShoppingListItem> {
  const item: ShoppingListItem = typeof _itemOrId === 'string'
    ? { id: _itemOrId, name: '', quantity: 1, unit: '', category: '', isPurchased: false, addedBy: '', addedAt: new Date().toISOString() }
    : { id: String(Date.now()), ..._itemOrId, addedAt: new Date().toISOString() };
  return item;
}

export async function removeFromShoppingList(_id: string): Promise<void> {
  return;
}

export async function toggleShoppingItem(_id: string): Promise<ShoppingListItem> {
  throw new Error('API integration required');
}
