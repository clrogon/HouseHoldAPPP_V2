import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  purchaseDate?: string;

  @ApiPropertyOptional()
  purchasePrice?: number;

  @ApiPropertyOptional()
  expiryDate?: string;

  @ApiPropertyOptional()
  lowStockThreshold?: number;

  @ApiPropertyOptional()
  barcode?: string;

  @ApiProperty()
  categoryId: string;

  @ApiPropertyOptional()
  categoryName?: string;

  @ApiProperty()
  onShoppingList: boolean;

  @ApiProperty()
  householdId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
