# Development Roadmap - Frontend First Approach

**Strategy:** Build complete frontend with mock data first, then add real backend
**Timeline:** 8-10 weeks for frontend, 4-6 weeks for backend
**Purpose:** See and test UI/UX before committing to backend architecture

---

## Why Frontend First?

### Advantages
1. ✅ **Visual Feedback** - See the app working immediately
2. ✅ **UX Validation** - Test user flows before backend complexity
3. ✅ **Faster Iterations** - Change UI without database migrations
4. ✅ **Stakeholder Buy-in** - Show working product early
5. ✅ **Backend Certainty** - Know exactly what APIs you need

### Approach
- Build complete React frontend
- Use mock data and local state
- Implement all UI components
- Perfect the dashboards
- Then build NestJS backend to match

---

## PART 1: FRONTEND DEVELOPMENT (Weeks 1-10)

---

## Phase 1: Project Setup & Foundation (Week 1)

### Week 1, Day 1-2: Initial Setup

**Tasks:**
- [ ] Create new project directory `household-hero-v2`
- [ ] Initialize React + Vite + TypeScript
  ```bash
  npm create vite@latest household-hero-v2 -- --template react-ts
  ```
- [ ] Install core dependencies:
  ```bash
  npm install react-router-dom @tanstack/react-query zustand
  npm install react-hook-form zod @hookform/resolvers
  npm install axios date-fns clsx
  ```
- [ ] Install shadcn/ui:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  npx shadcn-ui@latest init
  ```
- [ ] Set up project structure:
  ```
  src/
  ├── features/
  ├── shared/
  ├── app/
  ├── mocks/
  └── types/
  ```

**Deliverables:**
- ✅ Working Vite dev server
- ✅ TailwindCSS configured
- ✅ shadcn/ui initialized
- ✅ Project structure created

---

### Week 1, Day 3-5: Authentication UI & Layout

**Tasks:**
- [ ] Install shadcn/ui components:
  ```bash
  npx shadcn-ui@latest add button input card form label
  npx shadcn-ui@latest add select checkbox toast
  npx shadcn-ui@latest add dropdown-menu avatar sidebar
  ```
- [ ] Create `features/auth/` structure
- [ ] Build Login page with form validation
- [ ] Build Registration page (multi-step wizard)
- [ ] Create AuthLayout component
- [ ] Implement mock authentication (Zustand store)
- [ ] Create ProtectedRoute component
- [ ] Build MainLayout with sidebar and top bar

**Components to Create:**
```typescript
// features/auth/
├── pages/
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── components/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ProtectedRoute.tsx
├── store/
│   └── authStore.ts (Zustand)
└── types/
    └── auth.types.ts

// shared/layouts/
├── AuthLayout.tsx
├── MainLayout.tsx
├── Sidebar.tsx
└── TopBar.tsx
```

**Mock Data:**
```typescript
// mocks/auth.ts
export const mockUsers = [
  {
    id: '1',
    email: 'admin@household.com',
    role: 'ADMIN',
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    id: '2',
    email: 'parent@household.com',
    role: 'PARENT',
    firstName: 'Parent',
    lastName: 'User'
  }
];

export const mockLogin = (email: string, password: string) => {
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'password') {
    return {
      user,
      token: 'mock-jwt-token'
    };
  }
  throw new Error('Invalid credentials');
};
```

**Deliverables:**
- ✅ Working login/logout flow
- ✅ Registration wizard (3 steps: Account → Profile → Household)
- ✅ Main layout with sidebar navigation
- ✅ Protected routes working
- ✅ Mock auth state management

---

## Phase 2: Dashboard Foundation (Week 2)

### Week 2: Main Dashboard & Admin Dashboard

**Tasks:**
- [ ] Install chart library:
  ```bash
  npm install recharts
  npx shadcn-ui@latest add chart
  ```
- [ ] Create dashboard grid system
- [ ] Build reusable dashboard card components
- [ ] Create stat card components
- [ ] Build chart components (line, bar, pie, area)
- [ ] Create quick action buttons
- [ ] Build recent activity feed
- [ ] Create Main Dashboard (all users)
- [ ] Create Admin Dashboard

**Components:**
```typescript
// features/dashboard/
├── components/
│   ├── DashboardGrid.tsx
│   ├── StatCard.tsx
│   ├── ChartCard.tsx
│   ├── QuickActions.tsx
│   ├── RecentActivity.tsx
│   ├── UpcomingEvents.tsx
│   └── TasksOverview.tsx
├── pages/
│   ├── MainDashboard.tsx
│   └── AdminDashboard.tsx
└── mocks/
    └── dashboardData.ts
