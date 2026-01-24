import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  icon?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiProperty()
  order: number;

  @ApiPropertyOptional()
  parentId?: string;

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  householdId: string;

  @ApiProperty()
  createdAt: string;
}
