import apiClient, { getApiErrorMessage } from './client';

export type VehicleType = 'CAR' | 'TRUCK' | 'SUV' | 'VAN' | 'MOTORCYCLE' | 'OTHER';

export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  mileage?: number;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  type: string;
  description?: string;
  date: string;
  mileage?: number;
  cost?: number;
  serviceProvider?: string;
  nextDueDate?: string;
  vehicleId: string;
  createdAt: string;
}

export interface FuelLog {
  id: string;
  date: string;
  gallons: number;
  pricePerGallon: number;
  totalCost: number;
  mileage?: number;
  station?: string;
  vehicleId: string;
  createdAt: string;
}

export interface CreateVehicleData {
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  mileage?: number;
}

export interface CreateMaintenanceData {
  type: string;
  description?: string;
  date: string;
  mileage?: number;
  cost?: number;
  serviceProvider?: string;
  nextDueDate?: string;
}

export interface CreateFuelLogData {
  date: string;
  gallons: number;
  pricePerGallon: number;
  totalCost: number;
  mileage?: number;
  station?: string;
}

export const vehiclesApi = {
  // Vehicles
  async createVehicle(data: CreateVehicleData): Promise<Vehicle> {
    try {
      const response = await apiClient.post<Vehicle>('/vehicles', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await apiClient.get<Vehicle[]>('/vehicles');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getVehicle(id: string): Promise<Vehicle> {
    try {
      const response = await apiClient.get<Vehicle>(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateVehicle(id: string, data: Partial<CreateVehicleData>): Promise<Vehicle> {
    try {
      const response = await apiClient.patch<Vehicle>(`/vehicles/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async deleteVehicle(id: string): Promise<void> {
    try {
      await apiClient.delete(`/vehicles/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Maintenance
  async addMaintenance(vehicleId: string, data: CreateMaintenanceData): Promise<MaintenanceRecord> {
    try {
      const response = await apiClient.post<MaintenanceRecord>(`/vehicles/${vehicleId}/maintenance`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getMaintenanceHistory(vehicleId: string): Promise<MaintenanceRecord[]> {
    try {
      const response = await apiClient.get<MaintenanceRecord[]>(`/vehicles/${vehicleId}/maintenance`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Fuel Logs
  async addFuelLog(vehicleId: string, data: CreateFuelLogData): Promise<FuelLog> {
    try {
      const response = await apiClient.post<FuelLog>(`/vehicles/${vehicleId}/fuel`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getFuelLogs(vehicleId: string): Promise<FuelLog[]> {
    try {
      const response = await apiClient.get<FuelLog[]>(`/vehicles/${vehicleId}/fuel`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export default vehiclesApi;
