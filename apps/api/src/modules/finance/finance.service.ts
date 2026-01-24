import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionResponseDto,
  CreateBudgetDto,
  BudgetResponseDto,
} from './dto';
import { TransactionType as PrismaTransactionType, BudgetPeriod as PrismaBudgetPeriod } from '@prisma/client';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // TRANSACTIONS
  // ============================================

  async createTransaction(
    householdId: string,
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.create({
      data: {
        type: dto.type as PrismaTransactionType,
        amount: dto.amount,
        category: dto.category,
        description: dto.description,
        date: new Date(dto.date),
        paymentMethod: dto.paymentMethod,
        isRecurring: dto.isRecurring || false,
        recurrence: dto.recurrence,
        receiptUrl: dto.receiptUrl,
        creatorId: userId,
        householdId,
      },
    });

    return this.mapTransaction(transaction);
  }

  async getTransactions(
    householdId: string,
    options?: {
      startDate?: string;
      endDate?: string;
      category?: string;
      type?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<TransactionResponseDto[]> {
    const where: any = { householdId };

    if (options?.startDate || options?.endDate) {
      where.date = {};
      if (options.startDate) {
        where.date.gte = new Date(options.startDate);
      }
      if (options.endDate) {
        where.date.lte = new Date(options.endDate);
      }
    }

    if (options?.category) {
      where.category = options.category;
    }

    if (options?.type) {
      where.type = options.type;
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      take: options?.limit || 100,
      skip: options?.offset || 0,
    });

    return transactions.map((t) => this.mapTransaction(t));
  }

  async getTransaction(
    householdId: string,
    transactionId: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id: transactionId, householdId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.mapTransaction(transaction);
  }

  async updateTransaction(
    householdId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const existing = await this.prisma.transaction.findFirst({
      where: { id: transactionId, householdId },
    });

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    const transaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        type: dto.type as PrismaTransactionType | undefined,
        amount: dto.amount,
        category: dto.category,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : undefined,
        paymentMethod: dto.paymentMethod,
        isRecurring: dto.isRecurring,
        recurrence: dto.recurrence,
        receiptUrl: dto.receiptUrl,
      },
    });

    return this.mapTransaction(transaction);
  }

  async deleteTransaction(
    householdId: string,
    transactionId: string,
  ): Promise<{ success: boolean }> {
    const existing = await this.prisma.transaction.findFirst({
      where: { id: transactionId, householdId },
    });

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    await this.prisma.transaction.delete({
      where: { id: transactionId },
    });

    return { success: true };
  }

  // ============================================
  // BUDGETS
  // ============================================

  async createBudget(
    householdId: string,
    userId: string,
    dto: CreateBudgetDto,
  ): Promise<BudgetResponseDto> {
    const budget = await this.prisma.budget.create({
      data: {
        name: dto.name,
        period: dto.period as PrismaBudgetPeriod,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        totalBudgeted: dto.totalBudgeted,
        creatorId: userId,
        householdId,
        categories: {
          create: dto.categories.map((cat) => ({
            name: cat.name,
            budgeted: cat.budgeted,
            spent: cat.spent || 0,
          })),
        },
      },
      include: {
        categories: true,
      },
    });

    return this.mapBudget(budget);
  }

  async getBudgets(householdId: string): Promise<BudgetResponseDto[]> {
    const budgets = await this.prisma.budget.findMany({
      where: { householdId },
      include: { categories: true },
      orderBy: { startDate: 'desc' },
    });

    return budgets.map((b) => this.mapBudget(b));
  }

  async getBudget(
    householdId: string,
    budgetId: string,
  ): Promise<BudgetResponseDto> {
    const budget = await this.prisma.budget.findFirst({
      where: { id: budgetId, householdId },
      include: { categories: true },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return this.mapBudget(budget);
  }

  async deleteBudget(
    householdId: string,
    budgetId: string,
  ): Promise<{ success: boolean }> {
    const existing = await this.prisma.budget.findFirst({
      where: { id: budgetId, householdId },
    });

    if (!existing) {
      throw new NotFoundException('Budget not found');
    }

    await this.prisma.budget.delete({
      where: { id: budgetId },
    });

    return { success: true };
  }

  // ============================================
  // SUMMARY / STATS
  // ============================================

  async getFinanceSummary(
    householdId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const [income, expenses] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          householdId,
          type: 'INCOME',
          ...(startDate || endDate ? { date: dateFilter } : {}),
        },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          householdId,
          type: 'EXPENSE',
          ...(startDate || endDate ? { date: dateFilter } : {}),
        },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = income._sum.amount || 0;
    const totalExpenses = expenses._sum.amount || 0;

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  }

  // ============================================
  // HELPERS
  // ============================================

  private mapTransaction(transaction: any): TransactionResponseDto {
    return {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || undefined,
      date: transaction.date.toISOString(),
      paymentMethod: transaction.paymentMethod || undefined,
      isRecurring: transaction.isRecurring,
      recurrence: transaction.recurrence || undefined,
      receiptUrl: transaction.receiptUrl || undefined,
      creatorId: transaction.creatorId,
      householdId: transaction.householdId,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }

  private mapBudget(budget: any): BudgetResponseDto {
    return {
      id: budget.id,
      name: budget.name,
      period: budget.period,
      startDate: budget.startDate.toISOString(),
      endDate: budget.endDate.toISOString(),
      categories: budget.categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        budgeted: cat.budgeted,
        spent: cat.spent,
      })),
      totalBudgeted: budget.totalBudgeted,
      creatorId: budget.creatorId,
      householdId: budget.householdId,
      createdAt: budget.createdAt.toISOString(),
      updatedAt: budget.updatedAt.toISOString(),
    };
  }
}
