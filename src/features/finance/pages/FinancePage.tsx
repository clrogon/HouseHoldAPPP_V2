import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FinanceSummaryCards } from '../components/FinanceSummaryCards';
import { BudgetOverview } from '../components/BudgetOverview';
import { TransactionList } from '../components/TransactionList';
import { BillsList } from '../components/BillsList';
import { AddTransactionDialog } from '../components/AddTransactionDialog';
import { useToast } from '@/shared/hooks/use-toast';
import { financeApi } from '@/shared/api';
import type {
  BudgetCategory,
  Transaction,
  Bill,
  FinanceSummary,
} from '../types/finance.types';
import {
  mockBudgetCategories,
  mockBills,
} from '@/mocks/finance';

export function FinancePage() {
  const { toast } = useToast();
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load transactions and summary from real API
      const [transactionsData, summaryData] = await Promise.all([
        financeApi.getTransactions(),
        financeApi.getSummary(),
      ]);

      // Map API transactions to frontend format
      const mappedTransactions: Transaction[] = transactionsData.map((t) => ({
        id: t.id,
        type: t.type.toLowerCase() as 'income' | 'expense',
        amount: t.amount,
        category: t.category,
        description: t.description || '',
        date: t.date.split('T')[0], // Convert ISO to YYYY-MM-DD
        paymentMethod: t.paymentMethod,
        isRecurring: t.isRecurring,
      }));

      setTransactions(
        mappedTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );

      setSummary({
        totalIncome: summaryData.totalIncome,
        totalExpenses: summaryData.totalExpenses,
        balance: summaryData.balance,
        budgetRemaining: 0, // Will calculate from budgets later
        upcomingBills: mockBills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0),
      });

      // Still use mocks for budget categories and bills (no backend yet)
      setBudgetCategories(mockBudgetCategories);
      setBills(
        [...mockBills].sort(
          (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )
      );
    } catch (error) {
      console.error('Failed to load finance data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load finance data',
        variant: 'destructive',
      });
      // Fall back to empty data
      setTransactions([]);
      setSummary({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        budgetRemaining: 0,
        upcomingBills: 0,
      });
      setBudgetCategories(mockBudgetCategories);
      setBills(mockBills);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      // Create transaction via API
      const newTransaction = await financeApi.createTransaction({
        type: transactionData.type.toUpperCase() as 'INCOME' | 'EXPENSE',
        amount: transactionData.amount,
        category: transactionData.category,
        description: transactionData.description,
        date: transactionData.date,
        paymentMethod: transactionData.paymentMethod,
        isRecurring: transactionData.isRecurring,
      });

      // Map to frontend format and add to state
      const mappedTransaction: Transaction = {
        id: newTransaction.id,
        type: newTransaction.type.toLowerCase() as 'income' | 'expense',
        amount: newTransaction.amount,
        category: newTransaction.category,
        description: newTransaction.description || '',
        date: newTransaction.date.split('T')[0],
        paymentMethod: newTransaction.paymentMethod,
        isRecurring: newTransaction.isRecurring,
      };

      setTransactions(prev =>
        [mappedTransaction, ...prev].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );

      // Refresh summary from API
      const newSummary = await financeApi.getSummary();
      setSummary(prev => prev ? {
        ...prev,
        totalIncome: newSummary.totalIncome,
        totalExpenses: newSummary.totalExpenses,
        balance: newSummary.balance,
      } : null);

      toast({
        title: 'Transaction added',
        description: `${transactionData.type === 'income' ? 'Income' : 'Expense'} of ${transactionData.amount} saved successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add transaction',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleMarkBillPaid = async (billId: string) => {
    // Bills still use mock (no backend endpoint yet)
    setBills(prev =>
      prev.map(b => (b.id === billId ? { ...b, isPaid: true } : b))
    );
  };

  if (isLoading || !summary) {
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
          <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
          <p className="text-muted-foreground">
            Track your household budget, expenses, and bills.
          </p>
        </div>
        <AddTransactionDialog onAddTransaction={handleAddTransaction} />
      </div>

      {/* Summary Cards */}
      <FinanceSummaryCards summary={summary} />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Budget Overview */}
        <BudgetOverview categories={budgetCategories} />

        {/* Bills */}
        <BillsList bills={bills} onMarkPaid={handleMarkBillPaid} />
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
