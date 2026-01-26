import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
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
import { PetSpecies as PrismaPetSpecies } from '@prisma/client';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async createPet(householdId: string, dto: CreatePetDto): Promise<PetResponseDto> {
    const pet = await this.prisma.pet.create({
      data: {
        name: dto.name,
        species: dto.species as PrismaPetSpecies,
        breed: dto.breed,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        gender: dto.gender,
        color: dto.color,
        microchipNumber: dto.microchipNumber,
        weight: dto.weight,
        vetName: dto.vetName,
        vetPhone: dto.vetPhone,
        vetAddress: dto.vetAddress,
        householdId,
      },
    });
    return this.mapPet(pet);
  }

  async getPets(householdId: string): Promise<PetResponseDto[]> {
    const pets = await this.prisma.pet.findMany({
      where: { householdId },
      orderBy: { name: 'asc' },
    });
    return pets.map((p) => this.mapPet(p));
  }

  async getPet(householdId: string, petId: string): Promise<PetResponseDto> {
    const pet = await this.prisma.pet.findFirst({ where: { id: petId, householdId } });
    if (!pet) throw new NotFoundException('Pet not found');
    return this.mapPet(pet);
  }

  async updatePet(householdId: string, petId: string, dto: UpdatePetDto): Promise<PetResponseDto> {
    const existing = await this.prisma.pet.findFirst({ where: { id: petId, householdId } });
    if (!existing) throw new NotFoundException('Pet not found');

    const pet = await this.prisma.pet.update({
      where: { id: petId },
      data: {
        name: dto.name,
        species: dto.species as PrismaPetSpecies | undefined,
        breed: dto.breed,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        gender: dto.gender,
        color: dto.color,
        microchipNumber: dto.microchipNumber,
        weight: dto.weight,
        vetName: dto.vetName,
        vetPhone: dto.vetPhone,
        vetAddress: dto.vetAddress,
      },
    });
    return this.mapPet(pet);
  }

  async deletePet(householdId: string, petId: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.pet.findFirst({ where: { id: petId, householdId } });
    if (!existing) throw new NotFoundException('Pet not found');
    await this.prisma.pet.delete({ where: { id: petId } });
    return { success: true };
  }

  // Vaccinations
  async addVaccination(householdId: string, petId: string, dto: CreateVaccinationDto): Promise<VaccinationResponseDto> {
    const pet = await this.prisma.pet.findFirst({ where: { id: petId, householdId } });
    if (!pet) throw new NotFoundException('Pet not found');

    const vaccination = await this.prisma.petVaccination.create({
      data: {
        name: dto.name,
        dateGiven: new Date(dto.dateGiven),
        nextDue: new Date(dto.nextDue),
        vet: dto.vet,
        certificateUrl: dto.certificateUrl,
        petId,
      },
    });
    return this.mapVaccination(vaccination);
  }

  async getVaccinations(householdId: string, petId: string): Promise<VaccinationResponseDto[]> {
    const pet = await this.prisma.pet.findFirst({ where: { id: petId, householdId } });
    if (!pet) throw new NotFoundException('Pet not found');

    const vaccinations = await this.prisma.petVaccination.findMany({
      where: { petId },
      orderBy: { dateGiven: 'desc' },
    });
    return vaccinations.map((v) => this.mapVaccination(v));
  }

  // Appointments
  async addAppointment(householdId: string, petId: string, dto: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    const pet = await this.prisma.pet.findFirst({ where: { id: petId, householdId } });
    if (!pet) throw new NotFoundException('Pet not found');

    const appointment = await this.prisma.petAppointment.create({
      data: {
        date: new Date(dto.date),
        reason: dto.reason,
        vet: dto.vet,
        notes: dto.notes,
        cost: dto.cost,
        petId,
      },
    });
    return this.mapAppointment(appointment);
  }

  async getAppointments(householdId: string, petId: string): Promise<AppointmentResponseDto[]> {
    const pet = await this.prisma.pet.findFirst({ where: { id: petId, householdId } });
    if (!pet) throw new NotFoundException('Pet not found');

    const appointments = await this.prisma.petAppointment.findMany({
      where: { petId },
      orderBy: { date: 'desc' },
    });
    return appointments.map((a) => this.mapAppointment(a));
  }

  // Medications
  async addMedication(householdId: string, petId: string, dto: CreateMedicationDto): Promise<MedicationResponseDto> {
    const pet = await this.prisma.pet.findFirst({ where: { id: petId, householdId } });
    if (!pet) throw new NotFoundException('Pet not found');

    const medication = await this.prisma.petMedication.create({
      data: {
        name: dto.name,
        dosage: dto.dosage,
        frequency: dto.frequency,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        prescribedBy: dto.prescribedBy,
        notes: dto.notes,
        petId,
      },
    });
    return this.mapMedication(medication);
  }

  async getMedications(householdId: string, petId: string): Promise<MedicationResponseDto[]> {
    const pet = await this.prisma.pet.findFirst({ where: { id: petId, householdId } });
    if (!pet) throw new NotFoundException('Pet not found');

    const medications = await this.prisma.petMedication.findMany({
      where: { petId },
      orderBy: { startDate: 'desc' },
    });
    return medications.map((m) => this.mapMedication(m));
  }

  private mapPet(pet: any): PetResponseDto {
    return {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed || undefined,
      birthDate: pet.birthDate?.toISOString() || undefined,
      gender: pet.gender || undefined,
      color: pet.color || undefined,
      microchipNumber: pet.microchipNumber || undefined,
      weight: pet.weight || undefined,
      vetName: pet.vetName || undefined,
      vetPhone: pet.vetPhone || undefined,
      vetAddress: pet.vetAddress || undefined,
      householdId: pet.householdId,
      createdAt: pet.createdAt.toISOString(),
      updatedAt: pet.updatedAt.toISOString(),
    };
  }

  private mapVaccination(v: any): VaccinationResponseDto {
    return {
      id: v.id,
      name: v.name,
      dateGiven: v.dateGiven.toISOString(),
      nextDue: v.nextDue.toISOString(),
      vet: v.vet || undefined,
      certificateUrl: v.certificateUrl || undefined,
      petId: v.petId,
      createdAt: v.createdAt.toISOString(),
    };
  }

  private mapAppointment(a: any): AppointmentResponseDto {
    return {
      id: a.id,
      date: a.date.toISOString(),
      reason: a.reason,
      vet: a.vet || undefined,
      notes: a.notes || undefined,
      cost: a.cost || undefined,
      petId: a.petId,
      createdAt: a.createdAt.toISOString(),
    };
  }

  private mapMedication(m: any): MedicationResponseDto {
    return {
      id: m.id,
      name: m.name,
      dosage: m.dosage,
      frequency: m.frequency,
      startDate: m.startDate.toISOString(),
      endDate: m.endDate?.toISOString() || undefined,
      prescribedBy: m.prescribedBy || undefined,
      notes: m.notes || undefined,
      petId: m.petId,
      createdAt: m.createdAt.toISOString(),
    };
  }
}
