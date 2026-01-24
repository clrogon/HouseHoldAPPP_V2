import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionResponseDto,
  CreateBudgetDto,
  BudgetResponseDto,
} from './dto';
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
import { HouseholdGuard } from '../../common/guards';

@ApiTags('finance')
@ApiBearerAuth()
@UseGuards(HouseholdGuard)
@Controller('finance')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  // ============================================
  // TRANSACTIONS
  // ============================================

  @Post('transactions')
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created',
    type: TransactionResponseDto,
  })
  async createTransaction(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.financeService.createTransaction(
      user.householdId!,
      user.sub,
      dto,
    );
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'type', required: false, enum: ['INCOME', 'EXPENSE'] })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiResponse({
    status: 200,
    description: 'Transactions list',
    type: [TransactionResponseDto],
  })
  async getTransactions(
    @CurrentUser() user: JwtPayload,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<TransactionResponseDto[]> {
    return this.financeService.getTransactions(user.householdId!, {
      startDate,
      endDate,
      category,
      type,
      limit,
      offset,
    });
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Get a single transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
    type: TransactionResponseDto,
  })
  async getTransaction(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<TransactionResponseDto> {
    return this.financeService.getTransaction(user.householdId!, id);
  }

  @Patch('transactions/:id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated',
    type: TransactionResponseDto,
  })
  async updateTransaction(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.financeService.updateTransaction(user.householdId!, id, dto);
  }

  @Delete('transactions/:id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({ status: 200, description: 'Transaction deleted' })
  async deleteTransaction(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    return this.financeService.deleteTransaction(user.householdId!, id);
  }

  // ============================================
  // BUDGETS
  // ============================================

  @Post('budgets')
  @ApiOperation({ summary: 'Create a new budget' })
  @ApiResponse({
    status: 201,
    description: 'Budget created',
    type: BudgetResponseDto,
  })
  async createBudget(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateBudgetDto,
  ): Promise<BudgetResponseDto> {
    return this.financeService.createBudget(user.householdId!, user.sub, dto);
  }

  @Get('budgets')
  @ApiOperation({ summary: 'Get all budgets' })
  @ApiResponse({
    status: 200,
    description: 'Budgets list',
    type: [BudgetResponseDto],
  })
  async getBudgets(
    @CurrentUser() user: JwtPayload,
  ): Promise<BudgetResponseDto[]> {
    return this.financeService.getBudgets(user.householdId!);
  }

  @Get('budgets/:id')
  @ApiOperation({ summary: 'Get a single budget' })
  @ApiResponse({
    status: 200,
    description: 'Budget found',
    type: BudgetResponseDto,
  })
  async getBudget(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<BudgetResponseDto> {
    return this.financeService.getBudget(user.householdId!, id);
  }

  @Delete('budgets/:id')
  @ApiOperation({ summary: 'Delete a budget' })
  @ApiResponse({ status: 200, description: 'Budget deleted' })
  async deleteBudget(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    return this.financeService.deleteBudget(user.householdId!, id);
  }

  // ============================================
  // SUMMARY
  // ============================================

  @Get('summary')
  @ApiOperation({ summary: 'Get finance summary' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getSummary(
    @CurrentUser() user: JwtPayload,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.financeService.getFinanceSummary(
      user.householdId!,
      startDate,
      endDate,
    );
  }
}
