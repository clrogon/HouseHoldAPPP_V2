// Stub file - API integration pending

// Re-export types from features for compatibility
export type { Household, HouseholdMember, Invitation } from '@/features/household/types/household.types';

import type { Household, HouseholdMember, Invitation } from '@/features/household/types/household.types';

export const mockHousehold: Household = {
  id: '1',
  name: 'My Household',
  memberCount: 0,
  inviteCode: '',
  createdAt: new Date().toISOString(),
};

export const mockMembers: HouseholdMember[] = [];
export const mockInvitations: Invitation[] = [];

export async function getHousehold(): Promise<Household> {
  return mockHousehold;
}

export async function updateHousehold(data: Partial<Household>): Promise<Household> {
  return { ...mockHousehold, ...data };
}

export async function getMembers(): Promise<HouseholdMember[]> {
  return [];
}

export async function inviteMember(email: string, role: 'PARENT' | 'MEMBER' | 'STAFF'): Promise<Invitation> {
  return {
    id: String(Date.now()),
    email,
    role,
    status: 'pending',
    invitedBy: 'current-user',
    invitedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export async function removeMember(_id: string): Promise<void> {
  return;
}

export async function updateMember(_id: string, _data: Partial<HouseholdMember>): Promise<HouseholdMember> {
  throw new Error('API integration required');
}

export async function getInvitations(): Promise<Invitation[]> {
  return [];
}

export async function cancelInvitation(_id: string): Promise<void> {
  return;
}

export async function resendInvitation(_id: string): Promise<void> {
  return;
}
