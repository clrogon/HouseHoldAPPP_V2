import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  species: string;

  @ApiPropertyOptional()
  breed?: string;

  @ApiPropertyOptional()
  birthDate?: string;

  @ApiPropertyOptional()
  gender?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiPropertyOptional()
  microchipNumber?: string;

  @ApiPropertyOptional()
  weight?: number;

  @ApiPropertyOptional()
  vetName?: string;

  @ApiPropertyOptional()
  vetPhone?: string;

  @ApiPropertyOptional()
  vetAddress?: string;

  @ApiProperty()
  householdId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
