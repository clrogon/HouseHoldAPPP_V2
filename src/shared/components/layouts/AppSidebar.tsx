import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Users,
  Car,
  PawPrint,
  CheckSquare,
  Package,
  ScanLine,
  Wallet,
  Calendar,
  ChefHat,
  Settings,
  Shield,
  Baby,
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
import { useLanguage } from '@/shared/i18n';

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { t } = useLanguage();

  const mainNavItems = [
    {
      title: t.navigation.dashboard,
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      title: t.navigation.household,
      icon: Home,
      href: '/household',
    },
    {
      title: t.navigation.employees,
      icon: Users,
      href: '/employees',
      roles: ['ADMIN', 'PARENT'],
    },
    {
      title: t.navigation.vehicles,
      icon: Car,
      href: '/vehicles',
    },
    {
      title: t.navigation.pets,
      icon: PawPrint,
      href: '/pets',
    },
    {
      title: t.navigation.kids,
      icon: Baby,
      href: '/kids',
    },
    {
      title: t.navigation.tasks,
      icon: CheckSquare,
      href: '/tasks',
    },
    {
      title: t.navigation.inventory,
      icon: Package,
      href: '/inventory',
    },
    {
      title: t.navigation.scanning,
      icon: ScanLine,
      href: '/scanning',
      roles: ['ADMIN', 'PARENT', 'STAFF'],
    },
    {
      title: t.navigation.finance,
      icon: Wallet,
      href: '/finance',
      roles: ['ADMIN', 'PARENT'],
    },
    {
      title: t.navigation.calendar,
      icon: Calendar,
      href: '/calendar',
    },
    {
      title: t.navigation.recipes,
      icon: ChefHat,
      href: '/recipes',
    },
  ];

  const adminNavItems = [
    {
      title: t.navigation.admin,
      icon: Shield,
      href: '/admin',
      roles: ['ADMIN'],
    },
  ];

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
          <SidebarGroupLabel>
            {t.navigation.dashboard === 'Painel' ? 'Navegação' : 'Navigation'}
          </SidebarGroupLabel>
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
            <SidebarGroupLabel>
              {t.navigation.admin === 'Administração' ? 'Administração' : 'Administration'}
            </SidebarGroupLabel>
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
                <span>{t.navigation.settings}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
