import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RecipeIngredientDto {
  @ApiProperty({ example: 'Flour' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'cups' })
  @IsString()
  unit: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RecipeInstructionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  stepNumber: number;

  @ApiProperty({ example: 'Preheat oven to 350°F' })
  @IsString()
  instruction: string;
}

export class CreateRecipeDto {
  @ApiProperty({ example: 'Chocolate Cake' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  prepTime?: number;

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsNumber()
  cookTime?: number;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @IsNumber()
  servings?: number;

  @ApiPropertyOptional({ example: 'Desserts' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ type: [RecipeIngredientDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients: RecipeIngredientDto[];

  @ApiProperty({ type: [RecipeInstructionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeInstructionDto)
  instructions: RecipeInstructionDto[];
}
