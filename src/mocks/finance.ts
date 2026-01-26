// Stub file - API integration pending

// Re-export types from features for compatibility
export type { BudgetCategory, Transaction, Bill, FinanceSummary } from '@/features/finance/types/finance.types';

import type { BudgetCategory, Transaction, Bill, FinanceSummary } from '@/features/finance/types/finance.types';

export interface Budget {
  id: string;
  name: string;
  period: string;
  totalBudgeted: number;
  totalSpent: number;
  categories: BudgetCategory[];
}

export const mockTransactions: Transaction[] = [];
export const mockBudgets: Budget[] = [];
export const mockBills: Bill[] = [];
export const mockBudgetCategories: BudgetCategory[] = [];

export const expenseCategories = [
  'Food & Groceries',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Education',
  'Shopping',
  'Other',
];

export const incomeCategories = [
  'Salary',
  'Business',
  'Investments',
  'Rental',
  'Other',
];

export async function getTransactions(): Promise<Transaction[]> {
  return [];
}

export async function createTransaction(_data: Partial<Transaction>): Promise<Transaction> {
  throw new Error('API integration required');
}

export async function addTransaction(data: Omit<Transaction, 'id'>): Promise<Transaction> {
  return {
    id: String(Date.now()),
    ...data,
  };
}

export async function updateTransaction(_id: string, _data: Partial<Transaction>): Promise<Transaction> {
  throw new Error('API integration required');
}

export async function deleteTransaction(_id: string): Promise<void> {
  return;
}

export async function getBudgets(): Promise<Budget[]> {
  return [];
}

export async function createBudget(_data: Partial<Budget>): Promise<Budget> {
  throw new Error('API integration required');
}

export async function getBills(): Promise<Bill[]> {
  return [];
}

export async function createBill(_data: Partial<Bill>): Promise<Bill> {
  throw new Error('API integration required');
}

export async function markBillPaid(_id: string): Promise<Bill> {
  throw new Error('API integration required');
}

export async function markBillAsPaid(_id: string): Promise<Bill> {
  return markBillPaid(_id);
}

export async function getFinanceSummary(): Promise<FinanceSummary> {
  return {
    totalIncome: 0,
    totalExpenses: 0,
    totalBudget: 0,
    totalSpent: 0,
    savingsRate: 0,
    upcomingBills: 0,
  };
}
