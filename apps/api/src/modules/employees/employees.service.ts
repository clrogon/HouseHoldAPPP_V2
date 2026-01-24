import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponseDto } from './dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(householdId: string, dto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    const employee = await this.prisma.employee.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        position: dto.position,
        department: dto.department,
        employmentType: dto.employmentType,
        salary: dto.salary,
        payFrequency: dto.payFrequency,
        hireDate: new Date(dto.hireDate),
        emergencyContactName: dto.emergencyContactName,
        emergencyContactPhone: dto.emergencyContactPhone,
        householdId,
      },
    });
    return this.mapEmployee(employee);
  }

  async getEmployees(householdId: string): Promise<EmployeeResponseDto[]> {
    const employees = await this.prisma.employee.findMany({
      where: { householdId },
      orderBy: { firstName: 'asc' },
    });
    return employees.map((e) => this.mapEmployee(e));
  }

  async getEmployee(householdId: string, employeeId: string): Promise<EmployeeResponseDto> {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, householdId },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return this.mapEmployee(employee);
  }

  async updateEmployee(householdId: string, employeeId: string, dto: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    const existing = await this.prisma.employee.findFirst({ where: { id: employeeId, householdId } });
    if (!existing) throw new NotFoundException('Employee not found');

    const employee = await this.prisma.employee.update({
      where: { id: employeeId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        position: dto.position,
        department: dto.department,
        employmentType: dto.employmentType,
        salary: dto.salary,
        payFrequency: dto.payFrequency,
        hireDate: dto.hireDate ? new Date(dto.hireDate) : undefined,
        emergencyContactName: dto.emergencyContactName,
        emergencyContactPhone: dto.emergencyContactPhone,
      },
    });
    return this.mapEmployee(employee);
  }

  async deleteEmployee(householdId: string, employeeId: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.employee.findFirst({ where: { id: employeeId, householdId } });
    if (!existing) throw new NotFoundException('Employee not found');
    await this.prisma.employee.delete({ where: { id: employeeId } });
    return { success: true };
  }

  private mapEmployee(employee: any): EmployeeResponseDto {
    return {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email || undefined,
      phone: employee.phone || undefined,
      address: employee.address || undefined,
      position: employee.position,
      department: employee.department || undefined,
      employmentType: employee.employmentType,
      salary: employee.salary,
      payFrequency: employee.payFrequency,
      hireDate: employee.hireDate.toISOString(),
      terminationDate: employee.terminationDate?.toISOString() || undefined,
      emergencyContactName: employee.emergencyContactName || undefined,
      emergencyContactPhone: employee.emergencyContactPhone || undefined,
      householdId: employee.householdId,
      createdAt: employee.createdAt.toISOString(),
      updatedAt: employee.updatedAt.toISOString(),
    };
  }
}
