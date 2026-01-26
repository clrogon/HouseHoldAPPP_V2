// Stub file - API integration pending

export type UserRole = 'ADMIN' | 'PARENT' | 'MEMBER' | 'STAFF';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  householdId?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export async function mockLogin(_email: string, _password: string): Promise<AuthResponse> {
  // This will be replaced with real API call
  throw new Error('API integration required - please connect to backend');
}

export async function mockRegister(_data: Record<string, unknown>): Promise<AuthResponse> {
  // This will be replaced with real API call
  throw new Error('API integration required - please connect to backend');
}

export async function mockLogout(): Promise<{ success: boolean }> {
  return { success: true };
}
