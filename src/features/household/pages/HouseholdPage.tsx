import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { HouseholdProfile } from '../components/HouseholdProfile';
import { MembersList } from '../components/MembersList';
import { InvitationsList } from '../components/InvitationsList';
import { InviteMemberDialog } from '../components/InviteMemberDialog';
import { EditHouseholdDialog } from '../components/EditHouseholdDialog';
import { EditMemberDialog } from '../components/EditMemberDialog';
import { useAuthStore } from '@/features/auth';
import { householdApi } from '@/shared/api';
import { useToast } from '@/shared/hooks/use-toast';
import type { Household, HouseholdMember, Invitation } from '../types/household.types';

export function HouseholdPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editHouseholdOpen, setEditHouseholdOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<HouseholdMember | null>(null);

  const canManageMembers = user?.role === 'ADMIN' || user?.role === 'PARENT';

  // Load household data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [householdData, membersData, invitationsData] = await Promise.all([
          householdApi.getHousehold(),
          householdApi.getMembers(),
          canManageMembers ? householdApi.getInvitations().catch(() => []) : Promise.resolve([]),
        ]);
        setHousehold(householdData);
        setMembers(membersData);
        setInvitations(invitationsData);
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load household data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [canManageMembers, toast]);

  const handleInvite = async (email: string, role: 'PARENT' | 'MEMBER' | 'STAFF') => {
    try {
      const newInvitation = await householdApi.inviteMember(email, role);
      setInvitations([newInvitation, ...invitations]);
      toast({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${email}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send invitation',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await householdApi.removeMember(memberId);
      setMembers(members.filter(m => m.id !== memberId));
      toast({
        title: 'Member removed',
        description: 'The member has been removed from your household',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove member',
        variant: 'destructive',
      });
    }
  };

  const handleChangeRole = async (memberId: string, role: HouseholdMember['role']) => {
    try {
      const updated = await householdApi.updateMemberRole(memberId, role);
      setMembers(members.map(m => m.id === memberId ? updated : m));
      toast({
        title: 'Role updated',
        description: 'Member role has been updated',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update role',
        variant: 'destructive',
      });
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await householdApi.cancelInvitation(invitationId);
      setInvitations(invitations.filter(i => i.id !== invitationId));
      toast({
        title: 'Invitation cancelled',
        description: 'The invitation has been cancelled',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to cancel invitation',
        variant: 'destructive',
      });
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      const updated = await householdApi.resendInvitation(invitationId);
      setInvitations(invitations.map(i => i.id === invitationId ? updated : i));
      toast({
        title: 'Invitation resent',
        description: 'The invitation has been resent',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to resend invitation',
        variant: 'destructive',
      });
    }
  };

  const handleSaveHousehold = async (updated: Household) => {
    try {
      const result = await householdApi.updateHousehold(updated);
      setHousehold(result);
      toast({
        title: 'Household updated',
        description: 'Your household details have been saved',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update household',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEditMember = (member: HouseholdMember) => {
    setEditingMember(member);
  };

  const handleSaveMember = async (updated: HouseholdMember) => {
    setMembers(members.map(m => m.id === updated.id ? updated : m));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!household) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center">
        <p className="text-muted-foreground">Unable to load household data.</p>
        <p className="text-sm text-muted-foreground mt-2">Please check if the API server is running.</p>
      </div>
    );
  }

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
          <HouseholdProfile
            household={household}
            onEdit={() => setEditHouseholdOpen(true)}
          />
        </div>

        {/* Members and Invitations - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <MembersList
            members={members}
            onRemove={canManageMembers ? handleRemoveMember : undefined}
            onChangeRole={canManageMembers ? handleChangeRole : undefined}
            onEdit={canManageMembers ? handleEditMember : undefined}
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

      {/* Edit Household Dialog */}
      <EditHouseholdDialog
        household={household}
        open={editHouseholdOpen}
        onOpenChange={setEditHouseholdOpen}
        onSave={handleSaveHousehold}
      />

      {/* Edit Member Dialog */}
      {editingMember && (
        <EditMemberDialog
          member={editingMember}
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
          onSave={handleSaveMember}
        />
      )}
    </div>
  );
}
