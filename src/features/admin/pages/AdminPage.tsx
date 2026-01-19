import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { AdminStatsCards } from '../components/AdminStatsCards';
import { UserManagement } from '../components/UserManagement';
import { AuditLogList } from '../components/AuditLogList';
import type {
  SystemUser,
  SystemHousehold,
  AuditLog,
  SystemStats,
} from '../types/admin.types';
import {
  mockUsers,
  mockHouseholds,
  mockAuditLogs,
  mockStats,
  updateUserStatus,
} from '@/mocks/admin';

export function AdminPage() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [_households, setHouseholds] = useState<SystemHousehold[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setHouseholds(mockHouseholds);
      setAuditLogs(
        [...mockAuditLogs].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      );
      setStats(mockStats);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleUpdateUserStatus = async (userId: string, status: SystemUser['status']) => {
    const updated = await updateUserStatus(userId, status);
    setUsers(prev => prev.map(u => (u.id === userId ? updated : u)));
  };

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          System administration and monitoring.
        </p>
      </div>

      {/* Stats */}
      <AdminStatsCards stats={stats} />

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="households">Households</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement
            users={users}
            onUpdateStatus={handleUpdateUserStatus}
          />
        </TabsContent>

        <TabsContent value="households">
          <div className="text-muted-foreground text-center py-8">
            Household management coming soon
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogList logs={auditLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
