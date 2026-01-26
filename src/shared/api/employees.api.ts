import apiClient, { getApiErrorMessage } from './client';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  position: string;
  department?: string;
  employmentType: string;
  salary: number;
  payFrequency: string;
  hireDate: string;
  terminationDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  photo?: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryPayment {
  id: string;
  amount: number;
  paymentDate: string;
  period: string;
  paymentMethod?: string;
  notes?: string;
  employeeId: string;
  createdAt: string;
}

export interface EmployeeVacation {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  approved: boolean;
  notes?: string;
  employeeId: string;
  createdAt: string;
}

export interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  position: string;
  department?: string;
  employmentType: string;
  salary: number;
  payFrequency: string;
  hireDate: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  photo?: string;
}

export interface CreatePaymentData {
  amount: number;
  paymentDate: string;
  period: string;
  paymentMethod?: string;
  notes?: string;
}

export interface CreateVacationData {
  startDate: string;
  endDate: string;
  days: number;
  approved?: boolean;
  notes?: string;
}

export const employeesApi = {
  // Employees
  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    try {
      const response = await apiClient.post<Employee>('/employees', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getEmployees(): Promise<Employee[]> {
    try {
      const response = await apiClient.get<Employee[]>('/employees');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getEmployee(id: string): Promise<Employee> {
    try {
      const response = await apiClient.get<Employee>(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateEmployee(id: string, data: Partial<CreateEmployeeData>): Promise<Employee> {
    try {
      const response = await apiClient.patch<Employee>(`/employees/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async deleteEmployee(id: string): Promise<void> {
    try {
      await apiClient.delete(`/employees/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Payments
  async addPayment(employeeId: string, data: CreatePaymentData): Promise<SalaryPayment> {
    try {
      const response = await apiClient.post<SalaryPayment>(`/employees/${employeeId}/payments`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getPayments(employeeId: string): Promise<SalaryPayment[]> {
    try {
      const response = await apiClient.get<SalaryPayment[]>(`/employees/${employeeId}/payments`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Vacations
  async addVacation(employeeId: string, data: CreateVacationData): Promise<EmployeeVacation> {
    try {
      const response = await apiClient.post<EmployeeVacation>(`/employees/${employeeId}/vacations`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getVacations(employeeId: string): Promise<EmployeeVacation[]> {
    try {
      const response = await apiClient.get<EmployeeVacation[]>(`/employees/${employeeId}/vacations`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export default employeesApi;