```

**Main Dashboard Widgets:**
1. Welcome card with personalized greeting
2. Quick stats (Tasks, Events, Budget, Inventory)
3. My Tasks overview
4. Upcoming Events (next 7 days)
5. Budget summary
6. Recent Activity feed
7. Quick action buttons (New Task, New Event, Add Item)

**Admin Dashboard Widgets:**
1. System Health indicators
2. User statistics (total, active, by role)
3. Household statistics
4. Module usage charts
5. Recent Activity (all households)
6. Quick admin actions

**Mock Data:**
```typescript
// mocks/dashboardData.ts
export const mockDashboardStats = {
  tasks: { total: 24, pending: 8, inProgress: 6, completed: 10 },
  events: { today: 3, thisWeek: 12, thisMonth: 28 },
  budget: { spent: 3250, total: 5000, percentage: 65 },
  inventory: { total: 156, lowStock: 8, expiring: 4 }
};

export const mockRecentActivity = [
  {
    id: '1',
    type: 'task',
    title: 'Completed "Weekly Grocery Shopping"',
    user: 'John Doe',
    timestamp: '2 hours ago'
  },
  // ... more items
];
```

**Deliverables:**
- ✅ Beautiful, responsive dashboard
- ✅ Multiple chart types working
- ✅ Stat cards with mock data
- ✅ Activity feed
- ✅ Admin dashboard with system stats

---

## Phase 3: Household & Members Module (Week 3)

### Week 3: Household Management UI

**Tasks:**
- [ ] Create household management pages
- [ ] Build household profile editor
- [ ] Create member list view (table + grid)
- [ ] Build member profile cards
- [ ] Create member registration form
- [ ] Build family tree visualization (optional)
- [ ] Create role assignment UI
- [ ] Build member invitation system UI

**Pages:**
```typescript
// features/household/
├── pages/
│   ├── HouseholdPage.tsx        // Overview
│   ├── MembersPage.tsx          // All members
│   ├── MemberDetailPage.tsx     // Single member
│   └── HouseholdSettingsPage.tsx
├── components/
│   ├── HouseholdCard.tsx
│   ├── MemberList.tsx
│   ├── MemberCard.tsx
│   ├── MemberForm.tsx
│   ├── RoleSelector.tsx
│   └── InvitationForm.tsx
└── mocks/
    └── householdData.ts
```

**Mock Data:**
```typescript
export const mockHousehold = {
  id: '1',
  name: 'Smith Family',
  members: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      role: 'PARENT',
      email: 'john@smith.com',
      avatar: '/avatars/john.jpg',
      joinedAt: '2024-01-01'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'PARENT',
      email: 'jane@smith.com',
      avatar: '/avatars/jane.jpg',
      joinedAt: '2024-01-01'
    },
    {
      id: '3',
      firstName: 'Tommy',
      lastName: 'Smith',
      role: 'MEMBER',
      email: 'tommy@smith.com',
      avatar: '/avatars/tommy.jpg',
      joinedAt: '2024-01-05'
    }
  ],
  createdAt: '2024-01-01'
};
```

**Deliverables:**
- ✅ Household overview page
- ✅ Member management interface
- ✅ Member profile pages
- ✅ Registration/invitation flows
- ✅ Role management UI

---

## Phase 4: Employees Module (Week 4)

### Week 4: Employee Management UI

**Tasks:**
- [ ] Create employee list view
- [ ] Build employee profile pages
- [ ] Create employee registration form
- [ ] Build salary management UI
- [ ] Create payment history table
- [ ] Build vacation/leave tracker
- [ ] Create schedule calendar
- [ ] Build document upload UI (mockup)

**Pages:**
```typescript
// features/employees/
├── pages/
│   ├── EmployeesPage.tsx
│   ├── EmployeeDetailPage.tsx
│   ├── EmployeeFormPage.tsx
│   └── PayrollPage.tsx
├── components/
│   ├── EmployeeList.tsx
│   ├── EmployeeCard.tsx
│   ├── EmployeeForm.tsx
│   ├── SalaryManager.tsx
│   ├── PaymentHistoryTable.tsx
│   ├── VacationTracker.tsx
│   └── ScheduleCalendar.tsx
└── mocks/
    └── employeeData.ts
