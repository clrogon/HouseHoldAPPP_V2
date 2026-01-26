import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HouseholdMemberDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  avatar?: string;
}

export class HouseholdResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty()
  creatorId: string;

  @ApiProperty({ type: [HouseholdMemberDto] })
  members: HouseholdMemberDto[];

  @ApiProperty()
  memberCount: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
