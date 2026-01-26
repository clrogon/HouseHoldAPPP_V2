import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponseDto } from './dto';
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
import { HouseholdGuard } from '../../common/guards';

@ApiTags('employees')
@ApiBearerAuth()
@UseGuards(HouseholdGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create employee' })
  @ApiResponse({ status: 201, type: EmployeeResponseDto })
  async createEmployee(@CurrentUser() user: JwtPayload, @Body() dto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    return this.employeesService.createEmployee(user.householdId!, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({ status: 200, type: [EmployeeResponseDto] })
  async getEmployees(@CurrentUser() user: JwtPayload): Promise<EmployeeResponseDto[]> {
    return this.employeesService.getEmployees(user.householdId!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee' })
  @ApiResponse({ status: 200, type: EmployeeResponseDto })
  async getEmployee(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<EmployeeResponseDto> {
    return this.employeesService.getEmployee(user.householdId!, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update employee' })
  @ApiResponse({ status: 200, type: EmployeeResponseDto })
  async updateEmployee(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    return this.employeesService.updateEmployee(user.householdId!, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete employee' })
  async deleteEmployee(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<{ success: boolean }> {
    return this.employeesService.deleteEmployee(user.householdId!, id);
  }
}