```

**Mock Data:**
```typescript
export const mockEmployees = [
  {
    id: '1',
    firstName: 'Maria',
    lastName: 'Garcia',
    position: 'Housekeeper',
    email: 'maria@example.com',
    phone: '555-0101',
    salary: 2500,
    hireDate: '2023-06-01',
    payments: [
      { id: '1', amount: 2500, date: '2024-01-31', notes: 'January 2024' },
      { id: '2', amount: 2500, date: '2024-02-29', notes: 'February 2024' }
    ],
    vacations: [
      { id: '1', startDate: '2024-03-15', endDate: '2024-03-20', approved: true }
    ]
  }
];
```

**Deliverables:**
- ✅ Employee directory
- ✅ Employee profiles
- ✅ Payroll management UI
- ✅ Vacation tracker
- ✅ Schedule view

---

## Phase 5: Vehicles Module (Week 5)

### Week 5: Vehicle Management UI

**Tasks:**
- [ ] Create vehicle gallery view
- [ ] Build vehicle detail pages
- [ ] Create vehicle registration form
- [ ] Build maintenance scheduler
- [ ] Create service history timeline
- [ ] Build fuel log tracker
- [ ] Create insurance tracker with alerts
- [ ] Build expense charts

**Pages:**
```typescript
// features/vehicles/
├── pages/
│   ├── VehiclesPage.tsx
│   ├── VehicleDetailPage.tsx
│   ├── VehicleFormPage.tsx
│   └── MaintenancePage.tsx
├── components/
│   ├── VehicleGrid.tsx
│   ├── VehicleCard.tsx
│   ├── VehicleForm.tsx
│   ├── MaintenanceSchedule.tsx
│   ├── ServiceHistory.tsx
│   ├── FuelLog.tsx
│   ├── InsuranceTracker.tsx
│   └── ExpenseChart.tsx
└── mocks/
    └── vehicleData.ts
```

**Mock Data:**
```typescript
export const mockVehicles = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    color: 'Silver',
    vin: '1HGBH41JXMN109186',
    licensePlate: 'ABC 1234',
    mileage: 15420,
    insurance: {
      provider: 'State Farm',
      policyNumber: 'SF-123456',
      expiryDate: '2024-12-31'
    },
    maintenance: [
      { type: 'Oil Change', date: '2024-02-15', mileage: 15000, cost: 45 },
      { type: 'Tire Rotation', date: '2024-01-10', mileage: 14500, cost: 35 }
    ],
    fuelLogs: [
      { date: '2024-03-01', gallons: 12, cost: 48, mileage: 15420 }
    ]
  }
];
```

**Dashboard Widgets:**
- Upcoming maintenance alerts
- Insurance expiration warnings
- Fuel efficiency trends
- Expense breakdown

**Deliverables:**
- ✅ Vehicle gallery
- ✅ Vehicle detail pages
- ✅ Maintenance tracking
- ✅ Fuel logging
- ✅ Insurance alerts
- ✅ Dashboard widgets

---

## Phase 6: Pets Module (Week 6)

### Week 6: Pet Management UI

**Tasks:**
- [ ] Create pet gallery view
- [ ] Build pet profile pages
- [ ] Create pet registration form
- [ ] Build vaccination tracker
- [ ] Create vet appointment calendar
- [ ] Build medication scheduler
- [ ] Create weight tracker with charts
- [ ] Build medical history timeline

**Pages:**
```typescript
// features/pets/
├── pages/
│   ├── PetsPage.tsx
│   ├── PetDetailPage.tsx
│   ├── PetFormPage.tsx
│   └── HealthPage.tsx
├── components/
│   ├── PetGrid.tsx
│   ├── PetCard.tsx
│   ├── PetForm.tsx
│   ├── VaccinationTracker.tsx
│   ├── VetAppointments.tsx
│   ├── MedicationSchedule.tsx
│   ├── WeightChart.tsx
│   └── MedicalHistory.tsx
└── mocks/
    └── petData.ts
