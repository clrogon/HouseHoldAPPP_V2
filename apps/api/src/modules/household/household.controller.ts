import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HouseholdService } from './household.service';
import {
  UpdateHouseholdDto,
  InviteMemberDto,
  HouseholdResponseDto,
  HouseholdMemberDto,
} from './dto';
import { CurrentUser, JwtPayload } from '../../common/decorators';
import { HouseholdGuard } from '../../common/guards';

@ApiTags('household')
@ApiBearerAuth()
@UseGuards(HouseholdGuard)
@Controller('household')
export class HouseholdController {
  constructor(private householdService: HouseholdService) {}

  @Get()
  @ApiOperation({ summary: 'Get current household' })
  @ApiResponse({
    status: 200,
    description: 'Household retrieved',
    type: HouseholdResponseDto,
  })
  async getHousehold(
    @CurrentUser() user: JwtPayload,
  ): Promise<HouseholdResponseDto> {
    return this.householdService.getHousehold(user.householdId!);
  }

  @Patch()
  @ApiOperation({ summary: 'Update household details' })
  @ApiResponse({
    status: 200,
    description: 'Household updated',
    type: HouseholdResponseDto,
  })
  async updateHousehold(
    @CurrentUser() user: JwtPayload,
    @Body() updateDto: UpdateHouseholdDto,
  ): Promise<HouseholdResponseDto> {
    return this.householdService.updateHousehold(
      user.householdId!,
      user.sub,
      updateDto,
    );
  }

  @Get('members')
  @ApiOperation({ summary: 'Get household members' })
  @ApiResponse({
    status: 200,
    description: 'Members list',
    type: [HouseholdMemberDto],
  })
  async getMembers(
    @CurrentUser() user: JwtPayload,
  ): Promise<HouseholdMemberDto[]> {
    return this.householdService.getMembers(user.householdId!);
  }

  @Post('invite')
  @ApiOperation({ summary: 'Invite new member to household' })
  @ApiResponse({
    status: 201,
    description: 'Member invited',
    type: HouseholdMemberDto,
  })
  async inviteMember(
    @CurrentUser() user: JwtPayload,
    @Body() inviteDto: InviteMemberDto,
  ): Promise<HouseholdMemberDto> {
    return this.householdService.inviteMember(
      user.householdId!,
      user.sub,
      inviteDto,
    );
  }

  @Delete('members/:memberId')
  @ApiOperation({ summary: 'Remove member from household' })
  @ApiResponse({ status: 200, description: 'Member removed' })
  async removeMember(
    @CurrentUser() user: JwtPayload,
    @Param('memberId') memberId: string,
  ): Promise<{ success: boolean }> {
    return this.householdService.removeMember(
      user.householdId!,
      user.sub,
      memberId,
    );
  }
}
