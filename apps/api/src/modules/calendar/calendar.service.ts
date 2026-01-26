import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEventDto, UpdateEventDto, EventResponseDto } from './dto';
import { EventCategory as PrismaEventCategory } from '@prisma/client';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async createEvent(householdId: string, userId: string, dto: CreateEventDto): Promise<EventResponseDto> {
    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        allDay: dto.allDay || false,
        location: dto.location,
        category: (dto.category as PrismaEventCategory) || 'OTHER',
        color: dto.color,
        isRecurring: dto.isRecurring || false,
        attendeeIds: dto.attendeeIds || [],
        creatorId: userId,
        householdId,
      },
    });
    return this.mapEvent(event);
  }

  async getEvents(householdId: string, startDate?: string, endDate?: string): Promise<EventResponseDto[]> {
    const where: any = { householdId };
    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) where.startDate.gte = new Date(startDate);
      if (endDate) where.startDate.lte = new Date(endDate);
    }

    const events = await this.prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' },
    });
    return events.map((e) => this.mapEvent(e));
  }

  async getEvent(householdId: string, eventId: string): Promise<EventResponseDto> {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, householdId },
    });
    if (!event) throw new NotFoundException('Event not found');
    return this.mapEvent(event);
  }

  async updateEvent(householdId: string, eventId: string, dto: UpdateEventDto): Promise<EventResponseDto> {
    const existing = await this.prisma.event.findFirst({ where: { id: eventId, householdId } });
    if (!existing) throw new NotFoundException('Event not found');

    const event = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        title: dto.title,
        description: dto.description,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        allDay: dto.allDay,
        location: dto.location,
        category: dto.category as PrismaEventCategory | undefined,
        color: dto.color,
        isRecurring: dto.isRecurring,
        attendeeIds: dto.attendeeIds,
      },
    });
    return this.mapEvent(event);
  }

  async deleteEvent(householdId: string, eventId: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.event.findFirst({ where: { id: eventId, householdId } });
    if (!existing) throw new NotFoundException('Event not found');
    await this.prisma.event.delete({ where: { id: eventId } });
    return { success: true };
  }

  private mapEvent(event: any): EventResponseDto {
    return {
      id: event.id,
      title: event.title,
      description: event.description || undefined,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      allDay: event.allDay,
      location: event.location || undefined,
      category: event.category,
      color: event.color || undefined,
      isRecurring: event.isRecurring,
      attendeeIds: event.attendeeIds || [],
      creatorId: event.creatorId,
      householdId: event.householdId,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }
}
