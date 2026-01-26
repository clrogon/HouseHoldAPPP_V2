import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Groceries' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 'Weekly grocery shopping' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-01-24' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Credit Card' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({ example: 'monthly' })
  @IsOptional()
  @IsString()
  recurrence?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiptUrl?: string;
}
