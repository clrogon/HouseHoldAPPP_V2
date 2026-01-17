import type { User, AuthResponse } from '@/features/auth/types/auth.types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@household.com',
    role: 'ADMIN',
    firstName: 'Admin',
    lastName: 'User',
    avatar: undefined,
    phone: '555-0100',
    householdId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-03-15T10:30:00Z',
  },
  {
    id: '2',
    email: 'parent@household.com',
    role: 'PARENT',
    firstName: 'John',
    lastName: 'Smith',
    avatar: undefined,
    phone: '555-0101',
    householdId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-03-14T08:00:00Z',
  },
  {
    id: '3',
    email: 'member@household.com',
    role: 'MEMBER',
    firstName: 'Tommy',
    lastName: 'Smith',
    avatar: undefined,
    phone: '555-0102',
    householdId: '1',
    createdAt: '2024-01-05T00:00:00Z',
    lastLoginAt: '2024-03-13T16:45:00Z',
  },
  {
    id: '4',
    email: 'staff@household.com',
    role: 'STAFF',
    firstName: 'Maria',
    lastName: 'Garcia',
    avatar: undefined,
    phone: '555-0103',
    householdId: '1',
    createdAt: '2024-02-01T00:00:00Z',
    lastLoginAt: '2024-03-15T07:00:00Z',
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function mockLogin(email: string, password: string): Promise<AuthResponse> {
  await delay(800); // Simulate API delay

  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('User not found');
  }

  // For mock purposes, any password works except 'wrong'
  if (password === 'wrong') {
    throw new Error('Invalid password');
  }

  return {
    user: {
      ...user,
      lastLoginAt: new Date().toISOString(),
    },
    token: `mock-jwt-token-${user.id}-${Date.now()}`,
    refreshToken: `mock-refresh-token-${user.id}-${Date.now()}`,
  };
}

export async function mockRegister(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  householdName?: string;
}): Promise<AuthResponse> {
  await delay(1000); // Simulate API delay

  // Check if email already exists
  const existingUser = mockUsers.find(
    u => u.email.toLowerCase() === data.email.toLowerCase()
  );

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const newUser: User = {
    id: String(mockUsers.length + 1),
    email: data.email,
    role: 'PARENT', // New users start as PARENT
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    householdId: String(Date.now()), // New household
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  // Add to mock users (in a real app, this would be persisted)
  mockUsers.push(newUser);

  return {
    user: newUser,
    token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
    refreshToken: `mock-refresh-token-${newUser.id}-${Date.now()}`,
  };
}

export async function mockLogout(): Promise<void> {
  await delay(300);
  // In a real app, this would invalidate the token on the server
}

export async function mockRefreshToken(refreshToken: string): Promise<{ token: string }> {
  await delay(200);

  if (!refreshToken.startsWith('mock-refresh-token')) {
    throw new Error('Invalid refresh token');
  }

  return {
    token: `mock-jwt-token-refreshed-${Date.now()}`,
  };
}
