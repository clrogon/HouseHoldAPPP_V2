import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto, VehicleResponseDto, CreateMaintenanceDto, MaintenanceResponseDto, CreateFuelLogDto, FuelLogResponseDto } from './dto';
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
import { HouseholdGuard } from '../../common/guards';

@ApiTags('vehicles')
@ApiBearerAuth()
@UseGuards(HouseholdGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Create vehicle' })
  @ApiResponse({ status: 201, type: VehicleResponseDto })
  async createVehicle(@CurrentUser() user: JwtPayload, @Body() dto: CreateVehicleDto): Promise<VehicleResponseDto> {
    return this.vehiclesService.createVehicle(user.householdId!, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({ status: 200, type: [VehicleResponseDto] })
  async getVehicles(@CurrentUser() user: JwtPayload): Promise<VehicleResponseDto[]> {
    return this.vehiclesService.getVehicles(user.householdId!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle' })
  @ApiResponse({ status: 200, type: VehicleResponseDto })
  async getVehicle(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<VehicleResponseDto> {
    return this.vehiclesService.getVehicle(user.householdId!, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vehicle' })
  @ApiResponse({ status: 200, type: VehicleResponseDto })
  async updateVehicle(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateVehicleDto): Promise<VehicleResponseDto> {
    return this.vehiclesService.updateVehicle(user.householdId!, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vehicle' })
  async deleteVehicle(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<{ success: boolean }> {
    return this.vehiclesService.deleteVehicle(user.householdId!, id);
  }

  // Maintenance
  @Post(':id/maintenance')
  @ApiOperation({ summary: 'Add maintenance record' })
  @ApiResponse({ status: 201, type: MaintenanceResponseDto })
  async addMaintenance(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: CreateMaintenanceDto): Promise<MaintenanceResponseDto> {
    return this.vehiclesService.addMaintenance(user.householdId!, id, dto);
  }

  @Get(':id/maintenance')
  @ApiOperation({ summary: 'Get maintenance history' })
  @ApiResponse({ status: 200, type: [MaintenanceResponseDto] })
  async getMaintenanceHistory(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<MaintenanceResponseDto[]> {
    return this.vehiclesService.getMaintenanceHistory(user.householdId!, id);
  }

  // Fuel Logs
  @Post(':id/fuel')
  @ApiOperation({ summary: 'Add fuel log' })
  @ApiResponse({ status: 201, type: FuelLogResponseDto })
  async addFuelLog(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: CreateFuelLogDto): Promise<FuelLogResponseDto> {
    return this.vehiclesService.addFuelLog(user.householdId!, id, dto);
  }

  @Get(':id/fuel')
  @ApiOperation({ summary: 'Get fuel logs' })
  @ApiResponse({ status: 200, type: [FuelLogResponseDto] })
  async getFuelLogs(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<FuelLogResponseDto[]> {
    return this.vehiclesService.getFuelLogs(user.householdId!, id);
  }
}
