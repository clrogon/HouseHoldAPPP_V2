// Stub file - API integration pending

// Re-export types from features for compatibility
export type { SystemUser, SystemHousehold, AuditLog, SystemStats } from '@/features/admin/types/admin.types';

import type { SystemUser, SystemHousehold, AuditLog, SystemStats } from '@/features/admin/types/admin.types';

// Empty arrays matching expected types
export const mockUsers: SystemUser[] = [];
export const mockHouseholds: SystemHousehold[] = [];
export const mockAuditLogs: AuditLog[] = [];
export const mockStats: SystemStats = {
  totalUsers: 0,
  activeUsers: 0,
  totalHouseholds: 0,
  activeHouseholds: 0,
  newUsersThisMonth: 0,
  newHouseholdsThisMonth: 0,
};

export async function getAdminUsers(): Promise<SystemUser[]> {
  return [];
}

export async function getAdminHouseholds(): Promise<SystemHousehold[]> {
  return [];
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  return [];
}

export async function getSystemStats(): Promise<SystemStats> {
  return mockStats;
}

export async function updateUserStatus(_id: string, _status: SystemUser['status']): Promise<SystemUser> {
  throw new Error('API integration required');
}

export async function deleteUser(_id: string): Promise<void> {
  return;
}
