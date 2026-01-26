import { useState, useEffect } from 'react';
import { PetCard } from '../components/PetCard';
import { PetDetails } from '../components/PetDetails';
import { AddPetDialog } from '../components/AddPetDialog';
import type { Pet, Vaccination, VetAppointment, Medication, WeightRecord, PetExpense } from '../types/pets.types';
import { petsApi } from '@/shared/api';
import { mockWeightRecords, mockExpenses } from '@/mocks/pets';

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
    const fetchPets = async () => {
      setIsLoading(true);
      try {
        const data = await petsApi.getPets();
        const mappedPets: Pet[] = data.map(p => ({
          id: p.id,
          name: p.name,
          species: p.species.toLowerCase() as Pet['species'],
          breed: p.breed,
          birthDate: p.birthDate,
          gender: p.gender as Pet['gender'],
          color: p.color,
          microchipNumber: p.microchipNumber,
          weight: p.weight,
          vetName: p.vetName,
          vetPhone: p.vetPhone,
          vetAddress: p.vetAddress,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));
        setPets(mappedPets);

        // Fetch related data for all pets
        const vaccinationsPromises = data.map(p => petsApi.getVaccinations(p.id));
        const appointmentsPromises = data.map(p => petsApi.getAppointments(p.id));
        const medicationsPromises = data.map(p => petsApi.getMedications(p.id));

        const [vaccinationsResults, appointmentsResults, medicationsResults] = await Promise.all([
          Promise.all(vaccinationsPromises),
          Promise.all(appointmentsPromises),
          Promise.all(medicationsPromises),
        ]);

        const allVaccinations: Vaccination[] = vaccinationsResults.flat().map(v => ({
          id: v.id,
          petId: v.petId,
          name: v.name,
          dateGiven: v.dateGiven,
          nextDue: v.nextDue,
          vet: v.vet,
          certificateUrl: v.certificateUrl,
        }));

        const allAppointments: VetAppointment[] = appointmentsResults.flat().map(a => ({
          id: a.id,
          petId: a.petId,
          date: a.date,
          reason: a.reason,
          vet: a.vet,
          notes: a.notes,
          cost: a.cost,
        }));

        const allMedications: Medication[] = medicationsResults.flat().map(m => ({
          id: m.id,
          petId: m.petId,
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          startDate: m.startDate,
          endDate: m.endDate,
          prescribedBy: m.prescribedBy,
          notes: m.notes,
        }));

        setVaccinations(allVaccinations);
        setAppointments(allAppointments);
        setMedications(allMedications);
        setWeightRecords([...mockWeightRecords]);
        setExpenses([...mockExpenses]);
      } catch (error) {
        console.error('Failed to fetch pets:', error);
        setWeightRecords([...mockWeightRecords]);
        setExpenses([...mockExpenses]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleAddPet = async (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await petsApi.createPet({
        name: petData.name,
        species: petData.species.toUpperCase() as 'DOG' | 'CAT' | 'BIRD' | 'FISH' | 'REPTILE' | 'OTHER',
        breed: petData.breed,
        birthDate: petData.birthDate,
        gender: petData.gender,
        color: petData.color,
        microchipNumber: petData.microchipNumber,
        weight: petData.weight,
        vetName: petData.vetName,
        vetPhone: petData.vetPhone,
        vetAddress: petData.vetAddress,
      });
      const newPet: Pet = {
        id: created.id,
        name: created.name,
        species: created.species.toLowerCase() as Pet['species'],
        breed: created.breed,
        birthDate: created.birthDate,
        gender: created.gender as Pet['gender'],
        color: created.color,
        microchipNumber: created.microchipNumber,
        weight: created.weight,
        vetName: created.vetName,
        vetPhone: created.vetPhone,
        vetAddress: created.vetAddress,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      };
      setPets(prev => [...prev, newPet]);
    } catch (error) {
      console.error('Failed to add pet:', error);
    }
  };

  const handleEditPet = (pet: Pet) => {
    console.log('Edit pet:', pet);
  };

  const handleDeletePet = async (pet: Pet) => {
    if (window.confirm(`Are you sure you want to remove ${pet.name}?`)) {
      try {
        await petsApi.deletePet(pet.id);
        setPets(prev => prev.filter(p => p.id !== pet.id));
        if (selectedPet?.id === pet.id) {
          setSelectedPet(null);
        }
      } catch (error) {
        console.error('Failed to delete pet:', error);
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
