import apiClient, { getApiErrorMessage } from './client';
import type { Household, HouseholdMember, Invitation } from '@/features/household/types/household.types';

export const householdApi = {
  /**
   * Get current household details
   */
  async getHousehold(): Promise<Household> {
    try {
      const response = await apiClient.get<Household>('/household');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Update household details
   */
  async updateHousehold(data: Partial<Household>): Promise<Household> {
    try {
      const response = await apiClient.patch<Household>('/household', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Get household members
   */
  async getMembers(): Promise<HouseholdMember[]> {
    try {
      const response = await apiClient.get<HouseholdMember[]>('/household/members');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Invite a new member to the household
   */
  async inviteMember(email: string, role: 'PARENT' | 'MEMBER' | 'STAFF'): Promise<Invitation> {
    try {
      const response = await apiClient.post<Invitation>('/household/invite', {
        email,
        role,
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Remove a member from the household
   */
  async removeMember(memberId: string): Promise<void> {
    try {
      await apiClient.delete(`/household/members/${memberId}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Update member role
   */
  async updateMemberRole(memberId: string, role: HouseholdMember['role']): Promise<HouseholdMember> {
    try {
      const response = await apiClient.patch<HouseholdMember>(`/household/members/${memberId}`, {
        role,
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Get pending invitations
   */
  async getInvitations(): Promise<Invitation[]> {
    try {
      const response = await apiClient.get<Invitation[]>('/household/invitations');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Cancel an invitation
   */
  async cancelInvitation(invitationId: string): Promise<void> {
    try {
      await apiClient.delete(`/household/invitations/${invitationId}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Resend an invitation
   */
  async resendInvitation(invitationId: string): Promise<Invitation> {
    try {
      const response = await apiClient.post<Invitation>(`/household/invitations/${invitationId}/resend`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export default householdApi;
