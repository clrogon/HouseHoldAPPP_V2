import {
  Mail,
  Phone,
  Clock,
  Banknote,
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/currency';
import type { Employee } from '../types/employees.types';

interface EmployeeCardProps {
  employee: Employee;
  onSelect: (employee: Employee) => void;
}

const departmentLabels: Record<Employee['department'], string> = {
  household: 'Household',
  childcare: 'Childcare',
  maintenance: 'Maintenance',
  security: 'Security',
  other: 'Other',
};

const departmentColors: Record<Employee['department'], string> = {
  household: 'bg-blue-100 text-blue-700',
  childcare: 'bg-pink-100 text-pink-700',
  maintenance: 'bg-green-100 text-green-700',
  security: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700',
};

const statusColors: Record<Employee['status'], string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  'on-leave': 'bg-yellow-100 text-yellow-700',
};

export function EmployeeCard({ employee, onSelect }: EmployeeCardProps) {
  const getScheduleSummary = () => {
    if (!employee.schedule || employee.schedule.length === 0) return 'No schedule set';
    const days = employee.schedule.map(s =>
      s.dayOfWeek.charAt(0).toUpperCase() + s.dayOfWeek.slice(1, 3)
    );
    return days.join(', ');
  };

  const getPayInfo = () => {
    if (employee.salary) {
      return `${formatCurrency(employee.salary)}/ano`;
    }
    if (employee.hourlyRate) {
      return `${formatCurrency(employee.hourlyRate)}/hr`;
    }
    return 'Não definido';
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(employee)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={employee.avatar} />
            <AvatarFallback>
              {employee.firstName[0]}{employee.lastName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">
                {employee.firstName} {employee.lastName}
              </h3>
              <Badge className={cn('text-xs', statusColors[employee.status])}>
                {employee.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {employee.position}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={cn('text-xs', departmentColors[employee.department])}>
                {departmentLabels[employee.department]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {employee.employmentType}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>{getScheduleSummary()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Banknote className="h-3 w-3" />
                <span>{getPayInfo()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          {employee.email && (
            <a
              href={`mailto:${employee.email}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-3 w-3" />
              Email
            </a>
          )}
          {employee.phone && (
            <a
              href={`tel:${employee.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Phone className="h-3 w-3" />
              Call
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
