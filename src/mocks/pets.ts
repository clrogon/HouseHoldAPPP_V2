// Stub file - API integration pending

// Re-export types from features for compatibility
export type { Pet, Vaccination, VetAppointment, Medication, WeightRecord, PetExpense } from '@/features/pets/types/pets.types';

import type { Pet, Vaccination, VetAppointment, Medication, WeightRecord, PetExpense } from '@/features/pets/types/pets.types';

export const mockPets: Pet[] = [];
export const mockVaccinations: Vaccination[] = [];
export const mockAppointments: VetAppointment[] = [];
export const mockMedications: Medication[] = [];
export const mockWeightRecords: WeightRecord[] = [];
export const mockExpenses: PetExpense[] = [];

export async function getPets(): Promise<Pet[]> {
  return [];
}

export async function createPet(_data: Partial<Pet>): Promise<Pet> {
  throw new Error('API integration required');
}

export async function addPet(data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> {
  return {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };
}

export async function updatePet(_id: string, _data: Partial<Pet>): Promise<Pet> {
  throw new Error('API integration required');
}

export async function deletePet(_id: string): Promise<void> {
  return;
}

export async function getPetVaccinations(_petId: string): Promise<Vaccination[]> {
  return [];
}
