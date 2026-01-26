import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsDateString, IsEnum, IsArray } from 'class-validator';

export enum EventCategory {
  BIRTHDAY = 'BIRTHDAY',
  APPOINTMENT = 'APPOINTMENT',
  MEETING = 'MEETING',
  HOLIDAY = 'HOLIDAY',
  SCHOOL = 'SCHOOL',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER',
}

export class CreateEventDto {
  @ApiProperty({ example: 'Doctor Appointment' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  allDay?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: EventCategory })
  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  attendeeIds?: string[];
}
