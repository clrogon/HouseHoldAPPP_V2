import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import type { Recipe, Ingredient } from '../types/recipes.types';

const recipeSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100),
  description: z.string().min(1, 'Descrição é obrigatória').max(500),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage']),
  cuisine: z.string().max(50).optional(),
  prepTime: z.number().min(0, 'Tempo de preparação deve ser positivo'),
  cookTime: z.number().min(0, 'Tempo de cozedura deve ser positivo'),
  servings: z.number().min(1, 'Porções deve ser pelo menos 1'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface AddRecipeDialogProps {
  onAddRecipe: (recipe: Omit<Recipe, 'id'>) => Promise<void>;
}

export function AddRecipeDialog({ onAddRecipe }: AddRecipeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', amount: '', unit: '' }]);
  const [instructions, setInstructions] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'dinner',
      cuisine: '',
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: 'medium',
    },
  });

  const category = watch('category');
  const difficulty = watch('difficulty');

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const onSubmit = async (data: RecipeFormData) => {
    // Filter out empty ingredients and instructions
    const validIngredients = ingredients.filter(i => i.name.trim() !== '');
    const validInstructions = instructions.filter(i => i.trim() !== '');

    if (validIngredients.length === 0) {
      alert('Adicione pelo menos um ingrediente');
      return;
    }

    if (validInstructions.length === 0) {
      alert('Adicione pelo menos uma instrução');
      return;
    }

    setIsLoading(true);
    try {
      await onAddRecipe({
        ...data,
        cuisine: data.cuisine || undefined,
        ingredients: validIngredients,
        instructions: validInstructions,
        tags: [],
        isFavorite: false,
        createdBy: 'Current User',
        householdId: '1',
      });
      reset();
      setIngredients([{ name: '', amount: '', unit: '' }]);
      setInstructions(['']);
      setOpen(false);
    } catch (error) {
      console.error('Failed to add recipe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Receita
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Adicionar Receita</DialogTitle>
          <DialogDescription>
            Crie uma nova receita para o seu livro de receitas.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ex: Arroz de Pato"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Uma breve descrição da receita"
                rows={2}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setValue('category', value as RecipeFormData['category'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Pequeno-almoço</SelectItem>
                    <SelectItem value="lunch">Almoço</SelectItem>
                    <SelectItem value="dinner">Jantar</SelectItem>
                    <SelectItem value="snack">Lanche</SelectItem>
                    <SelectItem value="dessert">Sobremesa</SelectItem>
                    <SelectItem value="beverage">Bebida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dificuldade</Label>
                <Select
                  value={difficulty}
                  onValueChange={(value) => setValue('difficulty', value as RecipeFormData['difficulty'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prepTime">Preparação (min)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  min="0"
                  {...register('prepTime', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cookTime">Cozedura (min)</Label>
                <Input
                  id="cookTime"
                  type="number"
                  min="0"
                  {...register('cookTime', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servings">Porções</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  {...register('servings', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisine">Culinária (opcional)</Label>
              <Input
                id="cuisine"
                placeholder="Ex: Angolana, Portuguesa, Italiana"
                {...register('cuisine')}
              />
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Ingredientes</Label>
                <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Quantidade"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                      className="w-20"
                    />
                    <Input
                      placeholder="Unidade"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                      className="w-20"
                    />
                    <Input
                      placeholder="Ingrediente"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                      disabled={ingredients.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Instruções</Label>
                <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-2">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <span className="text-sm font-medium text-muted-foreground mt-2 w-6">
                      {index + 1}.
                    </span>
                    <Textarea
                      placeholder={`Passo ${index + 1}`}
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      rows={2}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInstruction(index)}
                      disabled={instructions.length === 1}
                      className="mt-1"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  'Adicionar Receita'
                )}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
