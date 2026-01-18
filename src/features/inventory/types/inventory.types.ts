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
