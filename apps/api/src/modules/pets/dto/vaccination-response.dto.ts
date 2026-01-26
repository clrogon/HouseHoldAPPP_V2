import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VaccinationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  dateGiven: string;

  @ApiProperty()
  nextDue: string;

  @ApiPropertyOptional()
  vet?: string;

  @ApiPropertyOptional()
  certificateUrl?: string;

  @ApiProperty()
  petId: string;

  @ApiProperty()
  createdAt: string;
}
