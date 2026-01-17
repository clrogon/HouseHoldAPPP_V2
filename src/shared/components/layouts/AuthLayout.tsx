import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Household Hero
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your household with ease
          </p>
        </div>

        {/* Content Area */}
        <Outlet />
      </div>
    </div>
  );
}
