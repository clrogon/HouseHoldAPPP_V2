import { useState, useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { EmployeeCard } from '../components/EmployeeCard';
import { PayrollSummary } from '../components/PayrollSummary';
import { ScheduleOverview } from '../components/ScheduleOverview';
import type { Employee, PayrollRecord, TimeEntry } from '../types/employees.types';
import { employeesApi } from '@/shared/api';
import { mockPayrollRecords, mockTimeEntries, processPayroll } from '@/mocks/employees';

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [_timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [_selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const data = await employeesApi.getEmployees();
        const mappedEmployees: Employee[] = data.map(e => ({
          id: e.id,
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.email,
          phone: e.phone,
          address: e.address,
          position: e.position,
          department: e.department,
          employmentType: e.employmentType as Employee['employmentType'],
          salary: e.salary,
          payFrequency: e.payFrequency as Employee['payFrequency'],
          hireDate: e.hireDate,
          terminationDate: e.terminationDate,
          emergencyContactName: e.emergencyContactName,
          emergencyContactPhone: e.emergencyContactPhone,
          photo: e.photo,
          status: e.terminationDate ? 'inactive' : 'active',
        }));
        setEmployees(mappedEmployees);
        setPayrollRecords(mockPayrollRecords);
        setTimeEntries(mockTimeEntries);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        setPayrollRecords(mockPayrollRecords);
        setTimeEntries(mockTimeEntries);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      !searchQuery ||
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const activeEmployees = filteredEmployees.filter(e => e.status === 'active');
  const inactiveEmployees = filteredEmployees.filter(e => e.status !== 'active');

  const handleProcessPayroll = async (payrollId: string) => {
    const updated = await processPayroll(payrollId);
    setPayrollRecords(prev =>
      prev.map(r => (r.id === payrollId ? updated : r))
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage household staff, schedules, and payroll.
          </p>
        </div>
      </div>

      {/* Schedule Overview */}
      <ScheduleOverview employees={employees} />

      {/* Tabs */}
      <Tabs defaultValue="directory" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="directory">
              Directory
              <Badge variant="secondary" className="ml-2">
                {activeEmployees.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="payroll">
              Payroll
              <Badge variant="secondary" className="ml-2">
                {payrollRecords.filter(r => r.status === 'pending').length} pending
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <TabsContent value="directory">
          {filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <Users className="h-12 w-12 mb-4" />
              <p className="text-lg">No employees found</p>
              <p className="text-sm">Add your first employee to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeEmployees.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Active Employees</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activeEmployees.map(employee => (
                      <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onSelect={setSelectedEmployee}
                      />
                    ))}
                  </div>
                </div>
              )}

              {inactiveEmployees.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-muted-foreground">
                    Inactive / On Leave
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {inactiveEmployees.map(employee => (
                      <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onSelect={setSelectedEmployee}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="payroll">
          <PayrollSummary
            employees={employees}
            payrollRecords={payrollRecords}
            onProcessPayroll={handleProcessPayroll}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
