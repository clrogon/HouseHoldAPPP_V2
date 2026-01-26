import { useState, useEffect, useMemo } from 'react';
import { Search, ChefHat, Heart } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeDetails } from '../components/RecipeDetails';
import { AddRecipeDialog } from '../components/AddRecipeDialog';
import type { Recipe, MealPlan } from '../types/recipes.types';
import { recipesApi } from '@/shared/api';
import { mockMealPlans, toggleFavorite as toggleFavoriteApi } from '@/mocks/recipes';

export function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [_mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const data = await recipesApi.getRecipes();
        const mappedRecipes: Recipe[] = data.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description || '',
          category: (r.category?.toLowerCase() || 'dinner') as Recipe['category'],
          difficulty: 'medium' as Recipe['difficulty'],
          prepTime: r.prepTime || 0,
          cookTime: r.cookTime || 0,
          servings: r.servings || 4,
          ingredients: r.ingredients.map(i => ({
            name: i.name,
            amount: String(i.quantity),
            unit: i.unit,
          })),
          instructions: r.instructions.map(i => i.instruction),
          tags: r.tags || [],
          imageUrl: '',
          isFavorite: false,
          createdBy: r.creatorId,
          createdAt: r.createdAt,
        }));
        setRecipes(mappedRecipes);
        setMealPlans(mockMealPlans);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        setMealPlans(mockMealPlans);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch =
        !searchQuery ||
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        categoryFilter === 'all' || recipe.category === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === 'all' || recipe.difficulty === difficultyFilter;
      const matchesFavorite = !showFavoritesOnly || recipe.isFavorite;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesFavorite;
    });
  }, [recipes, searchQuery, categoryFilter, difficultyFilter, showFavoritesOnly]);

  const handleToggleFavorite = async (recipeId: string) => {
    const updated = await toggleFavoriteApi(recipeId);
    setRecipes(prev =>
      prev.map(r => (r.id === recipeId ? updated : r))
    );
    if (selectedRecipe?.id === recipeId) {
      setSelectedRecipe(updated);
    }
  };

  const handleAddRecipe = async (recipeData: Omit<Recipe, 'id'>) => {
    try {
      const created = await recipesApi.createRecipe({
        title: recipeData.title,
        description: recipeData.description,
        prepTime: recipeData.prepTime,
        cookTime: recipeData.cookTime,
        servings: recipeData.servings,
        category: recipeData.category,
        tags: recipeData.tags,
        ingredients: recipeData.ingredients.map((i, idx) => ({
          name: i.name,
          quantity: parseFloat(i.amount) || 1,
          unit: i.unit,
        })),
        instructions: recipeData.instructions.map((text, idx) => ({
          stepNumber: idx + 1,
          instruction: text,
        })),
      });
      const newRecipe: Recipe = {
        id: created.id,
        title: created.title,
        description: created.description || '',
        category: (created.category?.toLowerCase() || 'dinner') as Recipe['category'],
        difficulty: 'medium' as Recipe['difficulty'],
        prepTime: created.prepTime || 0,
        cookTime: created.cookTime || 0,
        servings: created.servings || 4,
        ingredients: created.ingredients.map(i => ({
          name: i.name,
          amount: String(i.quantity),
          unit: i.unit,
        })),
        instructions: created.instructions.map(i => i.instruction),
        tags: created.tags || [],
        imageUrl: '',
        isFavorite: false,
        createdBy: created.creatorId,
        createdAt: created.createdAt,
      };
      setRecipes(prev => [...prev, newRecipe]);
    } catch (error) {
      console.error('Failed to add recipe:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (selectedRecipe) {
    return (
      <RecipeDetails
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
          <p className="text-muted-foreground">
            Browse, save, and plan your household meals.
          </p>
        </div>
        <AddRecipeDialog onAddRecipe={handleAddRecipe} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="snack">Snack</SelectItem>
            <SelectItem value="dessert">Dessert</SelectItem>
            <SelectItem value="beverage">Beverage</SelectItem>
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showFavoritesOnly ? 'default' : 'outline'}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className="gap-2"
        >
          <Heart className={showFavoritesOnly ? 'fill-current' : ''} />
          Favorites
        </Button>
      </div>

      {/* Results */}
      {filteredRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
          <ChefHat className="h-12 w-12 mb-4" />
          <p className="text-lg">No recipes found</p>
          <p className="text-sm">Try adjusting your filters or add a new recipe</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSelect={setSelectedRecipe}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
