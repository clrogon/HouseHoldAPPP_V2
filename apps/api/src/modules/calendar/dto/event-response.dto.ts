import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty()
  allDay: boolean;

  @ApiPropertyOptional()
  location?: string;

  @ApiProperty()
  category: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiProperty()
  isRecurring: boolean;

  @ApiProperty({ type: [String] })
  attendeeIds: string[];

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  householdId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
