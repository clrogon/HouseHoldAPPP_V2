import { useState, useEffect } from 'react';
import { HouseholdProfile } from '../components/HouseholdProfile';
import { MembersList } from '../components/MembersList';
import { InvitationsList } from '../components/InvitationsList';
import { InviteMemberDialog } from '../components/InviteMemberDialog';
import { useAuthStore } from '@/features/auth';
import {
  mockHousehold,
  mockMembers,
  mockInvitations,
  inviteMember,
  type Household,
  type HouseholdMember,
  type Invitation,
} from '@/mocks/household';

export function HouseholdPage() {
  const { user } = useAuthStore();
  const [household, setHousehold] = useState<Household>(mockHousehold);
  const [members, setMembers] = useState<HouseholdMember[]>(mockMembers);
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);

  const canManageMembers = user?.role === 'ADMIN' || user?.role === 'PARENT';

  const handleInvite = async (email: string, role: 'PARENT' | 'MEMBER' | 'STAFF') => {
    const newInvitation = await inviteMember(email, role);
    setInvitations([newInvitation, ...invitations]);
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handleChangeRole = (memberId: string, role: HouseholdMember['role']) => {
    setMembers(members.map(m =>
      m.id === memberId ? { ...m, role } : m
    ));
  };

  const handleCancelInvitation = (invitationId: string) => {
    setInvitations(invitations.filter(i => i.id !== invitationId));
  };

  const handleResendInvitation = (invitationId: string) => {
    setInvitations(invitations.map(i =>
      i.id === invitationId
        ? {
            ...i,
            status: 'pending' as const,
            invitedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
          }
        : i
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Household</h1>
          <p className="text-muted-foreground">
            Manage your household profile and members
          </p>
        </div>
        {canManageMembers && (
          <InviteMemberDialog onInvite={handleInvite} />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Household Profile - Takes 1 column */}
        <div className="lg:col-span-1">
          <HouseholdProfile household={household} />
        </div>

        {/* Members and Invitations - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <MembersList
            members={members}
            onRemove={canManageMembers ? handleRemoveMember : undefined}
            onChangeRole={canManageMembers ? handleChangeRole : undefined}
          />

          {canManageMembers && invitations.length > 0 && (
            <InvitationsList
              invitations={invitations}
              onCancel={handleCancelInvitation}
              onResend={handleResendInvitation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
