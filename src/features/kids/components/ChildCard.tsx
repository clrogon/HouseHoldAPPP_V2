import { Calendar, BookOpen, Heart, MoreHorizontal, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { Child, Homework, ChildAppointment, ChildChore } from '../types/kids.types';

interface ChildCardProps {
  child: Child;
  homework: Homework[];
  appointments: ChildAppointment[];
  chores: ChildChore[];
  onSelect: (child: Child) => void;
  onEdit: (child: Child) => void;
  onDelete: (child: Child) => void;
}

export function ChildCard({
  child,
  homework,
  appointments,
  chores,
  onSelect,
  onEdit,
  onDelete,
}: ChildCardProps) {
  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const now = new Date();
    const years = Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return years;
  };

  const age = calculateAge(child.dateOfBirth);
  const initials = `${child.firstName[0]}${child.lastName[0]}`.toUpperCase();

  const pendingHomework = homework.filter(h => h.status !== 'COMPLETED');
  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
  const incompletedChores = chores.filter(c => !c.completed);

  const hasAlerts = pendingHomework.length > 0 || child.allergies.length > 0 || child.medicalConditions.length > 0;

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(child)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={child.photo} alt={child.firstName} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
          </div>
          {hasAlerts && (
            <div className="absolute top-2 left-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(child); }}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(child); }}
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg">
              {child.firstName} {child.lastName}
            </h3>
            {child.nickname && (
              <p className="text-sm text-muted-foreground">"{child.nickname}"</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {age} years old
            </Badge>
            {child.gender && (
              <Badge variant="outline">
                {child.gender.charAt(0).toUpperCase() + child.gender.slice(1)}
              </Badge>
            )}
          </div>

          {(child.allergies.length > 0 || child.medicalConditions.length > 0) && (
            <div className="flex flex-wrap gap-1">
              {child.allergies.map((allergy, i) => (
                <Badge key={i} variant="destructive" className="text-xs">
                  {allergy}
                </Badge>
              ))}
              {child.medicalConditions.map((condition, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {condition}
                </Badge>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 pt-2 border-t text-center text-xs">
            <div className="flex flex-col items-center gap-1">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{pendingHomework.length}</span>
              <span className="text-muted-foreground">Homework</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="font-medium">{upcomingAppointments.length}</span>
              <span className="text-muted-foreground">Appointments</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Heart className="h-4 w-4 text-green-500" />
              <span className="font-medium">{incompletedChores.length}</span>
              <span className="text-muted-foreground">Chores</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
