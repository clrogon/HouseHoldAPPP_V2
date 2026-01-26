import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { Household } from '@/mocks/household';

const householdSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  phone: z.string().max(20).optional(),
});

type HouseholdFormData = z.infer<typeof householdSchema>;

interface EditHouseholdDialogProps {
  household: Household;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (household: Household) => Promise<void>;
}

export function EditHouseholdDialog({
  household,
  open,
  onOpenChange,
  onSave,
}: EditHouseholdDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HouseholdFormData>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      name: household.name,
      address: household.address || '',
      city: household.city || '',
      state: household.state || '',
      zipCode: household.zipCode || '',
      phone: household.phone || '',
    },
  });

  // Reset form when household changes
  useEffect(() => {
    reset({
      name: household.name,
      address: household.address || '',
      city: household.city || '',
      state: household.state || '',
      zipCode: household.zipCode || '',
      phone: household.phone || '',
    });
  }, [household, reset]);

  const onSubmit = async (data: HouseholdFormData) => {
    setIsLoading(true);
    try {
      await onSave({
        ...household,
        name: data.name,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        zipCode: data.zipCode || undefined,
        phone: data.phone || undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update household:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Agregado Familiar</DialogTitle>
          <DialogDescription>
            Atualize as informações do seu agregado familiar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Agregado</Label>
            <Input
              id="name"
              placeholder="Digite o nome do agregado"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Morada</Label>
            <Input
              id="address"
              placeholder="Rua, número, andar"
              {...register('address')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="Ex: Luanda"
                {...register('city')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Província</Label>
              <Input
                id="state"
                placeholder="Ex: Luanda"
                {...register('state')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Código Postal</Label>
              <Input
                id="zipCode"
                placeholder="Ex: 1000"
                {...register('zipCode')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="Ex: +244 923 456 789"
                {...register('phone')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Alterações'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
