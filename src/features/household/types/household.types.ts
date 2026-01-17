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
  id: string visaId: string;
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
