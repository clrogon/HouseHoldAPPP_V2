import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MedicationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  dosage: string;

  @ApiProperty()
  frequency: string;

  @ApiProperty()
  startDate: string;

  @ApiPropertyOptional()
  endDate?: string;

  @ApiPropertyOptional()
  prescribedBy?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  petId: string;

  @ApiProperty()
  createdAt: string;
}
