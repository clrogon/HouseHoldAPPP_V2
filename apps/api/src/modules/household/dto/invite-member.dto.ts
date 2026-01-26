import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';

export enum InviteRole {
  PARENT = 'PARENT',
  MEMBER = 'MEMBER',
  STAFF = 'STAFF',
}

export class InviteMemberDto {
  @ApiProperty({ example: 'newmember@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ enum: InviteRole, default: InviteRole.MEMBER })
  @IsOptional()
  @IsEnum(InviteRole)
  role?: InviteRole;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;
}
