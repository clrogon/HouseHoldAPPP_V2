import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FinanceSummaryCards } from '../components/FinanceSummaryCards';
import { BudgetOverview } from '../components/BudgetOverview';
import { TransactionList } from '../components/TransactionList';
import { BillsList } from '../components/BillsList';
import { AddTransactionDialog } from '../components/AddTransactionDialog';
import type {
  BudgetCategory,
  Transaction,
  Bill,
  FinanceSummary,
} from '../types/finance.types';
import {
  mockBudgetCategories,
  mockTransactions,
  mockBills,
  getFinanceSummary,
  addTransaction,
  markBillAsPaid,
} from '@/mocks/finance';

export function FinancePage() {
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [summaryData] = await Promise.all([
          getFinanceSummary(),
        ]);
        setBudgetCategories(mockBudgetCategories);
        setTransactions(
          [...mockTransactions].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
        setBills(
          [...mockBills].sort(
            (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )
        );
        setSummary(summaryData);
      } catch (error) {
        console.error('Failed to load finance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction = await addTransaction(transactionData);
    setTransactions(prev =>
      [newTransaction, ...prev].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
    // Refresh summary
    const newSummary = await getFinanceSummary();
    setSummary(newSummary);
  };

  const handleMarkBillPaid = async (billId: string) => {
    await markBillAsPaid(billId);
    setBills(prev =>
      prev.map(b => (b.id === billId ? { ...b, isPaid: true } : b))
    );
    // Refresh summary
    const newSummary = await getFinanceSummary();
    setSummary(newSummary);
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
