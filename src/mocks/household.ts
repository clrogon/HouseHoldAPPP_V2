export interface Household {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  createdAt: string;
  memberCount: number;
  inviteCode: string;
}

export interface HouseholdMember {
  id: string;
  odId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PARENT' | 'MEMBER' | 'STAFF';
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  joinedAt: string;
  lastActiveAt?: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Invitation {
  id: string;
  email: string;
  role: 'PARENT' | 'MEMBER' | 'STAFF';
  status: 'pending' | 'accepted' | 'expired';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
}

export const mockHousehold: Household = {
  id: '1',
  name: 'The Smith Family',
  address: '123 Main Street',
  city: 'Springfield',
  state: 'IL',
  zipCode: '62701',
  phone: '555-123-4567',
  createdAt: '2024-01-01T00:00:00Z',
  memberCount: 4,
  inviteCode: 'SMITH2024',
};

export const mockMembers: HouseholdMember[] = [
  {
    id: '1',
    odId: '1',
    email: 'john@household.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'PARENT',
    phone: '555-100-0001',
    dateOfBirth: '1985-03-15',
    joinedAt: '2024-01-01T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    status: 'active',
  },
  {
    id: '2',
    odId: '2',
    email: 'sarah@household.com',
    firstName: 'Sarah',
    lastName: 'Smith',
    role: 'PARENT',
    phone: '555-100-0002',
    dateOfBirth: '1987-07-22',
    joinedAt: '2024-01-01T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'active',
  },
  {
    id: '3',
    odId: '3',
    email: 'tommy@household.com',
    firstName: 'Tommy',
    lastName: 'Smith',
    role: 'MEMBER',
    dateOfBirth: '2010-11-08',
    joinedAt: '2024-01-05T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'active',
  },
  {
    id: '4',
    odId: '4',
    email: 'emma@household.com',
    firstName: 'Emma',
    lastName: 'Smith',
    role: 'MEMBER',
    dateOfBirth: '2012-05-20',
    joinedAt: '2024-01-05T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'active',
  },
  {
    id: '5',
    odId: '5',
    email: 'maria@household.com',
    firstName: 'Maria',
    lastName: 'Garcia',
    role: 'STAFF',
    phone: '555-100-0005',
    dateOfBirth: '1990-09-12',
    joinedAt: '2024-02-01T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 7200000).toISOString(),
    status: 'active',
  },
];

export const mockInvitations: Invitation[] = [
  {
    id: '1',
    email: 'grandma@email.com',
    role: 'MEMBER',
    status: 'pending',
    invitedBy: 'John Smith',
    invitedAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 6).toISOString(),
  },
  {
    id: '2',
    email: 'uncle.bob@email.com',
    role: 'MEMBER',
    status: 'expired',
    invitedBy: 'Sarah Smith',
    invitedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    expiresAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

// Mock API functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getHousehold(): Promise<Household> {
  await delay(300);
  return mockHousehold;
}

export async function getMembers(): Promise<HouseholdMember[]> {
  await delay(300);
  return mockMembers;
}

export async function getInvitations(): Promise<Invitation[]> {
  await delay(300);
  return mockInvitations;
}

export async function inviteMember(email: string, role: 'PARENT' | 'MEMBER' | 'STAFF'): Promise<Invitation> {
  await delay(500);
  const newInvitation: Invitation = {
    id: String(mockInvitations.length + 1),
    email,
    role,
    status: 'pending',
    invitedBy: 'Current User',
    invitedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
  };
  mockInvitations.push(newInvitation);
  return newInvitation;
}

export async function removeMember(memberId: string): Promise<void> {
  await delay(300);
  const index = mockMembers.findIndex(m => m.id === memberId);
  if (index !== -1) {
    mockMembers.splice(index, 1);
  }
}

export async function updateMemberRole(memberId: string, role: HouseholdMember['role']): Promise<HouseholdMember> {
  await delay(300);
  const member = mockMembers.find(m => m.id === memberId);
  if (!member) throw new Error('Member not found');
  member.role = role;
  return member;
}