```

**Mock Data:**
```typescript
export const mockPets = [
  {
    id: '1',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    birthDate: '2020-05-15',
    gender: 'Male',
    weight: 32, // kg
    photo: '/pets/max.jpg',
    vaccinations: [
      { name: 'Rabies', date: '2023-06-01', nextDue: '2024-06-01' },
      { name: 'DHPP', date: '2023-06-01', nextDue: '2024-06-01' }
    ],
    vetAppointments: [
      { date: '2024-03-15', reason: 'Annual checkup', vet: 'Dr. Smith' }
    ],
    medications: [
      { name: 'Heartworm Prevention', frequency: 'Monthly', lastGiven: '2024-03-01' }
    ],
    weightHistory: [
      { date: '2024-01-01', weight: 30 },
      { date: '2024-02-01', weight: 31 },
      { date: '2024-03-01', weight: 32 }
    ]
  }
];
```

**Dashboard Widgets:**
- Upcoming vet appointments
- Vaccination due dates
- Medication reminders
- Weight trends

**Deliverables:**
- ✅ Pet gallery
- ✅ Pet profiles with photos
- ✅ Health tracking
- ✅ Vaccination management
- ✅ Appointment scheduling
- ✅ Dashboard widgets

---

## Phase 7: Tasks Module (Week 7)

### Week 7: Task Management UI

**Tasks:**
- [ ] Create task list views (list, kanban, calendar)
- [ ] Build task detail modal/page
- [ ] Create task creation form
- [ ] Build subtask management
- [ ] Create task comments section
- [ ] Build task assignment UI
- [ ] Create task templates
- [ ] Build recurring task setup
- [ ] Create task filters and search

**Pages:**
```typescript
// features/tasks/
├── pages/
│   ├── TasksPage.tsx           // Main view with tabs
│   ├── TaskListView.tsx
│   ├── TaskKanbanView.tsx
│   ├── TaskCalendarView.tsx
│   └── TaskDetailPage.tsx
├── components/
│   ├── TaskList.tsx
│   ├── TaskCard.tsx
│   ├── TaskForm.tsx
│   ├── TaskKanban.tsx
│   ├── SubtaskList.tsx
│   ├── TaskComments.tsx
│   ├── TaskAssignment.tsx
│   ├── TaskFilters.tsx
│   └── TaskTemplates.tsx
└── mocks/
    └── taskData.ts
```

**Mock Data:**
```typescript
export const mockTasks = [
  {
    id: '1',
    title: 'Weekly Grocery Shopping',
    description: 'Buy groceries for the week',
    priority: 'HIGH',
    status: 'PENDING',
    dueDate: '2024-03-15T10:00:00Z',
    assignee: { id: '1', name: 'John Smith' },
    creator: { id: '2', name: 'Jane Smith' },
    subtasks: [
      { id: '1', title: 'Make shopping list', completed: true },
      { id: '2', title: 'Go to store', completed: false },
      { id: '3', title: 'Put away groceries', completed: false }
    ],
    comments: [
      { id: '1', author: 'Jane', text: 'Don\'t forget milk!', timestamp: '2024-03-10' }
    ],
    tags: ['shopping', 'weekly'],
    createdAt: '2024-03-08'
  }
];
```

**Dashboard Widgets:**
- My tasks overview
- Overdue tasks alert
- Completed tasks chart
- Task distribution by member

**Deliverables:**
- ✅ Multiple task views (list, kanban, calendar)
- ✅ Task CRUD operations
- ✅ Subtasks and comments
- ✅ Assignment and filtering
- ✅ Dashboard widgets

---

## Phase 8: Inventory Module (Week 8)

### Week 8: Inventory with Categories UI

**Tasks:**
- [ ] Create inventory list view with categories
- [ ] Build category tree navigation
- [ ] Create item detail pages
- [ ] Build item creation form with category selector
- [ ] Create category management (create, edit, delete, reorder)
- [ ] Build subcategory nesting UI
- [ ] Create low stock alerts
- [ ] Build shopping list generator
- [ ] Create expiry date tracker

**Pages:**
```typescript
// features/inventory/
├── pages/
│   ├── InventoryPage.tsx       // Main view
│   ├── ItemDetailPage.tsx
│   ├── ItemFormPage.tsx
│   ├── CategoriesPage.tsx
│   └── ShoppingListPage.tsx
├── components/
│   ├── CategoryTree.tsx         // Hierarchical navigation
│   ├── CategoryManager.tsx
│   ├── ItemList.tsx
│   ├── ItemCard.tsx
│   ├── ItemForm.tsx
│   ├── CategorySelector.tsx     // Nested select
│   ├── LowStockAlert.tsx
│   ├── ExpiryTracker.tsx
│   └── ShoppingList.tsx
└── mocks/
    └── inventoryData.ts
