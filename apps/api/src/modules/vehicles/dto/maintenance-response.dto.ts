import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MaintenanceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  date: string;

  @ApiPropertyOptional()
  mileage?: number;

  @ApiPropertyOptional()
  cost?: number;

  @ApiPropertyOptional()
  serviceProvider?: string;

  @ApiPropertyOptional()
  nextDueDate?: string;

  @ApiProperty()
  vehicleId: string;

  @ApiProperty()
  createdAt: string;
}
