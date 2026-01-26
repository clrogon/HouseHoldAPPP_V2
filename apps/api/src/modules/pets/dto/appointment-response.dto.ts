import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AppointmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  reason: string;

  @ApiPropertyOptional()
  vet?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  cost?: number;

  @ApiProperty()
  petId: string;

  @ApiProperty()
  createdAt: string;
}
