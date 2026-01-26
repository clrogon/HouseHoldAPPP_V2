import { format } from 'date-fns';
import {
  Banknote,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/currency';
import type { Employee, PayrollRecord } from '../types/employees.types';

interface PayrollSummaryProps {
  employees: Employee[];
  payrollRecords: PayrollRecord[];
  onProcessPayroll: (payrollId: string) => void;
}

export function PayrollSummary({
  employees,
  payrollRecords,
  onProcessPayroll,
}: PayrollSummaryProps) {
  const pendingPayroll = payrollRecords.filter(r => r.status === 'pending');
  const paidPayroll = payrollRecords.filter(r => r.status === 'paid');
  const totalPending = pendingPayroll.reduce((sum, r) => sum + r.netPay, 0);
  const totalPaid = paidPayroll.reduce((sum, r) => sum + r.netPay, 0);

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payroll</CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Pendente</p>
              <p className="text-lg font-bold text-orange-600">
                {formatCurrency(totalPending)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Pago (este período)</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(totalPaid)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {payrollRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <Banknote className="h-12 w-12 mb-4" />
            <p className="text-lg">Sem registos de pagamentos</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Gross Pay</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollRecords.map(record => {
                const grossPay = record.regularPay + record.overtimePay;
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {getEmployeeName(record.employeeId)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(record.periodStart), 'MMM d')} -{' '}
                        {format(new Date(record.periodEnd), 'MMM d')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {record.hoursWorked}h
                        {record.overtime > 0 && (
                          <span className="text-xs text-muted-foreground">
                            (+{record.overtime} OT)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(grossPay)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      -{formatCurrency(record.deductions)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(record.netPay)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'text-xs',
                          record.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        )}
                      >
                        {record.status === 'paid' ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => onProcessPayroll(record.id)}
                        >
                          Pay
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
