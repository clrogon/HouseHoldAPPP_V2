import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateVaccinationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDateString()
  dateGiven: string;

  @ApiProperty()
  @IsDateString()
  nextDue: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vet?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  certificateUrl?: string;
}
