import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import type { Child } from '../types/kids.types';

const childSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  nickname: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  bloodType: z.string().optional(),
});

type ChildFormData = z.infer<typeof childSchema>;

interface EditChildDialogProps {
  child: Child;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (child: Child) => Promise<void>;
}

export function EditChildDialog({ child, open, onOpenChange, onSave }: EditChildDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [allergies, setAllergies] = useState<string[]>(child.allergies || []);
  const [medicalConditions, setMedicalConditions] = useState<string[]>(child.medicalConditions || []);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ChildFormData>({
    resolver: zodResolver(childSchema),
    defaultValues: {
      firstName: child.firstName,
      lastName: child.lastName,
      nickname: child.nickname || '',
      dateOfBirth: child.dateOfBirth,
      gender: child.gender,
      bloodType: child.bloodType || '',
    },
  });

  const gender = watch('gender');

  // Reset form when child changes
  useEffect(() => {
    reset({
      firstName: child.firstName,
      lastName: child.lastName,
      nickname: child.nickname || '',
      dateOfBirth: child.dateOfBirth,
      gender: child.gender,
      bloodType: child.bloodType || '',
    });
    setAllergies(child.allergies || []);
    setMedicalConditions(child.medicalConditions || []);
  }, [child, reset]);

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setAllergies(allergies.filter(a => a !== allergy));
  };

  const handleAddCondition = () => {
    if (newCondition.trim() && !medicalConditions.includes(newCondition.trim())) {
      setMedicalConditions([...medicalConditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (condition: string) => {
    setMedicalConditions(medicalConditions.filter(c => c !== condition));
  };

  const onSubmit = async (data: ChildFormData) => {
    setIsLoading(true);
    try {
      await onSave({
        ...child,
        ...data,
        allergies,
        medicalConditions,
        updatedAt: new Date().toISOString(),
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update child:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Criança</DialogTitle>
          <DialogDescription>
            Atualize as informações da criança.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Primeiro Nome</Label>
              <Input id="firstName" placeholder="Digite o primeiro nome" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Último Nome</Label>
              <Input id="lastName" placeholder="Digite o último nome" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Apelido</Label>
              <Input id="nickname" placeholder="Opcional" {...register('nickname')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
              <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Género</Label>
              <Select value={gender} onValueChange={(v) => setValue('gender', v as 'male' | 'female' | 'other')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
              <Input id="bloodType" placeholder="ex: A+" {...register('bloodType')} />
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <Label>Alergias</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Adicionar alergia"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAllergy();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddAllergy}>
                Adicionar
              </Button>
            </div>
            {allergies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive" className="gap-1">
                    {allergy}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveAllergy(allergy)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Medical Conditions */}
          <div className="space-y-2">
            <Label>Condições Médicas</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Adicionar condição"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCondition();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddCondition}>
                Adicionar
              </Button>
            </div>
            {medicalConditions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {medicalConditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="gap-1">
                    {condition}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveCondition(condition)}
                    />
                  </Badge>
                ))}
              </div>
            )}
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