```

**Mock Data:**
```typescript
export const mockCategories = [
  {
    id: '1',
    name: 'Kitchen',
    icon: 'utensils',
    children: [
      {
        id: '1-1',
        name: 'Appliances',
        children: [
          { id: '1-1-1', name: 'Small Appliances' },
          { id: '1-1-2', name: 'Large Appliances' }
        ]
      },
      { id: '1-2', name: 'Cookware' },
      { id: '1-3', name: 'Utensils' }
    ]
  },
  {
    id: '2',
    name: 'Pantry',
    icon: 'cookie',
    children: [
      { id: '2-1', name: 'Dry Goods' },
      { id: '2-2', name: 'Canned Foods' },
      { id: '2-3', name: 'Spices' }
    ]
  },
  {
    id: '3',
    name: 'Garage',
    icon: 'wrench',
    children: [
      { id: '3-1', name: 'Tools' },
      { id: '3-2', name: 'Hardware' }
    ]
  }
];

export const mockInventoryItems = [
  {
    id: '1',
    name: 'Blender',
    category: ['Kitchen', 'Appliances', 'Small Appliances'],
    categoryId: '1-1-1',
    quantity: 1,
    unit: 'piece',
    location: 'Kitchen Counter',
    purchaseDate: '2023-05-10',
    purchasePrice: 89.99,
    lowStockThreshold: 1,
    photo: '/items/blender.jpg'
  },
  {
    id: '2',
    name: 'Flour',
    category: ['Pantry', 'Dry Goods'],
    categoryId: '2-1',
    quantity: 2.5,
    unit: 'kg',
    location: 'Pantry Shelf 2',
    expiryDate: '2024-12-31',
    lowStockThreshold: 1,
    purchasePrice: 5.99
  }
];
```

**Category Features:**
- Drag-and-drop reordering
- Nested categories (unlimited levels)
- Category icons
- Item count per category
- Category-based filtering

**Dashboard Widgets:**
- Low stock items
- Expiring soon
- Inventory value
- Category distribution pie chart

**Deliverables:**
- ✅ Hierarchical category navigation
- ✅ Category management
- ✅ Item management
- ✅ Stock alerts
- ✅ Shopping list
- ✅ Dashboard widgets

---

## Phase 9: Finance Module (Week 9)

### Week 9: Finance & Budget UI

**Tasks:**
- [ ] Create finance dashboard
- [ ] Build budget management
- [ ] Create transaction logging
- [ ] Build category management
- [ ] Create bill tracker
- [ ] Build income/expense charts
- [ ] Create financial reports
- [ ] Build budget vs actual comparisons

**Pages:**
```typescript
// features/finance/
├── pages/
│   ├── FinanceDashboard.tsx     // Main finance overview
│   ├── BudgetsPage.tsx
│   ├── TransactionsPage.tsx
│   ├── BillsPage.tsx
│   └── ReportsPage.tsx
├── components/
│   ├── BudgetCard.tsx
│   ├── BudgetForm.tsx
│   ├── TransactionList.tsx
│   ├── TransactionForm.tsx
│   ├── BillTracker.tsx
│   ├── CategoryBreakdown.tsx    // Pie chart
│   ├── IncomeExpenseChart.tsx   // Line/bar chart
│   ├── BudgetProgress.tsx       // Progress bars
│   └── FinancialSummary.tsx
└── mocks/
    └── financeData.ts
