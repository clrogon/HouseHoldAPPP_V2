import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum BudgetPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

export class BudgetCategoryDto {
  @ApiProperty({ example: 'Groceries' })
  @IsString()
  name: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  budgeted: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  spent?: number;
}

export class CreateBudgetDto {
  @ApiProperty({ example: 'January Budget' })
  @IsString()
  name: string;

  @ApiProperty({ enum: BudgetPeriod })
  @IsEnum(BudgetPeriod)
  period: BudgetPeriod;

  @ApiProperty({ example: '2026-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-01-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ type: [BudgetCategoryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetCategoryDto)
  categories: BudgetCategoryDto[];

  @ApiProperty({ example: 3000 })
  @IsNumber()
  totalBudgeted: number;
}
