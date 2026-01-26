import apiClient, { getApiErrorMessage } from './client';

export type PetSpecies = 'DOG' | 'CAT' | 'BIRD' | 'FISH' | 'REPTILE' | 'OTHER';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate?: string;
  gender?: string;
  color?: string;
  microchipNumber?: string;
  weight?: number;
  vetName?: string;
  vetPhone?: string;
  vetAddress?: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vaccination {
  id: string;
  name: string;
  dateGiven: string;
  nextDue: string;
  vet?: string;
  certificateUrl?: string;
  petId: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  date: string;
  reason: string;
  vet?: string;
  notes?: string;
  cost?: number;
  petId: string;
  createdAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  notes?: string;
  petId: string;
  createdAt: string;
}

export interface CreatePetData {
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate?: string;
  gender?: string;
  color?: string;
  microchipNumber?: string;
  weight?: number;
  vetName?: string;
  vetPhone?: string;
  vetAddress?: string;
}

export interface CreateVaccinationData {
  name: string;
  dateGiven: string;
  nextDue: string;
  vet?: string;
  certificateUrl?: string;
}

export interface CreateAppointmentData {
  date: string;
  reason: string;
  vet?: string;
  notes?: string;
  cost?: number;
}

export interface CreateMedicationData {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  notes?: string;
}

export const petsApi = {
  // Pets
  async createPet(data: CreatePetData): Promise<Pet> {
    try {
      const response = await apiClient.post<Pet>('/pets', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getPets(): Promise<Pet[]> {
    try {
      const response = await apiClient.get<Pet[]>('/pets');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getPet(id: string): Promise<Pet> {
    try {
      const response = await apiClient.get<Pet>(`/pets/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updatePet(id: string, data: Partial<CreatePetData>): Promise<Pet> {
    try {
      const response = await apiClient.patch<Pet>(`/pets/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async deletePet(id: string): Promise<void> {
    try {
      await apiClient.delete(`/pets/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Vaccinations
  async addVaccination(petId: string, data: CreateVaccinationData): Promise<Vaccination> {
    try {
      const response = await apiClient.post<Vaccination>(`/pets/${petId}/vaccinations`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getVaccinations(petId: string): Promise<Vaccination[]> {
    try {
      const response = await apiClient.get<Vaccination[]>(`/pets/${petId}/vaccinations`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Appointments
  async addAppointment(petId: string, data: CreateAppointmentData): Promise<Appointment> {
    try {
      const response = await apiClient.post<Appointment>(`/pets/${petId}/appointments`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getAppointments(petId: string): Promise<Appointment[]> {
    try {
      const response = await apiClient.get<Appointment[]>(`/pets/${petId}/appointments`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Medications
  async addMedication(petId: string, data: CreateMedicationData): Promise<Medication> {
    try {
      const response = await apiClient.post<Medication>(`/pets/${petId}/medications`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getMedications(petId: string): Promise<Medication[]> {
    try {
      const response = await apiClient.get<Medication[]>(`/pets/${petId}/medications`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export default petsApi;
