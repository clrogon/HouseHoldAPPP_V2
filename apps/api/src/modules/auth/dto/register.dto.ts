import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum RegisterRole {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  MEMBER = 'MEMBER',
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiPropertyOptional({ example: 'My Household' })
  @IsOptional()
  @IsString()
  householdName?: string;

  @ApiPropertyOptional({ enum: RegisterRole, default: RegisterRole.ADMIN })
  @IsOptional()
  @IsEnum(RegisterRole)
  role?: RegisterRole;
}
