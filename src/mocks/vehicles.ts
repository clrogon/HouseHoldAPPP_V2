// Stub file - API integration pending

// Re-export types from features for compatibility
export type { Vehicle, MaintenanceRecord, FuelRecord } from '@/features/vehicles/types/vehicles.types';

import type { Vehicle, MaintenanceRecord, FuelRecord } from '@/features/vehicles/types/vehicles.types';

export const mockVehicles: Vehicle[] = [];
export const mockMaintenanceRecords: MaintenanceRecord[] = [];
export const mockFuelRecords: FuelRecord[] = [];

// Legacy aliases
export const mockMaintenance = mockMaintenanceRecords;
export const mockFuelLogs = mockFuelRecords;

export async function getVehicles(): Promise<Vehicle[]> {
  return [];
}

export async function addVehicle(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
  return {
    id: String(Date.now()),
    ...data,
  };
}

export async function createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
  return addVehicle(data as Omit<Vehicle, 'id'>);
}

export async function updateVehicle(_id: string, _data: Partial<Vehicle>): Promise<Vehicle> {
  throw new Error('API integration required');
}

export async function deleteVehicle(_id: string): Promise<void> {
  return;
}

export async function getMaintenanceHistory(_vehicleId: string): Promise<MaintenanceRecord[]> {
  return [];
}

export async function getFuelLogs(_vehicleId: string): Promise<FuelRecord[]> {
  return [];
}

export async function addMaintenance(_data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
  throw new Error('API integration required');
}

export async function addFuelLog(_data: Partial<FuelRecord>): Promise<FuelRecord> {
  throw new Error('API integration required');
}
