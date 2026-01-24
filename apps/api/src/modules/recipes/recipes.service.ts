import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRecipeDto, UpdateRecipeDto, RecipeResponseDto } from './dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async createRecipe(householdId: string, userId: string, dto: CreateRecipeDto): Promise<RecipeResponseDto> {
    const recipe = await this.prisma.recipe.create({
      data: {
        name: dto.title,
        description: dto.description,
        prepTime: dto.prepTime,
        cookTime: dto.cookTime,
        servings: dto.servings,
        difficulty: dto.category,
        tags: dto.tags || [],
        creatorId: userId,
        householdId,
        ingredients: {
          create: dto.ingredients.map((i, index) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
            order: index + 1,
          })),
        },
        instructions: {
          create: dto.instructions.map((i) => ({
            stepNumber: i.stepNumber,
            text: i.instruction,
          })),
        },
      },
      include: { ingredients: true, instructions: true },
    });
    return this.mapRecipe(recipe);
  }

  async getRecipes(householdId: string, category?: string): Promise<RecipeResponseDto[]> {
    const where: any = { householdId };
    if (category) where.difficulty = category;

    const recipes = await this.prisma.recipe.findMany({
      where,
      include: { ingredients: { orderBy: { order: 'asc' } }, instructions: { orderBy: { stepNumber: 'asc' } } },
      orderBy: { name: 'asc' },
    });
    return recipes.map((r) => this.mapRecipe(r));
  }

  async getRecipe(householdId: string, recipeId: string): Promise<RecipeResponseDto> {
    const recipe = await this.prisma.recipe.findFirst({
      where: { id: recipeId, householdId },
      include: { ingredients: { orderBy: { order: 'asc' } }, instructions: { orderBy: { stepNumber: 'asc' } } },
    });
    if (!recipe) throw new NotFoundException('Recipe not found');
    return this.mapRecipe(recipe);
  }

  async updateRecipe(householdId: string, recipeId: string, dto: UpdateRecipeDto): Promise<RecipeResponseDto> {
    const existing = await this.prisma.recipe.findFirst({ where: { id: recipeId, householdId } });
    if (!existing) throw new NotFoundException('Recipe not found');

    // Delete existing ingredients and instructions, then recreate
    await this.prisma.$transaction([
      this.prisma.recipeIngredient.deleteMany({ where: { recipeId } }),
      this.prisma.recipeInstruction.deleteMany({ where: { recipeId } }),
    ]);

    const recipe = await this.prisma.recipe.update({
      where: { id: recipeId },
      data: {
        name: dto.title,
        description: dto.description,
        prepTime: dto.prepTime,
        cookTime: dto.cookTime,
        servings: dto.servings,
        difficulty: dto.category,
        tags: dto.tags,
        ingredients: dto.ingredients ? {
          create: dto.ingredients.map((i, index) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
            order: index + 1,
          })),
        } : undefined,
        instructions: dto.instructions ? {
          create: dto.instructions.map((i) => ({
            stepNumber: i.stepNumber,
            text: i.instruction,
          })),
        } : undefined,
      },
      include: { ingredients: { orderBy: { order: 'asc' } }, instructions: { orderBy: { stepNumber: 'asc' } } },
    });
    return this.mapRecipe(recipe);
  }

  async deleteRecipe(householdId: string, recipeId: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.recipe.findFirst({ where: { id: recipeId, householdId } });
    if (!existing) throw new NotFoundException('Recipe not found');
    await this.prisma.recipe.delete({ where: { id: recipeId } });
    return { success: true };
  }

  private mapRecipe(recipe: any): RecipeResponseDto {
    return {
      id: recipe.id,
      title: recipe.name,
      description: recipe.description || undefined,
      prepTime: recipe.prepTime || undefined,
      cookTime: recipe.cookTime || undefined,
      servings: recipe.servings || undefined,
      category: recipe.difficulty || undefined,
      tags: recipe.tags || [],
      ingredients: (recipe.ingredients || []).map((i: any) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
      })),
      instructions: (recipe.instructions || []).map((i: any) => ({
        id: i.id,
        stepNumber: i.stepNumber,
        instruction: i.text,
      })),
      creatorId: recipe.creatorId,
      householdId: recipe.householdId,
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
    };
  }
}
