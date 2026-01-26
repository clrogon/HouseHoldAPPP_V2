// Stub file - API integration pending

// Re-export types from features for compatibility
export type {
  Child,
  ChildSchool,
  ChildTeacher,
  Homework,
  Grade,
  ChildMedication,
  ChildVaccination,
  ChildAppointment,
  ChildActivity,
  ChildFriend,
  ChildMilestone,
  ChildChore,
  GrowthRecord,
} from '@/features/kids/types/kids.types';

import type {
  Child,
  ChildSchool,
  ChildTeacher,
  Homework,
  Grade,
  ChildMedication,
  ChildVaccination,
  ChildAppointment,
  ChildActivity,
  ChildFriend,
  ChildMilestone,
  ChildChore,
  GrowthRecord,
} from '@/features/kids/types/kids.types';

export const mockChildren: Child[] = [];
export const mockSchools: ChildSchool[] = [];
export const mockTeachers: ChildTeacher[] = [];
export const mockHomework: Homework[] = [];
export const mockGrades: Grade[] = [];
export const mockMedications: ChildMedication[] = [];
export const mockVaccinations: ChildVaccination[] = [];
export const mockAppointments: ChildAppointment[] = [];
export const mockActivities: ChildActivity[] = [];
export const mockFriends: ChildFriend[] = [];
export const mockMilestones: ChildMilestone[] = [];
export const mockChores: ChildChore[] = [];
export const mockGrowthRecords: GrowthRecord[] = [];

// Legacy aliases
export const mockKids = mockChildren;

export async function getKids(): Promise<Child[]> {
  return [];
}

export async function addChild(data: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>): Promise<Child> {
  return {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };
}

export async function updateChild(id: string, data: Partial<Child>): Promise<Child> {
  return {
    id,
    householdId: data.householdId || '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    dateOfBirth: data.dateOfBirth || '',
    allergies: data.allergies || [],
    medicalConditions: data.medicalConditions || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };
}

export async function deleteChild(_id: string): Promise<void> {
  return;
}

export async function deleteKid(_id: string): Promise<void> {
  return deleteChild(_id);
}

export async function createKid(data: Partial<Child>): Promise<Child> {
  return addChild(data as Omit<Child, 'id' | 'createdAt' | 'updatedAt'>);
}

export async function updateKid(id: string, data: Partial<Child>): Promise<Child> {
  return updateChild(id, data);
}

export async function toggleChore(_choreId: string): Promise<ChildChore> {
  throw new Error('API integration required');
}

export async function getKidActivities(_kidId: string): Promise<ChildActivity[]> {
  return [];
}
