import { useState, useEffect } from 'react';
import { PetCard } from '../components/PetCard';
import { PetDetails } from '../components/PetDetails';
import { AddPetDialog } from '../components/AddPetDialog';
import type { Pet, Vaccination, VetAppointment, Medication, WeightRecord, PetExpense } from '../types/pets.types';
import {
  mockPets,
  mockVaccinations,
  mockAppointments,
  mockMedications,
  mockWeightRecords,
  mockExpenses,
  addPet,
  deletePet,
} from '@/mocks/pets';

export function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [appointments, setAppointments] = useState<VetAppointment[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [expenses, setExpenses] = useState<PetExpense[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setPets([...mockPets]);
      setVaccinations([...mockVaccinations]);
      setAppointments([...mockAppointments]);
      setMedications([...mockMedications]);
      setWeightRecords([...mockWeightRecords]);
      setExpenses([...mockExpenses]);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleAddPet = async (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPet = await addPet(petData);
    setPets(prev => [...prev, newPet]);
  };

  const handleEditPet = (pet: Pet) => {
    // In a real app, this would open an edit dialog
    console.log('Edit pet:', pet);
  };

  const handleDeletePet = async (pet: Pet) => {
    if (window.confirm(`Are you sure you want to remove ${pet.name}?`)) {
      await deletePet(pet.id);
      setPets(prev => prev.filter(p => p.id !== pet.id));
      if (selectedPet?.id === pet.id) {
        setSelectedPet(null);
      }
    }
  };

  const getPetVaccinations = (petId: string) => vaccinations.filter(v => v.petId === petId);
  const getPetAppointments = (petId: string) => appointments.filter(a => a.petId === petId);
  const getPetMedications = (petId: string) => medications.filter(m => m.petId === petId);
  const getPetWeightRecords = (petId: string) => weightRecords.filter(w => w.petId === petId);
  const getPetExpenses = (petId: string) => expenses.filter(e => e.petId === petId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (selectedPet) {
    return (
      <PetDetails
        pet={selectedPet}
        vaccinations={getPetVaccinations(selectedPet.id)}
        appointments={getPetAppointments(selectedPet.id)}
        medications={getPetMedications(selectedPet.id)}
        weightRecords={getPetWeightRecords(selectedPet.id)}
        expenses={getPetExpenses(selectedPet.id)}
        onBack={() => setSelectedPet(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pets</h1>
          <p className="text-muted-foreground">
            Manage your furry, feathered, and scaly family members.
          </p>
        </div>
        <AddPetDialog onAddPet={handleAddPet} />
      </div>

      {pets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-muted/10">
          <p className="text-lg font-medium">No pets yet</p>
          <p className="text-sm text-muted-foreground mb-4">Add your first pet to get started</p>
          <AddPetDialog onAddPet={handleAddPet} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              vaccinations={getPetVaccinations(pet.id)}
              appointments={getPetAppointments(pet.id)}
              onSelect={setSelectedPet}
              onEdit={handleEditPet}
              onDelete={handleDeletePet}
            />
          ))}
        </div>
      )}
    </div>
  );
}
