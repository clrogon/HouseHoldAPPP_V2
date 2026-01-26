import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Mail, Phone, Shield, UserMinus, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { HouseholdMember } from '@/mocks/household';
import { useAuthStore } from '@/features/auth';

interface MembersListProps {
  members: HouseholdMember[];
  onRemove?: (memberId: string) => void;
  onChangeRole?: (memberId: string, role: HouseholdMember['role']) => void;
  onEdit?: (member: HouseholdMember) => void;
}

const roleColors = {
  ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  PARENT: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  MEMBER: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  STAFF: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
};

const statusColors = {
  active: 'bg-green-500',
  inactive: 'bg-gray-400',
  pending: 'bg-amber-500',
};

export function MembersList({ members, onRemove, onChangeRole, onEdit }: MembersListProps) {
  const { user } = useAuthStore();
  const [removeDialog, setRemoveDialog] = useState<{ open: boolean; member: HouseholdMember | null }>({
    open: false,
    member: null,
  });

  const canManageMembers = user?.role === 'ADMIN' || user?.role === 'PARENT';

  const handleRemoveClick = (member: HouseholdMember) => {
    setRemoveDialog({ open: true, member });
  };

  const confirmRemove = () => {
    if (removeDialog.member && onRemove) {
      onRemove(removeDialog.member.id);
    }
    setRemoveDialog({ open: false, member: null });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Household Members</CardTitle>
              <CardDescription>{members.length} members</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${statusColors[member.status]}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {member.firstName} {member.lastName}
                      </p>
                      <Badge variant="secondary" className={roleColors[member.role]}>
                        {member.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{member.email}</span>
                      {member.lastActiveAt && (
                        <>
                          <span>•</span>
                          <span>
                            Active {formatDistanceToNow(new Date(member.lastActiveAt), { addSuffix: true })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {canManageMembers && member.id !== user?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(member)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Membro
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      {member.phone && (
                        <DropdownMenuItem>
                          <Phone className="h-4 w-4 mr-2" />
                          Call {member.phone}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onChangeRole?.(member.id, 'PARENT')}>
                        <Shield className="h-4 w-4 mr-2" />
                        Make Parent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onChangeRole?.(member.id, 'MEMBER')}>
                        <Shield className="h-4 w-4 mr-2" />
                        Make Member
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleRemoveClick(member)}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Remove Confirmation Dialog */}
      <Dialog open={removeDialog.open} onOpenChange={(open) => setRemoveDialog({ open, member: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {removeDialog.member?.firstName} {removeDialog.member?.lastName} from the household? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveDialog({ open: false, member: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
