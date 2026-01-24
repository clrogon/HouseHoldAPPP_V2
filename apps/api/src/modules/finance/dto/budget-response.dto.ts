import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BudgetCategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  budgeted: number;

  @ApiProperty()
  spent: number;
}

export class BudgetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  period: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty({ type: [BudgetCategoryResponseDto] })
  categories: BudgetCategoryResponseDto[];

  @ApiProperty()
  totalBudgeted: number;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  householdId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
