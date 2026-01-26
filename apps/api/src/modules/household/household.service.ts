import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import {
  UpdateHouseholdDto,
  InviteMemberDto,
  HouseholdResponseDto,
  HouseholdMemberDto,
} from './dto';
import { Role } from '@prisma/client';

@Injectable()
export class HouseholdService {
  private readonly logger = new Logger(HouseholdService.name);

  constructor(private prisma: PrismaService) {}

  async getHousehold(householdId: string): Promise<HouseholdResponseDto> {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    return this.mapToResponse(household);
  }

  async updateHousehold(
    householdId: string,
    userId: string,
    updateDto: UpdateHouseholdDto,
  ): Promise<HouseholdResponseDto> {
    // Verify user has permission (must be ADMIN or PARENT)
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!userProfile || userProfile.householdId !== householdId) {
      throw new ForbiddenException('Access denied');
    }

    if (!['ADMIN', 'PARENT'].includes(userProfile.user.role)) {
      throw new ForbiddenException('Only admins and parents can update household');
    }

    const household = await this.prisma.household.update({
      where: { id: householdId },
      data: {
        name: updateDto.name,
        address: updateDto.address,
        phone: updateDto.phone,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return this.mapToResponse(household);
  }

  async getMembers(householdId: string): Promise<HouseholdMemberDto[]> {
    const members = await this.prisma.userProfile.findMany({
      where: { householdId },
      include: { user: true },
    });

    return members.map((member) => ({
      id: member.user.id,
      email: member.user.email,
      role: member.user.role,
      firstName: member.firstName,
      lastName: member.lastName,
      avatar: member.avatar || undefined,
    }));
  }

  async inviteMember(
    householdId: string,
    inviterId: string,
    inviteDto: InviteMemberDto,
  ): Promise<HouseholdMemberDto> {
    // Verify inviter has permission
    const inviterProfile = await this.prisma.userProfile.findUnique({
      where: { userId: inviterId },
      include: { user: true },
    });

    if (!inviterProfile || inviterProfile.householdId !== householdId) {
      throw new ForbiddenException('Access denied');
    }

    if (!['ADMIN', 'PARENT'].includes(inviterProfile.user.role)) {
      throw new ForbiddenException('Only admins and parents can invite members');
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: inviteDto.email },
      include: { profile: true },
    });

    if (existingUser) {
      if (existingUser.profile?.householdId === householdId) {
        throw new ConflictException('User is already a member of this household');
      }
      if (existingUser.profile?.householdId) {
        throw new ConflictException('User already belongs to another household');
      }

      // Add existing user to household
      const updatedProfile = await this.prisma.userProfile.update({
        where: { userId: existingUser.id },
        data: { householdId },
        include: { user: true },
      });

      // Update user role
      await this.prisma.user.update({
        where: { id: existingUser.id },
        data: { role: (inviteDto.role as Role) || Role.MEMBER },
      });

      this.logger.log(`Existing user ${inviteDto.email} added to household ${householdId}`);

      return {
        id: updatedProfile.user.id,
        email: updatedProfile.user.email,
        role: inviteDto.role || 'MEMBER',
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        avatar: updatedProfile.avatar || undefined,
      };
    }

    // Create new user with temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: inviteDto.email,
        password: hashedPassword,
        role: (inviteDto.role as Role) || Role.MEMBER,
        profile: {
          create: {
            firstName: inviteDto.firstName || 'New',
            lastName: inviteDto.lastName || 'Member',
            householdId,
          },
        },
      },
      include: { profile: true },
    });

    this.logger.log(`New user ${inviteDto.email} invited to household ${householdId}`);

    // In production, send email with invitation link and temp password
    // For now, just return the new member

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      firstName: newUser.profile?.firstName || '',
      lastName: newUser.profile?.lastName || '',
      avatar: newUser.profile?.avatar || undefined,
    };
  }

  async removeMember(
    householdId: string,
    adminId: string,
    memberId: string,
  ): Promise<{ success: boolean }> {
    // Verify admin has permission
    const adminProfile = await this.prisma.userProfile.findUnique({
      where: { userId: adminId },
      include: { user: true },
    });

    if (!adminProfile || adminProfile.householdId !== householdId) {
      throw new ForbiddenException('Access denied');
    }

    if (!['ADMIN', 'PARENT'].includes(adminProfile.user.role)) {
      throw new ForbiddenException('Only admins and parents can remove members');
    }

    // Cannot remove yourself
    if (adminId === memberId) {
      throw new ForbiddenException('Cannot remove yourself from household');
    }

    // Get member to remove
    const memberProfile = await this.prisma.userProfile.findUnique({
      where: { userId: memberId },
    });

    if (!memberProfile || memberProfile.householdId !== householdId) {
      throw new NotFoundException('Member not found in household');
    }

    // Remove from household (don't delete user, just unlink)
    await this.prisma.userProfile.update({
      where: { userId: memberId },
      data: { householdId: null },
    });

    this.logger.log(`Member ${memberId} removed from household ${householdId}`);

    return { success: true };
  }

  private mapToResponse(household: {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
    members: Array<{
      firstName: string;
      lastName: string;
      avatar: string | null;
      user: {
        id: string;
        email: string;
        role: string;
      };
    }>;
  }): HouseholdResponseDto {
    return {
      id: household.id,
      name: household.name,
      address: household.address || undefined,
      phone: household.phone || undefined,
      creatorId: household.creatorId,
      members: household.members.map((m) => ({
        id: m.user.id,
        email: m.user.email,
        role: m.user.role,
        firstName: m.firstName,
        lastName: m.lastName,
        avatar: m.avatar || undefined,
      })),
      memberCount: household.members.length,
      createdAt: household.createdAt.toISOString(),
      updatedAt: household.updatedAt.toISOString(),
    };
  }
}
