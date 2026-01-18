import { format, formatDistanceToNow, isPast } from 'date-fns';
import { Mail, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { Invitation } from '@/mocks/household';

interface InvitationsListProps {
  invitations: Invitation[];
  onResend?: (invitationId: string) => void;
  onCancel?: (invitationId: string) => void;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    label: 'Pending',
  },
  accepted: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    label: 'Accepted',
  },
  expired: {
    icon: XCircle,
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    label: 'Expired',
  },
};

const roleColors = {
  PARENT: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  MEMBER: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  STAFF: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
};

export function InvitationsList({ invitations, onResend, onCancel }: InvitationsListProps) {
  if (invitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>Invitations waiting for response</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invitations.map((invitation) => {
            const config = statusConfig[invitation.status];
            const StatusIcon = config.icon;
            const isExpired = isPast(new Date(invitation.expiresAt));

            return (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-muted">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{invitation.email}</p>
                      <Badge variant="secondary" className={roleColors[invitation.role]}>
                        {invitation.role}
                      </Badge>
                      <Badge variant="secondary" className={config.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                      <span>Invited by {invitation.invitedBy}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(invitation.invitedAt), { addSuffix: true })}</span>
                      {invitation.status === 'pending' && !isExpired && (
                        <>
                          <span>•</span>
                          <span>
                            Expires {format(new Date(invitation.expiresAt), 'MMM d')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {invitation.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancel?.(invitation.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {invitation.status === 'expired' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onResend?.(invitation.id)}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Resend
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
