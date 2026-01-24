import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IngredientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit: string;
}

export class InstructionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  stepNumber: number;

  @ApiProperty()
  instruction: string;
}

export class RecipeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  prepTime?: number;

  @ApiPropertyOptional()
  cookTime?: number;

  @ApiPropertyOptional()
  servings?: number;

  @ApiPropertyOptional()
  category?: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty({ type: [IngredientResponseDto] })
  ingredients: IngredientResponseDto[];

  @ApiProperty({ type: [InstructionResponseDto] })
  instructions: InstructionResponseDto[];

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  householdId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
