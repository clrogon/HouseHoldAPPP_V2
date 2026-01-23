import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  UpdateUserDto,
  UserProfileResponseDto,
  ChangePasswordDto,
} from './dto';
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
    type: UserProfileResponseDto,
  })
  async getProfile(
    @CurrentUser() user: JwtPayload,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.getProfile(user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated',
    type: UserProfileResponseDto,
  })
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() updateDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateProfile(user.sub, updateDto);
  }

  @Post('me/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  async changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    return this.usersService.changePassword(user.sub, changePasswordDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string): Promise<UserProfileResponseDto> {
    return this.usersService.findById(id);
  }
}
