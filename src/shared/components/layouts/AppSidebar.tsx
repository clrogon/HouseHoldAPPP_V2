import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Users,
  Car,
  PawPrint,
  CheckSquare,
  Package,
  Wallet,
  Calendar,
  ChefHat,
  Settings,
  Shield,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/shared/components/ui/sidebar';
import { useAuthStore } from '@/features/auth';

const mainNavItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Household',
    icon: Home,
    href: '/household',
  },
  {
    title: 'Employees',
    icon: Users,
    href: '/employees',
    roles: ['ADMIN', 'PARENT'],
  },
  {
    title: 'Vehicles',
    icon: Car,
    href: '/vehicles',
  },
  {
    title: 'Pets',
    icon: PawPrint,
    href: '/pets',
  },
  {
    title: 'Tasks',
    icon: CheckSquare,
    href: '/tasks',
  },
  {
    title: 'Inventory',
    icon: Package,
    href: '/inventory',
  },
  {
    title: 'Finance',
    icon: Wallet,
    href: '/finance',
    roles: ['ADMIN', 'PARENT'],
  },
  {
    title: 'Calendar',
    icon: Calendar,
    href: '/calendar',
  },
  {
    title: 'Recipes',
    icon: ChefHat,
    href: '/recipes',
  },
];

const adminNavItems = [
  {
    title: 'Admin Panel',
    icon: Shield,
    href: '/admin',
    roles: ['ADMIN'],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuthStore();

  const filterByRole = (items: typeof mainNavItems) => {
    return items.filter((item) => {
      if (!item.roles) return true;
      if (!user) return false;
      return item.roles.includes(user.role);
    });
  };

  const filteredMainNav = filterByRole(mainNavItems);
  const filteredAdminNav = filterByRole(adminNavItems);

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold">Household Hero</span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href}
                  >
                    <NavLink to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {filteredAdminNav.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAdminNav.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.href}
                    >
                      <NavLink to={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/settings'}>
              <NavLink to="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
