import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { UpdateUserDto, UserProfileResponseDto, ChangePasswordDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string): Promise<UserProfileResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            household: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapToResponse(user);
  }

  async updateProfile(
    userId: string,
    updateDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.profile) {
      throw new NotFoundException('User profile not found');
    }

    const updatedProfile = await this.prisma.userProfile.update({
      where: { userId },
      data: {
        firstName: updateDto.firstName,
        lastName: updateDto.lastName,
        phone: updateDto.phone,
        address: updateDto.address,
        dateOfBirth: updateDto.dateOfBirth
          ? new Date(updateDto.dateOfBirth)
          : undefined,
        avatar: updateDto.avatar,
        language: updateDto.language,
        timezone: updateDto.timezone,
        theme: updateDto.theme,
      },
      include: {
        user: true,
        household: true,
      },
    });

    return this.mapToResponse({
      ...updatedProfile.user,
      profile: updatedProfile,
    });
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  }

  async findById(userId: string): Promise<UserProfileResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            household: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapToResponse(user);
  }

  private mapToResponse(user: {
    id: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    profile?: {
      firstName: string;
      lastName: string;
      phone?: string | null;
      address?: string | null;
      dateOfBirth?: Date | null;
      avatar?: string | null;
      householdId?: string | null;
      language: string;
      timezone: string;
      theme: string;
      updatedAt: Date;
      household?: { name: string } | null;
    } | null;
  }): UserProfileResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      phone: user.profile?.phone || undefined,
      address: user.profile?.address || undefined,
      dateOfBirth: user.profile?.dateOfBirth?.toISOString() || undefined,
      avatar: user.profile?.avatar || undefined,
      householdId: user.profile?.householdId || undefined,
      householdName: user.profile?.household?.name || undefined,
      language: user.profile?.language || 'en',
      timezone: user.profile?.timezone || 'UTC',
      theme: user.profile?.theme || 'light',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.profile?.updatedAt?.toISOString() || user.updatedAt.toISOString(),
    };
  }
}
