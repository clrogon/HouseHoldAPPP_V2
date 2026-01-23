// Stub file - API integration pending

// Re-export types from features for compatibility
export type { Recipe, Ingredient, MealPlan } from '@/features/recipes/types/recipes.types';

import type { Recipe, MealPlan } from '@/features/recipes/types/recipes.types';

export const mockRecipes: Recipe[] = [];
export const mockMealPlans: MealPlan[] = [];

export const recipeTags = [
  'breakfast',
  'lunch',
  'dinner',
  'dessert',
  'snack',
  'vegetarian',
  'quick',
  'traditional',
];

export async function getRecipes(): Promise<Recipe[]> {
  return [];
}

export async function getRecipeById(_id: string): Promise<Recipe | null> {
  return null;
}

export async function createRecipe(_data: Partial<Recipe>): Promise<Recipe> {
  throw new Error('API integration required');
}

export async function addRecipe(data: Omit<Recipe, 'id'>): Promise<Recipe> {
  return {
    id: String(Date.now()),
    ...data,
  };
}

export async function updateRecipe(_id: string, _data: Partial<Recipe>): Promise<Recipe> {
  throw new Error('API integration required');
}

export async function deleteRecipe(_id: string): Promise<void> {
  return;
}

export async function toggleFavorite(_id: string): Promise<Recipe> {
  throw new Error('API integration required');
}
