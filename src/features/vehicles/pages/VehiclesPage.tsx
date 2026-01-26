import { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleDetails } from '../components/VehicleDetails';
import { AddVehicleDialog } from '../components/AddVehicleDialog';
import type { Vehicle, MaintenanceRecord, FuelRecord } from '../types/vehicles.types';
import { vehiclesApi } from '@/shared/api';
import { mockMembers } from '@/mocks/household';

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const data = await vehiclesApi.getVehicles();
        const mappedVehicles: Vehicle[] = data.map(v => ({
          id: v.id,
          name: `${v.make} ${v.model}`,
          make: v.make,
          model: v.model,
          year: v.year,
          type: v.type.toLowerCase() as Vehicle['type'],
          color: v.color,
          licensePlate: v.licensePlate,
          vin: v.vin,
          mileage: v.mileage,
        }));
        setVehicles(mappedVehicles);

        // Fetch maintenance and fuel records for all vehicles
        const maintenancePromises = data.map(v => vehiclesApi.getMaintenanceHistory(v.id));
        const fuelPromises = data.map(v => vehiclesApi.getFuelLogs(v.id));

        const [maintenanceResults, fuelResults] = await Promise.all([
          Promise.all(maintenancePromises),
          Promise.all(fuelPromises),
        ]);

        const allMaintenance: MaintenanceRecord[] = maintenanceResults.flat().map(m => ({
          id: m.id,
          vehicleId: m.vehicleId,
          type: m.type,
          description: m.description,
          date: m.date,
          mileage: m.mileage,
          cost: m.cost,
          serviceProvider: m.serviceProvider,
          nextDueDate: m.nextDueDate,
        }));

        const allFuel: FuelRecord[] = fuelResults.flat().map(f => ({
          id: f.id,
          vehicleId: f.vehicleId,
          date: f.date,
          gallons: f.gallons,
          pricePerGallon: f.pricePerGallon,
          totalCost: f.totalCost,
          mileage: f.mileage,
          station: f.station,
        }));

        setMaintenanceRecords(allMaintenance);
        setFuelRecords(allFuel);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      const created = await vehiclesApi.createVehicle({
        type: vehicleData.type.toUpperCase() as 'CAR' | 'TRUCK' | 'SUV' | 'VAN' | 'MOTORCYCLE' | 'OTHER',
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        color: vehicleData.color,
        licensePlate: vehicleData.licensePlate,
        vin: vehicleData.vin,
        mileage: vehicleData.mileage,
      });
      const newVehicle: Vehicle = {
        id: created.id,
        name: `${created.make} ${created.model}`,
        make: created.make,
        model: created.model,
        year: created.year,
        type: created.type.toLowerCase() as Vehicle['type'],
        color: created.color,
        licensePlate: created.licensePlate,
        vin: created.vin,
        mileage: created.mileage,
      };
      setVehicles(prev => [...prev, newVehicle]);
    } catch (error) {
      console.error('Failed to add vehicle:', error);
    }
  };

  const householdMembers = mockMembers.map(m => ({
    id: m.id,
    name: `${m.firstName} ${m.lastName}`,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (selectedVehicle) {
    const vehicleMaintenanceRecords = maintenanceRecords.filter(
      r => r.vehicleId === selectedVehicle.id
    );
    const vehicleFuelRecords = fuelRecords.filter(
      r => r.vehicleId === selectedVehicle.id
    );

    return (
      <VehicleDetails
        vehicle={selectedVehicle}
        maintenanceRecords={vehicleMaintenanceRecords}
        fuelRecords={vehicleFuelRecords}
        onBack={() => setSelectedVehicle(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">
            Manage your household vehicles, maintenance, and fuel tracking.
          </p>
        </div>
        <AddVehicleDialog
          householdMembers={householdMembers}
          onAddVehicle={handleAddVehicle}
        />
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
          <Car className="h-12 w-12 mb-4" />
          <p className="text-lg">No vehicles yet</p>
          <p className="text-sm">Add your first vehicle to get started</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onSelect={setSelectedVehicle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
