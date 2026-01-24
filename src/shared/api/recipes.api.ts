import apiClient, { getApiErrorMessage } from './client';

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeInstruction {
  id: string;
  stepNumber: number;
  instruction: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  category?: string;
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  creatorId: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIngredientData {
  name: string;
  quantity: number;
  unit: string;
}

export interface CreateInstructionData {
  stepNumber: number;
  instruction: string;
}

export interface CreateRecipeData {
  title: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  category?: string;
  tags?: string[];
  ingredients: CreateIngredientData[];
  instructions: CreateInstructionData[];
}

export const recipesApi = {
  async createRecipe(data: CreateRecipeData): Promise<Recipe> {
    try {
      const response = await apiClient.post<Recipe>('/recipes', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getRecipes(category?: string): Promise<Recipe[]> {
    try {
      const params = category ? `?category=${category}` : '';
      const response = await apiClient.get<Recipe[]>(`/recipes${params}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getRecipe(id: string): Promise<Recipe> {
    try {
      const response = await apiClient.get<Recipe>(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateRecipe(id: string, data: Partial<CreateRecipeData>): Promise<Recipe> {
    try {
      const response = await apiClient.patch<Recipe>(`/recipes/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async deleteRecipe(id: string): Promise<void> {
    try {
      await apiClient.delete(`/recipes/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export default recipesApi;
