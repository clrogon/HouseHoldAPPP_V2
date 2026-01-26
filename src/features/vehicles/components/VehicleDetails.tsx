import { format } from 'date-fns';
import {
  Car,
  Fuel,
  Wrench,
  Calendar,
  Gauge,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { formatCurrency } from '@/shared/lib/currency';
import type { Vehicle, MaintenanceRecord, FuelRecord } from '../types/vehicles.types';

interface VehicleDetailsProps {
  vehicle: Vehicle;
  maintenanceRecords: MaintenanceRecord[];
  fuelRecords: FuelRecord[];
  onBack: () => void;
}

const maintenanceTypeLabels: Record<MaintenanceRecord['type'], string> = {
  oil_change: 'Oil Change',
  tire_rotation: 'Tire Rotation',
  brake_service: 'Brake Service',
  inspection: 'Inspection',
  repair: 'Repair',
  other: 'Other',
};

export function VehicleDetails({
  vehicle,
  maintenanceRecords,
  fuelRecords,
  onBack,
}: VehicleDetailsProps) {
  const calculateFuelEfficiency = () => {
    if (fuelRecords.length < 2) return null;
    const sortedRecords = [...fuelRecords].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const first = sortedRecords[0];
    const last = sortedRecords[sortedRecords.length - 1];
    const totalGallons = sortedRecords.reduce((sum, r) => sum + r.gallons, 0);
    const milesDriven = last.mileage - first.mileage;
    if (milesDriven <= 0 || totalGallons <= 0) return null;
    return (milesDriven / totalGallons).toFixed(1);
  };

  const totalMaintenanceCost = maintenanceRecords.reduce((sum, r) => sum + r.cost, 0);
  const totalFuelCost = fuelRecords.reduce((sum, r) => sum + r.totalCost, 0);
  const mpg = calculateFuelEfficiency();

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Vehicles
      </Button>

      {/* Vehicle Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-muted-foreground">
                  {vehicle.licensePlate} • {vehicle.color}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {vehicle.mileage.toLocaleString()} mi
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fuel Type</p>
              <p className="font-medium capitalize">{vehicle.fuelType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Primary Driver</p>
              <p className="font-medium">{vehicle.primaryDriver || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Insurance Expiry</p>
              <p className="font-medium">
                {vehicle.insuranceExpiry
                  ? format(new Date(vehicle.insuranceExpiry), 'MMM d, yyyy')
                  : '-'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Registration Expiry</p>
              <p className="font-medium">
                {vehicle.registrationExpiry
                  ? format(new Date(vehicle.registrationExpiry), 'MMM d, yyyy')
                  : '-'}
              </p>
            </div>
          </div>

          {vehicle.vin && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">VIN</p>
              <p className="font-mono">{vehicle.vin}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Maintenance</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalMaintenanceCost)}</p>
            <p className="text-xs text-muted-foreground">{maintenanceRecords.length} records</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Fuel Cost</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalFuelCost)}</p>
            <p className="text-xs text-muted-foreground">{fuelRecords.length} fill-ups</p>
          </CardContent>
        </Card>

        {mpg && vehicle.fuelType !== 'electric' && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Avg MPG</span>
              </div>
              <p className="text-2xl font-bold">{mpg}</p>
              <p className="text-xs text-muted-foreground">miles per gallon</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Cost</span>
            </div>
            <p className="text-2xl font-bold">
              {formatCurrency(totalMaintenanceCost + totalFuelCost)}
            </p>
            <p className="text-xs text-muted-foreground">all time</p>
          </CardContent>
        </Card>
      </div>

      {/* Records */}
      <Tabs defaultValue="maintenance">
        <TabsList>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="fuel">Fuel</TabsTrigger>
        </TabsList>

        <TabsContent value="maintenance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              {maintenanceRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <Wrench className="h-12 w-12 mb-4" />
                  <p>No maintenance records yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Mileage</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceRecords
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(record => (
                        <TableRow key={record.id}>
                          <TableCell>
                            {format(new Date(record.date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {maintenanceTypeLabels[record.type]}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{record.mileage.toLocaleString()} mi</TableCell>
                          <TableCell>{record.provider || '-'}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(record.cost)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Fuel History</CardTitle>
            </CardHeader>
            <CardContent>
              {fuelRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <Fuel className="h-12 w-12 mb-4" />
                  <p>No fuel records yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Station</TableHead>
                      <TableHead>Gallons</TableHead>
                      <TableHead>Price/Gal</TableHead>
                      <TableHead>Mileage</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fuelRecords
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(record => (
                        <TableRow key={record.id}>
                          <TableCell>
                            {format(new Date(record.date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>{record.station || '-'}</TableCell>
                          <TableCell>{record.gallons.toFixed(2)} gal</TableCell>
                          <TableCell>{formatCurrency(record.pricePerGallon)}</TableCell>
                          <TableCell>{record.mileage.toLocaleString()} km</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(record.totalCost)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