```

**Mock Data:**
```typescript
export const mockBudgets = [
  {
    id: '1',
    name: 'Monthly Budget',
    period: 'MONTHLY',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    categories: [
      { name: 'Groceries', budgeted: 800, spent: 650 },
      { name: 'Utilities', budgeted: 300, spent: 285 },
      { name: 'Entertainment', budgeted: 200, spent: 150 },
      { name: 'Transportation', budgeted: 400, spent: 380 }
    ],
    totalBudgeted: 1700,
    totalSpent: 1465
  }
];

export const mockTransactions = [
  {
    id: '1',
    date: '2024-03-10',
    description: 'Whole Foods',
    category: 'Groceries',
    amount: -125.50,
    type: 'EXPENSE'
  },
  {
    id: '2',
    date: '2024-03-01',
    description: 'Salary',
    category: 'Income',
    amount: 5000,
    type: 'INCOME'
  }
];

export const mockBills = [
  {
    id: '1',
    name: 'Electric Bill',
    amount: 150,
    dueDate: '2024-03-15',
    paid: false,
    recurring: true,
    frequency: 'MONTHLY'
  }
];
```

**Dashboard Widgets:**
- Budget overview (spent vs budgeted)
- Income vs expenses chart
- Category breakdown
- Upcoming bills
- Financial health score

**Deliverables:**
- ✅ Finance dashboard
- ✅ Budget management
- ✅ Transaction tracking
- ✅ Bill reminders
- ✅ Financial charts
- ✅ Reports

---

## Phase 10: Calendar & Recipes (Week 10)

### Week 10: Calendar & Recipe Modules

**Calendar Tasks:**
- [ ] Create month/week/day calendar views
- [ ] Build event creation form
- [ ] Create event detail modal
- [ ] Build recurring event UI
- [ ] Create event categories with color coding
- [ ] Build event reminders

**Recipe Tasks:**
- [ ] Create recipe gallery
- [ ] Build recipe detail pages
- [ ] Create recipe creation form
- [ ] Build ingredient list editor
- [ ] Create instruction step editor
- [ ] Build meal planner
- [ ] Create shopping list integration

**Pages:**
```typescript
// features/calendar/
├── pages/
│   ├── CalendarPage.tsx
│   └── EventDetailPage.tsx
├── components/
│   ├── Calendar.tsx              // Month view
│   ├── WeekView.tsx
│   ├── DayView.tsx
│   ├── EventForm.tsx
│   ├── EventModal.tsx
│   └── EventCategorySelector.tsx
└── mocks/
    └── calendarData.ts

// features/recipes/
├── pages/
│   ├── RecipesPage.tsx
│   ├── RecipeDetailPage.tsx
│   ├── RecipeFormPage.tsx
│   └── MealPlannerPage.tsx
├── components/
│   ├── RecipeGrid.tsx
│   ├── RecipeCard.tsx
│   ├── RecipeForm.tsx
│   ├── IngredientEditor.tsx
│   ├── InstructionEditor.tsx
│   └── MealPlanner.tsx
└── mocks/
    └── recipeData.ts
```

**Mock Data:**
```typescript
// Calendar
export const mockEvents = [
  {
    id: '1',
    title: 'Doctor Appointment',
    startDate: '2024-03-15T10:00:00Z',
    endDate: '2024-03-15T11:00:00Z',
    category: 'APPOINTMENT',
    color: 'blue',
    location: 'City Medical Center',
    allDay: false,
    recurring: false
  }
];

