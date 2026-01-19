import { format, differenceInDays } from 'date-fns';
import {
  Car,
  Calendar,
  Shield,
  User,
  AlertTriangle,
  Gauge,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { Vehicle } from '../types/vehicles.types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}

const fuelTypeLabels: Record<Vehicle['fuelType'], string> = {
  gasoline: 'Gas',
  diesel: 'Diesel',
  electric: 'Electric',
  hybrid: 'Hybrid',
};

const fuelTypeColors: Record<Vehicle['fuelType'], string> = {
  gasoline: 'bg-orange-100 text-orange-700',
  diesel: 'bg-gray-100 text-gray-700',
  electric: 'bg-green-100 text-green-700',
  hybrid: 'bg-blue-100 text-blue-700',
};

export function VehicleCard({ vehicle, onSelect }: VehicleCardProps) {
  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days < 0) return { label: 'Expired', color: 'text-red-600', urgent: true };
    if (days <= 30) return { label: `${days} days`, color: 'text-orange-600', urgent: true };
    return { label: format(new Date(expiryDate), 'MMM d, yyyy'), color: 'text-muted-foreground', urgent: false };
  };

  const insuranceStatus = getExpiryStatus(vehicle.insuranceExpiry);
  const registrationStatus = getExpiryStatus(vehicle.registrationExpiry);

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(vehicle)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{vehicle.color}</p>
            </div>
          </div>
          <Badge className={fuelTypeColors[vehicle.fuelType]}>
            {fuelTypeLabels[vehicle.fuelType]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {vehicle.mileage.toLocaleString()} mi
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{vehicle.licensePlate}</span>
          </div>
        </div>

        {/* Driver */}
        {vehicle.primaryDriver && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.primaryDriver}</span>
          </div>
        )}

        {/* Expiry Alerts */}
        <div className="space-y-2">
          {insuranceStatus && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>Insurance</span>
              </div>
              <span className={cn('flex items-center gap-1', insuranceStatus.color)}>
                {insuranceStatus.urgent && <AlertTriangle className="h-3 w-3" />}
                {insuranceStatus.label}
              </span>
            </div>
          )}

          {registrationStatus && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Registration</span>
              </div>
              <span className={cn('flex items-center gap-1', registrationStatus.color)}>
                {registrationStatus.urgent && <AlertTriangle className="h-3 w-3" />}
                {registrationStatus.label}
              </span>
            </div>
          )}
        </div>

        <Button variant="outline" className="w-full" onClick={(e) => {
          e.stopPropagation();
          onSelect(vehicle);
        }}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
