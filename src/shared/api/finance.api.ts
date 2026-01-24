import apiClient, { getApiErrorMessage } from './client';

// Types matching backend DTOs
export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: string;
  description?: string;
  date: string;
  paymentMethod?: string;
  isRecurring: boolean;
  recurrence?: string;
  receiptUrl?: string;
  creatorId: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: string;
  description?: string;
  date: string;
  paymentMethod?: string;
  isRecurring?: boolean;
  recurrence?: string;
  receiptUrl?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
}

export interface Budget {
  id: string;
  name: string;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM';
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
  totalBudgeted: number;
  creatorId: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetData {
  name: string;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM';
  startDate: string;
  endDate: string;
  categories: { name: string; budgeted: number; spent?: number }[];
  totalBudgeted: number;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export const financeApi = {
  // ============================================
  // TRANSACTIONS
  // ============================================

  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    try {
      const response = await apiClient.post<Transaction>('/finance/transactions', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getTransactions(options?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    type?: 'INCOME' | 'EXPENSE';
    limit?: number;
    offset?: number;
  }): Promise<Transaction[]> {
    try {
      const params = new URLSearchParams();
      if (options?.startDate) params.append('startDate', options.startDate);
      if (options?.endDate) params.append('endDate', options.endDate);
      if (options?.category) params.append('category', options.category);
      if (options?.type) params.append('type', options.type);
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());

      const response = await apiClient.get<Transaction[]>(
        `/finance/transactions?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getTransaction(id: string): Promise<Transaction> {
    try {
      const response = await apiClient.get<Transaction>(`/finance/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateTransaction(
    id: string,
    data: Partial<CreateTransactionData>
  ): Promise<Transaction> {
    try {
      const response = await apiClient.patch<Transaction>(
        `/finance/transactions/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    try {
      await apiClient.delete(`/finance/transactions/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // ============================================
  // BUDGETS
  // ============================================

  async createBudget(data: CreateBudgetData): Promise<Budget> {
    try {
      const response = await apiClient.post<Budget>('/finance/budgets', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getBudgets(): Promise<Budget[]> {
    try {
      const response = await apiClient.get<Budget[]>('/finance/budgets');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getBudget(id: string): Promise<Budget> {
    try {
      const response = await apiClient.get<Budget>(`/finance/budgets/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async deleteBudget(id: string): Promise<void> {
    try {
      await apiClient.delete(`/finance/budgets/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // ============================================
  // SUMMARY
  // ============================================

  async getSummary(startDate?: string, endDate?: string): Promise<FinanceSummary> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await apiClient.get<FinanceSummary>(
        `/finance/summary?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export default financeApi;
