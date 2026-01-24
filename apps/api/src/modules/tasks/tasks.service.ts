import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from './dto';
import { TaskStatus as PrismaTaskStatus, Priority as PrismaPriority } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(
    householdId: string,
    userId: string,
    dto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        priority: (dto.priority as PrismaPriority) || 'MEDIUM',
        status: (dto.status as PrismaTaskStatus) || 'PENDING',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        assigneeId: dto.assigneeId,
        tags: dto.tags || [],
        isRecurring: dto.isRecurring || false,
        creatorId: userId,
        householdId,
      },
      include: {
        assignee: {
          include: { profile: true },
        },
      },
    });

    return this.mapTask(task);
  }

  async getTasks(
    householdId: string,
    options?: {
      status?: string;
      priority?: string;
      assigneeId?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<TaskResponseDto[]> {
    const where: any = { householdId };

    if (options?.status) where.status = options.status;
    if (options?.priority) where.priority = options.priority;
    if (options?.assigneeId) where.assigneeId = options.assigneeId;

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        assignee: {
          include: { profile: true },
        },
      },
      orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
      take: options?.limit || 100,
      skip: options?.offset || 0,
    });

    return tasks.map((t) => this.mapTask(t));
  }

  async getTask(householdId: string, taskId: string): Promise<TaskResponseDto> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, householdId },
      include: {
        assignee: {
          include: { profile: true },
        },
        subtasks: true,
        comments: {
          include: {
            author: { include: { profile: true } },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.mapTask(task);
  }

  async updateTask(
    householdId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const existing = await this.prisma.task.findFirst({
      where: { id: taskId, householdId },
    });

    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority as PrismaPriority | undefined,
        status: dto.status as PrismaTaskStatus | undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assigneeId: dto.assigneeId,
        tags: dto.tags,
        isRecurring: dto.isRecurring,
      },
      include: {
        assignee: {
          include: { profile: true },
        },
      },
    });

    return this.mapTask(task);
  }

  async deleteTask(householdId: string, taskId: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.task.findFirst({
      where: { id: taskId, householdId },
    });

    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.task.delete({ where: { id: taskId } });
    return { success: true };
  }

  private mapTask(task: any): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate?.toISOString() || undefined,
      assigneeId: task.assigneeId || undefined,
      assigneeName: task.assignee?.profile
        ? `${task.assignee.profile.firstName} ${task.assignee.profile.lastName}`
        : undefined,
      tags: task.tags || [],
      isRecurring: task.isRecurring,
      creatorId: task.creatorId,
      householdId: task.householdId,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
