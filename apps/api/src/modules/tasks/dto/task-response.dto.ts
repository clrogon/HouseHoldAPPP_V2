import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  dueDate?: string;

  @ApiPropertyOptional()
  assigneeId?: string;

  @ApiPropertyOptional()
  assigneeName?: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  isRecurring: boolean;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  householdId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
