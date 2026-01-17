# Household Hero v2

A comprehensive household management application built with React, TypeScript, and modern web technologies.

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS v3** - Utility-first CSS
- **shadcn/ui** - UI component library
- **React Router v7** - Client-side routing
- **Zustand** - Client state management
- **TanStack Query** - Server state management
- **React Hook Form + Zod** - Form handling & validation
- **Recharts** - Data visualization

## Project Structure

```
src/
├── features/              # Feature modules
│   ├── auth/             # Authentication & authorization
│   ├── dashboard/        # Main dashboard
│   ├── household/        # Household & member management
│   ├── employees/        # Employee management
│   ├── vehicles/         # Vehicle tracking
│   ├── pets/             # Pet care management
│   ├── tasks/            # Task management
│   ├── inventory/        # Inventory with categories
│   ├── finance/          # Budget & finance
│   ├── calendar/         # Events & scheduling
│   └── recipes/          # Recipe management
│
├── shared/               # Shared code
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layouts/     # Layout components
│   │   └── common/      # Common reusable components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── utils/           # Utility functions
│   └── types/           # Shared TypeScript types
│
├── mocks/               # Mock data for development
│
├── app/                 # App configuration
│   ├── providers/       # React context providers
│   └── routes/          # Route configuration
│
└── main.tsx             # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 20+ (installed via Homebrew)
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@household.com | any (except "wrong") | ADMIN |
| parent@household.com | any (except "wrong") | PARENT |
| member@household.com | any (except "wrong") | MEMBER |
| staff@household.com | any (except "wrong") | STAFF |

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Development Progress

### Week 1: Project Setup & Foundation

#### Day 1-2: Initial Setup ✅
- [x] Initialize React + Vite + TypeScript
- [x] Install core dependencies
- [x] Set up TailwindCSS v3
- [x] Initialize shadcn/ui
- [x] Create project folder structure
- [x] Configure path aliases (@/)
- [x] Install core UI components

#### Day 3-5: Authentication UI & Layout ✅
- [x] Create AuthLayout component
- [x] Build Login page with form validation
- [x] Build Registration wizard (3 steps)
- [x] Implement mock authentication (Zustand)
- [x] Create ProtectedRoute component
- [x] Build MainLayout with sidebar navigation
- [x] Set up React Router with routes
- [x] Create Dashboard placeholder page

## Features Implemented

### Authentication
- Login form with email/password
- Show/hide password toggle
- Remember me checkbox
- Form validation with Zod
- Registration wizard (3 steps):
  - Step 1: Account info (email, password, confirm password)
  - Step 2: Personal info (first name, last name, phone)
  - Step 3: Household setup (create new or join existing)
- Protected routes with role-based access control
- Persistent auth state with Zustand + localStorage

### Layout
- Responsive sidebar navigation
- Top bar with user menu and notifications
- Role-based navigation filtering
- Dark mode support (via Tailwind)

### Dashboard
- Welcome message with user's name
- Quick stats cards (tasks, events, budget, inventory)
- Placeholder widgets for Tasks and Events

## Installed shadcn/ui Components

- button, input, card, form, label
- select, checkbox, toast/toaster, alert
- dropdown-menu, avatar, sidebar
- separator, sheet, tooltip, skeleton
- dialog, tabs, accordion, table, badge, progress

## Path Aliases

Use `@/` to import from the `src` directory:

```typescript
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { useAuthStore } from '@/features/auth'
```

## Documentation

All project documentation is in the `docs/` folder:
- `MASTER_IMPLEMENTATION_GUIDE.md` - Quick start guide
- `IMPLEMENTATION_PLAN.md` - Complete project overview
- `DEVELOPMENT_ROADMAP_FRONTEND_FIRST.md` - Week-by-week roadmap
- `MODULE_SPECIFICATIONS.md` - Detailed module specs
- `DATABASE_SCHEMA_COMPLETE.md` - Database schema (for backend phase)
- `SESSION_LOG_WEEK1_DAY1.md` - Session 1 implementation log

## Next Steps

### Week 2: Dashboard & Household Module
- Build complete dashboard with widgets
- Implement household management UI
- Member management with CRUD operations
- Member invitation system

## Contributing

This project follows the frontend-first development approach. See `docs/DEVELOPMENT_ROADMAP_FRONTEND_FIRST.md` for the complete development plan.

## License

Private - All rights reserved
