import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout, MainLayout } from '@/shared/components/layouts';

// Auth
import { LoginPage, RegisterPage, ProtectedRoute } from '@/features/auth';

// Dashboard
import { DashboardPage } from '@/features/dashboard';

// Household
import { HouseholdPage } from '@/features/household';

// Tasks
import { TasksPage } from '@/features/tasks';

// Calendar
import { CalendarPage } from '@/features/calendar';

// Inventory
import { InventoryPage } from '@/features/inventory';

// Finance
import { FinancePage } from '@/features/finance';

// Vehicles
import { VehiclesPage } from '@/features/vehicles';

// Employees
import { EmployeesPage } from '@/features/employees';

// Recipes
import { RecipesPage } from '@/features/recipes';

// Admin
import { AdminPage } from '@/features/admin';

// Settings
import { SettingsPage } from '@/features/settings';

// Profile
import { ProfilePage } from '@/features/profile';

// Pets
import { PetsPage } from '@/features/pets';

// Kids
import { KidsPage } from '@/features/kids';

// Scanning
import { ScanningPage } from '@/features/scanning';

// Placeholder pages for other modules
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">
          This module is coming soon.
        </p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  // Public routes (Auth)
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <PlaceholderPage title="Forgot Password" />,
      },
    ],
  },

  // Protected routes (Main app)
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/household',
        element: <HouseholdPage />,
      },
      {
        path: '/employees',
        element: (
          <ProtectedRoute roles={['ADMIN', 'PARENT']}>
            <EmployeesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/vehicles',
        element: <VehiclesPage />,
      },
      {
        path: '/pets',
        element: <PetsPage />,
      },
      {
        path: '/tasks',
        element: <TasksPage />,
      },
      {
        path: '/inventory',
        element: <InventoryPage />,
      },
      {
        path: '/finance',
        element: (
          <ProtectedRoute roles={['ADMIN', 'PARENT']}>
            <FinancePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/calendar',
        element: <CalendarPage />,
      },
      {
        path: '/recipes',
        element: <RecipesPage />,
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute roles={['ADMIN']}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/kids',
        element: <KidsPage />,
      },
      {
        path: '/scanning',
        element: (
          <ProtectedRoute roles={['ADMIN', 'PARENT', 'STAFF']}>
            <ScanningPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Root redirect
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },

  // Catch-all 404
  {
    path: '*',
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground mt-2">Page not found</p>
        </div>
      </div>
    ),
  },
]);
