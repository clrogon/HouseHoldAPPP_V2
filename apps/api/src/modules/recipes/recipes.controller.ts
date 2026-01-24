import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto, UpdateRecipeDto, RecipeResponseDto } from './dto';
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
import { HouseholdGuard } from '../../common/guards';

@ApiTags('recipes')
@ApiBearerAuth()
@UseGuards(HouseholdGuard)
@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Post()
  @ApiOperation({ summary: 'Create recipe' })
  @ApiResponse({ status: 201, type: RecipeResponseDto })
  async createRecipe(@CurrentUser() user: JwtPayload, @Body() dto: CreateRecipeDto): Promise<RecipeResponseDto> {
    return this.recipesService.createRecipe(user.householdId!, user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all recipes' })
  @ApiQuery({ name: 'category', required: false })
  @ApiResponse({ status: 200, type: [RecipeResponseDto] })
  async getRecipes(@CurrentUser() user: JwtPayload, @Query('category') category?: string): Promise<RecipeResponseDto[]> {
    return this.recipesService.getRecipes(user.householdId!, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recipe' })
  @ApiResponse({ status: 200, type: RecipeResponseDto })
  async getRecipe(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<RecipeResponseDto> {
    return this.recipesService.getRecipe(user.householdId!, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update recipe' })
  @ApiResponse({ status: 200, type: RecipeResponseDto })
  async updateRecipe(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateRecipeDto): Promise<RecipeResponseDto> {
    return this.recipesService.updateRecipe(user.householdId!, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete recipe' })
  async deleteRecipe(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<{ success: boolean }> {
    return this.recipesService.deleteRecipe(user.householdId!, id);
  }
}
