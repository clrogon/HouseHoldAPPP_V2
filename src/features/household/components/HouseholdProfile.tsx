import { useState } from 'react';
import { Home, MapPin, Phone, Copy, Check, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { Household } from '@/mocks/household';

interface HouseholdProfileProps {
  household: Household;
  onEdit?: () => void;
}

export function HouseholdProfile({ household, onEdit }: HouseholdProfileProps) {
  const [copied, setCopied] = useState(false);

  const copyInviteCode = async () => {
    await navigator.clipboard.writeText(household.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fullAddress = [household.address, household.city, household.state, household.zipCode]
    .filter(Boolean)
    .join(', ');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Home className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{household.name}</CardTitle>
              <CardDescription>Household Profile</CardDescription>
            </div>
          </div>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        {fullAddress && (
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">{fullAddress}</p>
            </div>
          </div>
        )}

        {/* Phone */}
        {household.phone && (
          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{household.phone}</p>
            </div>
          </div>
        )}

        {/* Members */}
        <div className="flex items-start gap-3">
          <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Members</p>
            <p className="text-sm text-muted-foreground">{household.memberCount} members</p>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-start gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Created</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(household.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Invite Code */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-2">Invite Code</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg font-mono px-3 py-1">
              {household.inviteCode}
            </Badge>
            <Button variant="ghost" size="sm" onClick={copyInviteCode}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Share this code to invite new members
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
