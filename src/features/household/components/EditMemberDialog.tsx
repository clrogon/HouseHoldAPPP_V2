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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { HouseholdMember } from '@/mocks/household';

const memberSchema = z.object({
  firstName: z.string().min(1, 'Primeiro nome é obrigatório').max(50),
  lastName: z.string().min(1, 'Último nome é obrigatório').max(50),
  phone: z.string().max(20).optional(),
  role: z.enum(['ADMIN', 'PARENT', 'MEMBER', 'STAFF']),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface EditMemberDialogProps {
  member: HouseholdMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (member: HouseholdMember) => Promise<void>;
}

export function EditMemberDialog({
  member,
  open,
  onOpenChange,
  onSave,
}: EditMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: member.firstName,
      lastName: member.lastName,
      phone: member.phone || '',
      role: member.role,
    },
  });

  const role = watch('role');

  // Reset form when member changes
  useEffect(() => {
    reset({
      firstName: member.firstName,
      lastName: member.lastName,
      phone: member.phone || '',
      role: member.role,
    });
  }, [member, reset]);

  const onSubmit = async (data: MemberFormData) => {
    setIsLoading(true);
    try {
      await onSave({
        ...member,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        role: data.role,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Editar Membro</DialogTitle>
          <DialogDescription>
            Atualize as informações do membro do agregado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Primeiro Nome</Label>
              <Input
                id="firstName"
                placeholder="Primeiro nome"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Último Nome</Label>
              <Input
                id="lastName"
                placeholder="Último nome"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="Ex: +244 923 456 789"
              {...register('phone')}
            />
          </div>

          <div className="space-y-2">
            <Label>Função</Label>
            <Select
              value={role}
              onValueChange={(value) => setValue('role', value as MemberFormData['role'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="PARENT">Responsável</SelectItem>
                <SelectItem value="MEMBER">Membro</SelectItem>
                <SelectItem value="STAFF">Funcionário</SelectItem>
              </SelectContent>
            </Select>
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
