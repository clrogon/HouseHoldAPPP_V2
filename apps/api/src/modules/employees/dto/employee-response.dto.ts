import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmployeeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiProperty()
  position: string;

  @ApiPropertyOptional()
  department?: string;

  @ApiProperty()
  employmentType: string;

  @ApiProperty()
  salary: number;

  @ApiProperty()
  payFrequency: string;

  @ApiProperty()
  hireDate: string;

  @ApiPropertyOptional()
  terminationDate?: string;

  @ApiPropertyOptional()
  emergencyContactName?: string;

  @ApiPropertyOptional()
  emergencyContactPhone?: string;

  @ApiProperty()
  householdId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
