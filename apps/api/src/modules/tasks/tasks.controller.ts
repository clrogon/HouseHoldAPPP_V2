import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from './dto';
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
import { HouseholdGuard } from '../../common/guards';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(HouseholdGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, type: TaskResponseDto })
  async createTask(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.createTask(user.householdId!, user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'assigneeId', required: false })
  @ApiResponse({ status: 200, type: [TaskResponseDto] })
  async getTasks(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<TaskResponseDto[]> {
    return this.tasksService.getTasks(user.householdId!, {
      status,
      priority,
      assigneeId,
      limit,
      offset,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  async getTask(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<TaskResponseDto> {
    return this.tasksService.getTask(user.householdId!, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  async updateTask(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.updateTask(user.householdId!, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200 })
  async deleteTask(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    return this.tasksService.deleteTask(user.householdId!, id);
  }
}
