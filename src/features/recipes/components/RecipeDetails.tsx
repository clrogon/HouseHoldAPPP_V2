import {
  Clock,
  Users,
  Star,
  Heart,
  ChefHat,
  ArrowLeft,
  Flame,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { cn } from '@/shared/lib/utils';
import type { Recipe } from '../types/recipes.types';

interface RecipeDetailsProps {
  recipe: Recipe;
  onBack: () => void;
  onToggleFavorite: (recipeId: string) => void;
}

export function RecipeDetails({ recipe, onBack, onToggleFavorite }: RecipeDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Recipes
        </Button>
        <Button
          variant="outline"
          onClick={() => onToggleFavorite(recipe.id)}
          className="gap-2"
        >
          <Heart
            className={cn(
              'h-4 w-4',
              recipe.isFavorite ? 'fill-red-500 text-red-500' : ''
            )}
          />
          {recipe.isFavorite ? 'Favorited' : 'Add to Favorites'}
        </Button>
      </div>

      {/* Header */}
      <div className="flex gap-6">
        <div className="w-80 h-60 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
          <ChefHat className="h-20 w-20 text-primary/40" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-3xl font-bold">{recipe.title}</h1>
            {recipe.rating && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-lg font-medium">{recipe.rating}</span>
              </div>
            )}
          </div>

          <p className="text-muted-foreground mb-4">{recipe.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="capitalize">{recipe.category}</Badge>
            <Badge variant="outline" className="capitalize">{recipe.difficulty}</Badge>
            {recipe.cuisine && <Badge variant="secondary">{recipe.cuisine}</Badge>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Prep Time</p>
              <p className="font-semibold">{recipe.prepTime} min</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Flame className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Cook Time</p>
              <p className="font-semibold">{recipe.cookTime} min</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Servings</p>
              <p className="font-semibold">{recipe.servings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Checkbox id={`ingredient-${index}`} />
                  <label
                    htmlFor={`ingredient-${index}`}
                    className="text-sm cursor-pointer"
                  >
                    <span className="font-medium">
                      {ingredient.amount} {ingredient.unit}
                    </span>{' '}
                    {ingredient.name}
                    {ingredient.notes && (
                      <span className="text-muted-foreground">
                        {' '}({ingredient.notes})
                      </span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-sm pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Nutrition */}
      {recipe.nutrition && (
        <Card>
          <CardHeader>
            <CardTitle>Nutrition (per serving)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{recipe.nutrition.calories}</p>
                <p className="text-sm text-muted-foreground">Calories</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{recipe.nutrition.protein}g</p>
                <p className="text-sm text-muted-foreground">Protein</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{recipe.nutrition.carbs}g</p>
                <p className="text-sm text-muted-foreground">Carbs</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{recipe.nutrition.fat}g</p>
                <p className="text-sm text-muted-foreground">Fat</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tags:</span>
          {recipe.tags.map(tag => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
