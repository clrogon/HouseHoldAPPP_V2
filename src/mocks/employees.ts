// Stub file - API integration pending

// Re-export types from features for compatibility
export type { Employee, WorkSchedule, PayrollRecord, TimeEntry } from '@/features/employees/types/employees.types';

import type { Employee, PayrollRecord, TimeEntry } from '@/features/employees/types/employees.types';

export const mockEmployees: Employee[] = [];
export const mockPayrollRecords: PayrollRecord[] = [];
export const mockTimeEntries: TimeEntry[] = [];

// Legacy aliases
export const mockPayments = mockPayrollRecords;

export async function getEmployees(): Promise<Employee[]> {
  return [];
}

export async function createEmployee(_data: Partial<Employee>): Promise<Employee> {
  throw new Error('API integration required');
}

export async function updateEmployee(_id: string, _data: Partial<Employee>): Promise<Employee> {
  throw new Error('API integration required');
}

export async function deleteEmployee(_id: string): Promise<void> {
  return;
}

export async function getPayments(_employeeId: string): Promise<PayrollRecord[]> {
  return [];
}

export async function recordPayment(_data: Partial<PayrollRecord>): Promise<PayrollRecord> {
  throw new Error('API integration required');
}

export async function processPayroll(_employeeId: string): Promise<PayrollRecord> {
  throw new Error('API integration required');
}
