import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  category: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  date: string;

  @ApiPropertyOptional()
  paymentMethod?: string;

  @ApiProperty()
  isRecurring: boolean;

  @ApiPropertyOptional()
  recurrence?: string;

  @ApiPropertyOptional()
  receiptUrl?: string;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  householdId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
