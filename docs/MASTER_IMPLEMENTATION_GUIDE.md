# MASTER IMPLEMENTATION GUIDE - Household Hero v2

**FOR: Claude Code Agent - Autonomous Development**
**PROJECT: Household Hero v2 - Complete Rewrite**
**APPROACH: Frontend-First Development**

---

## 🎯 Mission

Build a complete household management application with the following priorities:
1. **FRONTEND FIRST** - Build entire UI with mock data
2. **Backend Later** - Add real API after frontend is approved
3. **Modular** - Each feature is self-contained
4. **Dashboard-Driven** - Rich data visualization
5. **Professional** - Production-ready code quality

---

## 📚 Documentation Structure

Read these documents in order:

### 1. IMPLEMENTATION_PLAN.md (START HERE)
- Project overview
- Tech stack
- Module overview
- Success criteria

### 2. DEVELOPMENT_ROADMAP_FRONTEND_FIRST.md
- **CRITICAL: Frontend development (Weeks 1-10)**
- Week-by-week tasks
- Deliverables per phase
- Backend development (Weeks 11-16) - LATER

### 3. MODULE_SPECIFICATIONS.md
- Detailed specifications for all 12 modules
- User stories
- Acceptance criteria
- UI components
- Mock data structures

### 4. DATABASE_SCHEMA_COMPLETE.md
- Complete Prisma schema
- Use this when building backend (Week 11+)
- Database relationships
- Indexes and optimization

---

## 🚀 Quick Start Instructions

### For Fresh Project Directory

```bash
# 1. Create NEW project directory
mkdir household-hero-v2
cd household-hero-v2

# 2. Initialize React + Vite + TypeScript
npm create vite@latest . -- --template react-ts

# 3. Install dependencies (from roadmap Week 1)
npm install
npm install react-router-dom @tanstack/react-query zustand
npm install react-hook-form zod @hookform/resolvers
npm install axios date-fns clsx recharts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Install shadcn/ui
npx shadcn-ui@latest init
# When prompted:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# 5. Create project structure
mkdir -p src/{features,shared,app,mocks,types}
mkdir -p src/shared/{components,hooks,api,utils,types}
mkdir -p src/shared/components/{ui,layouts,common}

# 6. Start development
npm run dev
```

---

## 📋 Development Workflow

### Phase 1: Setup (Week 1)
1. ✅ Create project
2. ✅ Install dependencies
3. ✅ Set up project structure
4. ✅ Configure TailwindCSS
5. ✅ Install shadcn/ui components
6. ✅ Create layouts (Auth, Main)
7. ✅ Build authentication UI
8. ✅ Implement mock auth

### Phase 2-10: Frontend Modules (Weeks 2-10)
**For each module:**
1. Create feature directory
2. Build pages and components
3. Create mock data
4. Implement state management
5. Add to navigation
6. Test functionality
7. Commit changes

**Module Order:**
- Week 2: Dashboard
- Week 3: Household & Members
- Week 4: Employees
- Week 5: Vehicles
- Week 6: Pets
- Week 7: Tasks
- Week 8: Inventory (with categories)
- Week 9: Finance
- Week 10: Calendar & Recipes

### Phase 11-16: Backend (LATER - After Frontend Approved)
**DO NOT START BACKEND UNTIL INSTRUCTED!**

---

## 🎨 UI Component Library

### shadcn/ui Components to Install

```bash
# Week 1: Core components
npx shadcn-ui@latest add button input card form label
npx shadcn-ui@latest add select checkbox toast alert
npx shadcn-ui@latest add dropdown-menu avatar sidebar
npx shadcn-ui@latest add dialog sheet tabs accordion
npx shadcn-ui@latest add table badge progress

# Week 2: Dashboard components
npx shadcn-ui@latest add chart

# As needed:
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add command
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton
```

---

## 📁 Project Structure

```
household-hero-v2/
├── src/
│   ├── features/          # Feature modules
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   └── types/
│   │   ├── dashboard/
│   │   ├── household/
│   │   ├── employees/
│   │   ├── vehicles/
│   │   ├── pets/
│   │   ├── tasks/
│   │   ├── inventory/
│   │   ├── finance/
│   │   ├── calendar/
│   │   └── recipes/
│   │
│   ├── shared/            # Shared code
│   │   ├── components/
│   │   │   ├── ui/        # shadcn/ui
│   │   │   ├── layouts/
│   │   │   └── common/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   │
│   ├── mocks/             # Mock data
│   │   ├── auth.ts
│   │   ├── dashboardData.ts
│   │   ├── householdData.ts
│   │   └── ... (one per module)
│   │
│   ├── app/               # App setup
│   │   ├── providers/
│   │   ├── routes/
│   │   └── App.tsx
│   │
│   └── main.tsx
│
├── public/
├── docs/                  # Documentation (copy from planning repo)
└── package.json
```

---

## 🔧 Key Technologies

### Frontend Stack
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **Zustand** - Client state
- **TanStack Query** - Server state (future)
- **React Hook Form** - Forms
- **Zod** - Validation
- **Recharts** - Charts

### Development Tools
- **ESLint** - Linting
- **Prettier** - Formatting (optional)
- **Vitest** - Testing (future)

---

## 📦 Module Checklist

### For Each Module:

- [ ] Create feature directory
- [ ] Create pages
- [ ] Create components
- [ ] Create mock data file
- [ ] Implement CRUD operations (with mocks)
- [ ] Add routing
- [ ] Add to sidebar navigation
- [ ] Create dashboard widgets
- [ ] Test all functionality
- [ ] Ensure responsive design
- [ ] Commit with descriptive message

---

