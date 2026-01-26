// Stub file - API integration pending

// Re-export types from features for compatibility
export type { UserProfile, UserActivity, UserStats } from '@/features/profile/types/profile.types';

import type { UserProfile, UserActivity, UserStats } from '@/features/profile/types/profile.types';

export const mockProfile: UserProfile = {
  id: '1',
  firstName: 'User',
  lastName: 'Name',
  email: 'user@example.com',
  role: 'ADMIN',
  householdId: '1',
  householdName: 'My Household',
  joinedAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
};

export const mockActivities: UserActivity[] = [];

export const mockStats: UserStats = {
  tasksCompleted: 0,
  tasksAssigned: 0,
  eventsCreated: 0,
  recipesAdded: 0,
  inventoryItems: 0,
  totalExpenses: 0,
};

export async function getProfile(): Promise<UserProfile> {
  return mockProfile;
}

export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  return { ...mockProfile, ...data };
}

export async function changePassword(_currentPassword: string, _newPassword: string): Promise<{ success: boolean }> {
  throw new Error('API integration required');
}

export async function uploadAvatar(_file: File): Promise<string> {
  throw new Error('API integration required');
}
