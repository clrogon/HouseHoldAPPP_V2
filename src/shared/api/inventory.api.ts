import apiClient, { getApiErrorMessage } from './client';

export interface InventoryCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  order: number;
  parentId?: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  expiryDate?: string;
  lowStockThreshold?: number;
  barcode?: string;
  sku?: string;
  categoryId: string;
  householdId: string;
  onShoppingList: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  icon?: string;
  color?: string;
  order?: number;
  parentId?: string;
}

export interface CreateItemData {
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  expiryDate?: string;
  lowStockThreshold?: number;
  barcode?: string;
  sku?: string;
  categoryId: string;
  onShoppingList?: boolean;
}

export const inventoryApi = {
  // Categories
  async createCategory(data: CreateCategoryData): Promise<InventoryCategory> {
    try {
      const response = await apiClient.post<InventoryCategory>('/inventory/categories', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getCategories(): Promise<InventoryCategory[]> {
    try {
      const response = await apiClient.get<InventoryCategory[]>('/inventory/categories');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateCategory(id: string, data: Partial<CreateCategoryData>): Promise<InventoryCategory> {
    try {
      const response = await apiClient.patch<InventoryCategory>(`/inventory/categories/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await apiClient.delete(`/inventory/categories/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Items
  async createItem(data: CreateItemData): Promise<InventoryItem> {
    try {
      const response = await apiClient.post<InventoryItem>('/inventory/items', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getItems(categoryId?: string): Promise<InventoryItem[]> {
    try {
      const params = categoryId ? `?categoryId=${categoryId}` : '';
      const response = await apiClient.get<InventoryItem[]>(`/inventory/items${params}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getItem(id: string): Promise<InventoryItem> {
    try {
      const response = await apiClient.get<InventoryItem>(`/inventory/items/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateItem(id: string, data: Partial<CreateItemData>): Promise<InventoryItem> {
    try {
      const response = await apiClient.patch<InventoryItem>(`/inventory/items/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async deleteItem(id: string): Promise<void> {
    try {
      await apiClient.delete(`/inventory/items/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateStock(id: string, quantityChange: number, reason?: string): Promise<InventoryItem> {
    try {
      const response = await apiClient.post<InventoryItem>(`/inventory/items/${id}/stock`, {
        quantityChange,
        reason,
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export default inventoryApi;
