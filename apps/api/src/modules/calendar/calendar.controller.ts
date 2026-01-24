import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { CreateEventDto, UpdateEventDto, EventResponseDto } from './dto';
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
import { HouseholdGuard } from '../../common/guards';

@ApiTags('calendar')
@ApiBearerAuth()
@UseGuards(HouseholdGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post('events')
  @ApiOperation({ summary: 'Create event' })
  @ApiResponse({ status: 201, type: EventResponseDto })
  async createEvent(@CurrentUser() user: JwtPayload, @Body() dto: CreateEventDto): Promise<EventResponseDto> {
    return this.calendarService.createEvent(user.householdId!, user.sub, dto);
  }

  @Get('events')
  @ApiOperation({ summary: 'Get events' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: 200, type: [EventResponseDto] })
  async getEvents(
    @CurrentUser() user: JwtPayload,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<EventResponseDto[]> {
    return this.calendarService.getEvents(user.householdId!, startDate, endDate);
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Get event' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  async getEvent(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<EventResponseDto> {
    return this.calendarService.getEvent(user.householdId!, id);
  }

  @Patch('events/:id')
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  async updateEvent(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateEventDto): Promise<EventResponseDto> {
    return this.calendarService.updateEvent(user.householdId!, id, dto);
  }

  @Delete('events/:id')
  @ApiOperation({ summary: 'Delete event' })
  async deleteEvent(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<{ success: boolean }> {
    return this.calendarService.deleteEvent(user.householdId!, id);
  }
}
