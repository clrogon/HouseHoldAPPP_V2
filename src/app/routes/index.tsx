import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout, MainLayout } from '@/shared/components/layouts';

// Auth
import { LoginPage, RegisterPage, ProtectedRoute } from '@/features/auth';

// Dashboard
import { DashboardPage } from '@/features/dashboard';

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
        element: <PlaceholderPage title="Household" />,
      },
      {
        path: '/employees',
        element: (
          <ProtectedRoute roles={['ADMIN', 'PARENT']}>
            <PlaceholderPage title="Employees" />
          </ProtectedRoute>
        ),
      },
      {
        path: '/vehicles',
        element: <PlaceholderPage title="Vehicles" />,
      },
      {
        path: '/pets',
        element: <PlaceholderPage title="Pets" />,
      },
      {
        path: '/tasks',
        element: <PlaceholderPage title="Tasks" />,
      },
      {
        path: '/inventory',
        element: <PlaceholderPage title="Inventory" />,
      },
      {
        path: '/finance',
        element: (
          <ProtectedRoute roles={['ADMIN', 'PARENT']}>
            <PlaceholderPage title="Finance" />
          </ProtectedRoute>
        ),
      },
      {
        path: '/calendar',
        element: <PlaceholderPage title="Calendar" />,
      },
      {
        path: '/recipes',
        element: <PlaceholderPage title="Recipes" />,
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute roles={['ADMIN']}>
            <PlaceholderPage title="Admin Panel" />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings',
        element: <PlaceholderPage title="Settings" />,
      },
      {
        path: '/profile',
        element: <PlaceholderPage title="Profile" />,
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
