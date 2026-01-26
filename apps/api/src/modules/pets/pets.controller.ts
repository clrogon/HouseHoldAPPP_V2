import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import {
  CreatePetDto,
  UpdatePetDto,
  PetResponseDto,
  CreateVaccinationDto,
  VaccinationResponseDto,
  CreateAppointmentDto,
  AppointmentResponseDto,
  CreateMedicationDto,
  MedicationResponseDto,
} from './dto';
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
import { HouseholdGuard } from '../../common/guards';

@ApiTags('pets')
@ApiBearerAuth()
@UseGuards(HouseholdGuard)
@Controller('pets')
export class PetsController {
  constructor(private petsService: PetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create pet' })
  @ApiResponse({ status: 201, type: PetResponseDto })
  async createPet(@CurrentUser() user: JwtPayload, @Body() dto: CreatePetDto): Promise<PetResponseDto> {
    return this.petsService.createPet(user.householdId!, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pets' })
  @ApiResponse({ status: 200, type: [PetResponseDto] })
  async getPets(@CurrentUser() user: JwtPayload): Promise<PetResponseDto[]> {
    return this.petsService.getPets(user.householdId!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pet' })
  @ApiResponse({ status: 200, type: PetResponseDto })
  async getPet(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<PetResponseDto> {
    return this.petsService.getPet(user.householdId!, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pet' })
  @ApiResponse({ status: 200, type: PetResponseDto })
  async updatePet(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdatePetDto): Promise<PetResponseDto> {
    return this.petsService.updatePet(user.householdId!, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pet' })
  async deletePet(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<{ success: boolean }> {
    return this.petsService.deletePet(user.householdId!, id);
  }

  // Vaccinations
  @Post(':id/vaccinations')
  @ApiOperation({ summary: 'Add vaccination record' })
  @ApiResponse({ status: 201, type: VaccinationResponseDto })
  async addVaccination(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: CreateVaccinationDto): Promise<VaccinationResponseDto> {
    return this.petsService.addVaccination(user.householdId!, id, dto);
  }

  @Get(':id/vaccinations')
  @ApiOperation({ summary: 'Get vaccinations' })
  @ApiResponse({ status: 200, type: [VaccinationResponseDto] })
  async getVaccinations(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<VaccinationResponseDto[]> {
    return this.petsService.getVaccinations(user.householdId!, id);
  }

  // Appointments
  @Post(':id/appointments')
  @ApiOperation({ summary: 'Add appointment' })
  @ApiResponse({ status: 201, type: AppointmentResponseDto })
  async addAppointment(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    return this.petsService.addAppointment(user.householdId!, id, dto);
  }

  @Get(':id/appointments')
  @ApiOperation({ summary: 'Get appointments' })
  @ApiResponse({ status: 200, type: [AppointmentResponseDto] })
  async getAppointments(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<AppointmentResponseDto[]> {
    return this.petsService.getAppointments(user.householdId!, id);
  }

  // Medications
  @Post(':id/medications')
  @ApiOperation({ summary: 'Add medication' })
  @ApiResponse({ status: 201, type: MedicationResponseDto })
  async addMedication(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: CreateMedicationDto): Promise<MedicationResponseDto> {
    return this.petsService.addMedication(user.householdId!, id, dto);
  }

  @Get(':id/medications')
  @ApiOperation({ summary: 'Get medications' })
  @ApiResponse({ status: 200, type: [MedicationResponseDto] })
  async getMedications(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<MedicationResponseDto[]> {
    return this.petsService.getMedications(user.householdId!, id);
  }
}
