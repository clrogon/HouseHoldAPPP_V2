import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto, VehicleResponseDto, CreateMaintenanceDto, MaintenanceResponseDto, CreateFuelLogDto, FuelLogResponseDto } from './dto';
import { VehicleType as PrismaVehicleType } from '@prisma/client';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async createVehicle(householdId: string, dto: CreateVehicleDto): Promise<VehicleResponseDto> {
    const vehicle = await this.prisma.vehicle.create({
      data: {
        type: dto.type as PrismaVehicleType,
        make: dto.make,
        model: dto.model,
        year: dto.year,
        color: dto.color,
        licensePlate: dto.licensePlate,
        vin: dto.vin,
        mileage: dto.mileage,
        householdId,
      },
    });
    return this.mapVehicle(vehicle);
  }

  async getVehicles(householdId: string): Promise<VehicleResponseDto[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { householdId },
      orderBy: { make: 'asc' },
    });
    return vehicles.map((v) => this.mapVehicle(v));
  }

  async getVehicle(householdId: string, vehicleId: string): Promise<VehicleResponseDto> {
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, householdId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return this.mapVehicle(vehicle);
  }

  async updateVehicle(householdId: string, vehicleId: string, dto: UpdateVehicleDto): Promise<VehicleResponseDto> {
    const existing = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, householdId } });
    if (!existing) throw new NotFoundException('Vehicle not found');

    const vehicle = await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        type: dto.type as PrismaVehicleType | undefined,
        make: dto.make,
        model: dto.model,
        year: dto.year,
        color: dto.color,
        licensePlate: dto.licensePlate,
        vin: dto.vin,
        mileage: dto.mileage,
      },
    });
    return this.mapVehicle(vehicle);
  }

  async deleteVehicle(householdId: string, vehicleId: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, householdId } });
    if (!existing) throw new NotFoundException('Vehicle not found');
    await this.prisma.vehicle.delete({ where: { id: vehicleId } });
    return { success: true };
  }

  // Maintenance
  async addMaintenance(householdId: string, vehicleId: string, dto: CreateMaintenanceDto): Promise<MaintenanceResponseDto> {
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, householdId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const maintenance = await this.prisma.vehicleMaintenance.create({
      data: {
        type: dto.type,
        notes: dto.description,
        date: new Date(dto.date),
        mileage: dto.mileage,
        cost: dto.cost,
        serviceProvider: dto.serviceProvider,
        nextServiceDue: dto.nextDueDate ? new Date(dto.nextDueDate) : null,
        vehicleId,
      },
    });
    return this.mapMaintenance(maintenance);
  }

  async getMaintenanceHistory(householdId: string, vehicleId: string): Promise<MaintenanceResponseDto[]> {
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, householdId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const records = await this.prisma.vehicleMaintenance.findMany({
      where: { vehicleId },
      orderBy: { date: 'desc' },
    });
    return records.map((m) => this.mapMaintenance(m));
  }

  // Fuel Logs
  async addFuelLog(householdId: string, vehicleId: string, dto: CreateFuelLogDto): Promise<FuelLogResponseDto> {
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, householdId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const fuelLog = await this.prisma.fuelLog.create({
      data: {
        date: new Date(dto.date),
        gallons: dto.gallons,
        costPerGallon: dto.pricePerGallon,
        totalCost: dto.totalCost,
        mileage: dto.mileage,
        gasStation: dto.station,
        vehicleId,
      },
    });
    return this.mapFuelLog(fuelLog);
  }

  async getFuelLogs(householdId: string, vehicleId: string): Promise<FuelLogResponseDto[]> {
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, householdId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const logs = await this.prisma.fuelLog.findMany({
      where: { vehicleId },
      orderBy: { date: 'desc' },
    });
    return logs.map((f) => this.mapFuelLog(f));
  }

  private mapVehicle(vehicle: any): VehicleResponseDto {
    return {
      id: vehicle.id,
      type: vehicle.type,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color || undefined,
      licensePlate: vehicle.licensePlate || undefined,
      vin: vehicle.vin || undefined,
      mileage: vehicle.mileage || undefined,
      householdId: vehicle.householdId,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    };
  }

  private mapMaintenance(m: any): MaintenanceResponseDto {
    return {
      id: m.id,
      type: m.type,
      description: m.notes || undefined,
      date: m.date.toISOString(),
      mileage: m.mileage || undefined,
      cost: m.cost || undefined,
      serviceProvider: m.serviceProvider || undefined,
      nextDueDate: m.nextServiceDue?.toISOString() || undefined,
      vehicleId: m.vehicleId,
      createdAt: m.createdAt.toISOString(),
    };
  }

  private mapFuelLog(f: any): FuelLogResponseDto {
    return {
      id: f.id,
      date: f.date.toISOString(),
      gallons: f.gallons,
      pricePerGallon: f.costPerGallon,
      totalCost: f.totalCost,
      mileage: f.mileage || undefined,
      station: f.gasStation || undefined,
      vehicleId: f.vehicleId,
      createdAt: f.createdAt.toISOString(),
    };
  }
}