// Recipes
export const mockRecipes = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta',
    servings: 4,
    prepTime: 10,
    cookTime: 20,
    image: '/recipes/carbonara.jpg',
    ingredients: [
      { name: 'Spaghetti', quantity: 400, unit: 'g' },
      { name: 'Eggs', quantity: 4, unit: 'piece' },
      { name: 'Bacon', quantity: 200, unit: 'g' }
    ],
    instructions: [
      { step: 1, text: 'Boil water and cook spaghetti' },
      { step: 2, text: 'Cook bacon until crispy' },
      { step: 3, text: 'Mix eggs and cheese' }
    ],
    tags: ['Italian', 'Pasta', 'Easy']
  }
];
```

**Deliverables:**
- ✅ Calendar with multiple views
- ✅ Event management
- ✅ Recipe gallery
- ✅ Recipe creation/editing
- ✅ Meal planning
- ✅ Dashboard widgets for both

---

## PART 2: BACKEND DEVELOPMENT (Weeks 11-16)

**NOTE:** Backend development starts AFTER frontend is approved and complete.

---

## Phase 11: Backend Setup (Week 11)

### Week 11: NestJS & Database Setup

**Tasks:**
- [ ] Set up Docker (PostgreSQL + Redis)
- [ ] Initialize NestJS project
- [ ] Configure Prisma ORM
- [ ] Create complete database schema
- [ ] Run initial migration
- [ ] Set up authentication module
- [ ] Implement JWT strategy
- [ ] Create user management

**Deliverables:**
- ✅ Working database
- ✅ NestJS API running
- ✅ Auth endpoints working
- ✅ User CRUD endpoints

---

## Phase 12-15: Backend Modules (Weeks 12-15)

Build backend APIs for all modules to match frontend:

**Week 12:** Household, Tasks, Calendar
**Week 13:** Employees, Vehicles, Pets
**Week 14:** Inventory (with category hierarchy), Finance
**Week 15:** Recipes, Dashboard aggregation

Each module includes:
- Database models
- CRUD endpoints
- Business logic
- Validation
- Authorization
- Tests

---

## Phase 16: Integration & Testing (Week 16)

### Week 16: Connect Frontend to Backend

**Tasks:**
- [ ] Replace mock APIs with real API calls
- [ ] Update Zustand stores to use TanStack Query
- [ ] Test all CRUD operations
- [ ] Fix bugs
- [ ] Performance optimization
- [ ] Security audit
- [ ] End-to-end testing

**Deliverables:**
- ✅ Fully functional application
- ✅ Frontend connected to backend
- ✅ All features working
- ✅ Tests passing
- ✅ Ready for deployment

---

## Success Criteria

### Frontend Phases (Weeks 1-10)
- [ ] All pages rendering correctly
- [ ] Mock data displayed properly
- [ ] Forms working with validation
- [ ] Navigation functioning
- [ ] Responsive design
- [ ] Charts and visualizations working
- [ ] User can interact with all features

### Backend Phases (Weeks 11-16)
- [ ] All API endpoints working
- [ ] Database properly structured
- [ ] Authentication secure
- [ ] Authorization enforced
- [ ] Data persistence working
- [ ] Tests passing (>80% coverage)

### Integration
- [ ] Frontend successfully calls backend
- [ ] Real data flows through app
- [ ] No mock data remains
- [ ] Performance acceptable
- [ ] Security validated

---

## Development Tools

### Frontend Development
```bash
# Start dev server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview build
npm run preview
```

### Mock Data Management
```typescript
// src/mocks/index.ts
export * from './auth';
export * from './dashboardData';
export * from './householdData';
export * from './employeeData';
export * from './vehicleData';
export * from './petData';
export * from './taskData';
export * from './inventoryData';
export * from './financeData';
export * from './calendarData';
export * from './recipeData';
```

---

## Notes for Claude Code Agent

1. **Start with frontend only** - Don't create backend until instructed
2. **Use mock data extensively** - Create realistic, comprehensive mock datasets
3. **Focus on UX** - Make it beautiful and functional
4. **Commit frequently** - After each component/page
5. **Test as you go** - Ensure everything works before moving forward
6. **Follow the phases** - Complete each week's work before proceeding
7. **Ask for approval** - Get user feedback on UI before building backend

---

## Ready to Build! 🚀

This roadmap prioritizes the frontend so you can see and interact with the application immediately. Once the frontend is complete and approved, we'll build the backend to power it.

**Next Step:** Start with Week 1, Day 1 - Project Setup!
