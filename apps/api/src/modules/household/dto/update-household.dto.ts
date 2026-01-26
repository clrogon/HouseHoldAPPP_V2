import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateHouseholdDto {
  @ApiPropertyOptional({ example: 'Smith Family Household' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Rua Principal, 123, Luanda' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+244923456789' })
  @IsOptional()
  @IsString()
  phone?: string;
}
