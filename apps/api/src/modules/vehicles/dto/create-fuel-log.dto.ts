import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateFuelLogDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: 45.5 })
  @IsNumber()
  gallons: number;

  @ApiProperty({ example: 3.45 })
  @IsNumber()
  pricePerGallon: number;

  @ApiProperty({ example: 157.0 })
  @IsNumber()
  totalCost: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  mileage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  station?: string;
}

export class FuelLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  gallons: number;

  @ApiProperty()
  pricePerGallon: number;

  @ApiProperty()
  totalCost: number;

  @ApiPropertyOptional()
  mileage?: number;

  @ApiPropertyOptional()
  station?: string;

  @ApiProperty()
  vehicleId: string;

  @ApiProperty()
  createdAt: string;
}
