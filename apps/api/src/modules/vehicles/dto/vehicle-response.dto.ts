import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  make: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  year: number;

  @ApiPropertyOptional()
  color?: string;

  @ApiPropertyOptional()
  licensePlate?: string;

  @ApiPropertyOptional()
  vin?: string;

  @ApiPropertyOptional()
  mileage?: number;

  @ApiProperty()
  householdId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
