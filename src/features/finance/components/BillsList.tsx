import { format, differenceInDays } from 'date-fns';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Repeat,
  CreditCard,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/currency';
import type { Bill } from '../types/finance.types';

interface BillsListProps {
  bills: Bill[];
  onMarkPaid: (billId: string) => void;
}

export function BillsList({ bills, onMarkPaid }: BillsListProps) {
  const upcomingBills = bills.filter(b => !b.isPaid);
  const paidBills = bills.filter(b => b.isPaid);

  const getDaysUntilDue = (dueDate: string) => {
    return differenceInDays(new Date(dueDate), new Date());
  };

  const getBillStatus = (bill: Bill) => {
    if (bill.isPaid) return { label: 'Paid', color: 'text-green-600', bg: 'bg-green-100' };
    const days = getDaysUntilDue(bill.dueDate);
    if (days < 0) return { label: 'Overdue', color: 'text-red-600', bg: 'bg-red-100' };
    if (days <= 3) return { label: 'Due Soon', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'Upcoming', color: 'text-blue-600', bg: 'bg-blue-100' };
  };

  const BillItem = ({ bill }: { bill: Bill }) => {
    const status = getBillStatus(bill);
    const daysUntil = getDaysUntilDue(bill.dueDate);

    return (
      <div
        className={cn(
          'flex items-center justify-between p-4 border rounded-lg',
          bill.isPaid && 'bg-muted/50'
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', status.bg)}>
            {bill.isPaid ? (
              <CheckCircle2 className={cn('h-5 w-5', status.color)} />
            ) : daysUntil < 0 ? (
              <AlertCircle className={cn('h-5 w-5', status.color)} />
            ) : (
              <Clock className={cn('h-5 w-5', status.color)} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn('font-medium', bill.isPaid && 'line-through text-muted-foreground')}>
                {bill.name}
              </span>
              {bill.isRecurring && (
                <Badge variant="outline" className="text-xs">
                  <Repeat className="h-3 w-3 mr-1" />
                  {bill.recurrenceFrequency}
                </Badge>
              )}
              {bill.autoPay && (
                <Badge variant="secondary" className="text-xs">
                  <CreditCard className="h-3 w-3 mr-1" />
                  Auto Pay
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(new Date(bill.dueDate), 'MMM d, yyyy')}
              {!bill.isPaid && (
                <span className={status.color}>
                  ({daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : daysUntil === 0 ? 'Due today' : `${daysUntil} days left`})
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-semibold">{formatCurrency(bill.amount)}</div>
            <Badge variant="outline" className={cn(status.color)}>
              {status.label}
            </Badge>
          </div>
          {!bill.isPaid && (
            <Button size="sm" onClick={() => onMarkPaid(bill.id)}>
              Mark Paid
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bills & Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {upcomingBills.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Upcoming</h4>
            {upcomingBills.map(bill => (
              <BillItem key={bill.id} bill={bill} />
            ))}
          </div>
        )}

        {paidBills.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Recently Paid</h4>
            {paidBills.map(bill => (
              <BillItem key={bill.id} bill={bill} />
            ))}
          </div>
        )}

        {bills.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <Calendar className="h-12 w-12 mb-4" />
            <p className="text-lg">No bills yet</p>
            <p className="text-sm">Add your bills to track due dates</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