## 🎯 Acceptance Criteria

### For Each Week/Phase:

**Code Quality:**
- [ ] All TypeScript with proper types
- [ ] Components under 300 lines
- [ ] Reusable components in shared/
- [ ] Consistent naming conventions
- [ ] Clean, readable code

**Functionality:**
- [ ] All features working as specified
- [ ] Forms validate correctly
- [ ] Mock data displays properly
- [ ] Navigation works
- [ ] No console errors

**UI/UX:**
- [ ] Matches specifications
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Beautiful and polished

**Git:**
- [ ] Frequent commits
- [ ] Descriptive commit messages
- [ ] No uncommitted changes

---

## 🔑 Important Mock Data Patterns

### Auth Store (Zustand)
```typescript
// src/features/auth/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async (email, password) => {
    // Mock login logic
    const mockUser = { id: '1', email, role: 'PARENT' };
    set({ user: mockUser, token: 'mock-token', isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
```

### Module Store Pattern
```typescript
// src/features/tasks/store/taskStore.ts
import { create } from 'zustand';
import { mockTasks } from '@/mocks/taskData';

interface TaskState {
  tasks: Task[];
  createTask: (task: CreateTaskDTO) => void;
  updateTask: (id: string, task: UpdateTaskDTO) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: mockTasks,
  createTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: Date.now().toString() }]
    })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id)
    })),
}));
```

---

## 🎨 Dashboard Widget Pattern

### Stat Card Example
```typescript
// src/features/dashboard/components/StatCard.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 🚨 Common Pitfalls to Avoid

### ❌ DON'T:
- Start backend before frontend is done
- Create backend API endpoints yet
- Use real database
- Build authentication backend
- Create NestJS project yet
- Install Prisma yet
- Set up Docker yet

### ✅ DO:
- Focus entirely on frontend
- Use mock data for everything
- Build beautiful, functional UI
- Test all user flows
- Ensure responsive design
- Commit frequently
- Follow the roadmap

---

## 📝 Commit Message Guidelines

### Format:
```
<type>(<module>): <description>

[optional body]
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `ui`: UI changes
- `refactor`: Code refactoring
- `docs`: Documentation
- `style`: Formatting
- `chore`: Maintenance

### Examples:
```
feat(auth): add login and registration forms
feat(dashboard): create main dashboard with widgets
feat(tasks): implement kanban board view
feat(inventory): add category tree navigation
ui(employees): improve employee card layout
fix(finance): correct budget calculation
```

---

## 🎯 Success Metrics

### After Week 10 (Frontend Complete):
- [ ] All 12 modules implemented
- [ ] All pages navigable
- [ ] All forms functional
- [ ] All dashboards displaying data
- [ ] Responsive on all devices
- [ ] No broken links
- [ ] Clean code (no warnings/errors)
- [ ] Mock data comprehensive
- [ ] User can interact with all features
- [ ] Ready for demo/review

---

## 🔄 What Happens After Frontend?

### Week 11+: Backend Development
**ONLY START WHEN INSTRUCTED!**

1. Set up Docker (PostgreSQL + Redis)
2. Initialize NestJS
3. Set up Prisma with schema
4. Build authentication API
5. Build module APIs (one per week)
6. Connect frontend to backend
7. Replace mocks with real API calls
8. Testing and deployment

---

## 💡 Tips for Claude Code Agent

### Working Autonomously:
1. **Read all docs first** - Understand the full picture
2. **Follow roadmap exactly** - Don't skip steps
3. **One module at a time** - Complete before moving on
4. **Test as you go** - Ensure everything works
5. **Commit frequently** - After each component/feature
6. **Ask if unclear** - Don't assume
7. **Stay frontend-focused** - No backend yet!

### When Stuck:
1. Check MODULE_SPECIFICATIONS.md for details
2. Review mock data examples
3. Check similar modules for patterns
4. Ensure all dependencies installed
5. Check console for errors

### Code Quality:
- Use TypeScript properly
- Extract reusable components
- Keep components small
- Use consistent naming
- Comment complex logic
- Format code consistently

---

## 📞 Support

### For User:
Review progress weekly. Provide feedback on:
- UI/UX design
- Feature functionality
- Additional requirements
- Changes needed

### For Agent:
Follow specifications closely. When in doubt:
- Re-read specifications
- Check roadmap
- Review similar modules
- Ask clarifying questions

---

## 🎉 Let's Build!

### Your Mission:
1. **Read all documentation**
2. **Set up project** (Week 1)
3. **Build frontend** (Weeks 2-10)
4. **Get approval**
5. **Build backend** (Weeks 11-16)
6. **Launch** 🚀

### Current Status:
- ✅ Planning complete
- ✅ Documentation ready
- ⏳ **NEXT: Create project and start Week 1**

---

## 📋 Quick Reference

### Essential Commands:
```bash
# Development
npm run dev

# Install shadcn component
npx shadcn-ui@latest add [component]

# Git
git add .
git commit -m "feat(module): description"
git push
```

### Folder Creation:
```bash
# Create new feature module
mkdir -p src/features/module-name/{pages,components,store,types}
mkdir -p src/mocks
```

### Import Aliases:
```typescript
// Use @ for src imports
import { Button } from '@/shared/components/ui/button';
import { mockTasks } from '@/mocks/taskData';
```

---

## ✅ Pre-flight Checklist

Before starting:
- [ ] Fresh project directory created
- [ ] All documentation reviewed
- [ ] Roadmap understood
- [ ] Ready to commit to frontend-first approach
- [ ] No backend work until Week 11

---

**Ready to build Household Hero v2! 🏠✨**

**START HERE:** Week 1, Day 1 - Project Setup
