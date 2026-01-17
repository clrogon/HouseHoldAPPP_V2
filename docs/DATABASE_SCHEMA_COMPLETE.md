# Complete Database Schema - Household Hero v2

This is the complete Prisma schema for all modules. Use this when setting up the backend.

---

## Full Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS
// ============================================

enum Role {
  ADMIN
  PARENT
  MEMBER
  STAFF
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum EventCategory {
  BIRTHDAY
  APPOINTMENT
  MEETING
  HOLIDAY
  SCHOOL
  SPORTS
  OTHER
}

enum TransactionType {
  INCOME
  EXPENSE
}

enum BudgetPeriod {
  WEEKLY
  MONTHLY
  YEARLY
  CUSTOM
}

enum RecurrenceFrequency {
  DAILY
  WEEKLY
  MONTHLY
  YEARLY
  CUSTOM
}

enum PetSpecies {
  DOG
  CAT
  BIRD
  FISH
  REPTILE
  OTHER
}

enum VehicleType {
  CAR
  TRUCK
  SUV
  VAN
  MOTORCYCLE
  OTHER
}

// ============================================
// AUTHENTICATION & USERS
// ============================================

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // hashed with bcrypt
  role      Role     @default(MEMBER)

  // Profile relation
  profile   UserProfile?

  // Relations
  createdHouseholds  Household[]       @relation("HouseholdCreator")
  createdTasks       Task[]            @relation("TaskCreator")
  assignedTasks      Task[]            @relation("TaskAssignee")
  taskComments       TaskComment[]
  createdEvents      Event[]
  createdRecipes     Recipe[]
  createdTransactions Transaction[]
  createdBudgets     Budget[]

  // Security
  twoFactorSecret     String?
  twoFactorEnabled    Boolean           @default(false)
  backupCodes         String[]          // Array of backup codes
  failedLoginAttempts Int               @default(0)
  lockedUntil         DateTime?
  lastLoginAt         DateTime?

  // Session management
  sessions  Session[]

  // Audit
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@map("users")
}

model UserProfile {
  id          String     @id @default(cuid())
  userId      String     @unique
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  firstName   String
  lastName    String
  avatar      String?
  dateOfBirth DateTime?
  phone       String?
  address     String?

  // Household relation
  householdId String?
  household   Household? @relation(fields: [householdId], references: [id])

  // Preferences
  language    String     @default("en")
  timezone    String     @default("UTC")
  theme       String     @default("light") // light, dark, auto

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("user_profiles")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime

  createdAt DateTime @default(now())

  @@index([token])
  @@index([userId])
  @@map("sessions")
}

// ============================================
// HOUSEHOLD
// ============================================

model Household {
  id        String   @id @default(cuid())
  name      String
  address   String?
  phone     String?

  // Relations
  creatorId String
  creator   User     @relation("HouseholdCreator", fields: [creatorId], references: [id])
  members   UserProfile[]
  tasks     Task[]
  events    Event[]
  recipes   Recipe[]
  inventoryCategories InventoryCategory[]
  inventoryItems      InventoryItem[]
  budgets   Budget[]
  transactions Transaction[]
  bills     Bill[]
  employees Employee[]
  vehicles  Vehicle[]
  pets      Pet[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("households")
}

// ============================================
// TASKS
// ============================================

model Task {
  id          String      @id @default(cuid())
  title       String
  description String?
  priority    Priority    @default(MEDIUM)
  status      TaskStatus  @default(PENDING)
  dueDate     DateTime?

  // Relations
  creatorId   String
  creator     User        @relation("TaskCreator", fields: [creatorId], references: [id])

  assigneeId  String?
  assignee    User?       @relation("TaskAssignee", fields: [assigneeId], references: [id])

  householdId String
  household   Household   @relation(fields: [householdId], references: [id])

  subtasks    Subtask[]
  comments    TaskComment[]

  // Template
  templateId  String?
  template    TaskTemplate? @relation(fields: [templateId], references: [id])

  // Tags
  tags        String[]

  // Recurrence
  isRecurring Boolean     @default(false)
  recurrence  Recurrence?

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  completedAt DateTime?

  @@index([status, dueDate])
  @@index([assigneeId])
  @@index([householdId])
  @@map("tasks")
}

model Subtask {
  id          String   @id @default(cuid())
  title       String
  completed   Boolean  @default(false)
  order       Int

  taskId      String
  task        Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("subtasks")
}

model TaskComment {
  id        String   @id @default(cuid())
  content   String

  taskId    String
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)

  authorId  String
  author    User     @relation(fields: [authorId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([taskId])
  @@map("task_comments")
}

model TaskTemplate {
  id          String   @id @default(cuid())
  name        String
  description String?
  priority    Priority @default(MEDIUM)
  tags        String[]

  tasks       Task[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("task_templates")
}

model Recurrence {
  id        String              @id @default(cuid())
  frequency RecurrenceFrequency
  interval  Int                 @default(1) // every X days/weeks/months
  endDate   DateTime?

  // For weekly: which days
  daysOfWeek Int[] // 0=Sunday, 1=Monday, etc.

  // For monthly: which date
  dayOfMonth Int?

  taskId    String @unique
  task      Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("recurrences")
}

// ============================================
// CALENDAR
// ============================================

model Event {
  id          String        @id @default(cuid())
  title       String
  description String?
  startDate   DateTime
  endDate     DateTime
  allDay      Boolean       @default(false)
  location    String?
  category    EventCategory @default(OTHER)
  color       String?

  // Relations
  creatorId   String
  creator     User          @relation(fields: [creatorId], references: [id])

  householdId String
  household   Household     @relation(fields: [householdId], references: [id])

  // Recurrence
  isRecurring Boolean       @default(false)
  recurrenceRule String?    // iCal RRULE format

  // Google Calendar sync (future)
  googleEventId String?

  // Attendees
  attendeeIds String[]

  // Reminders (minutes before)
  reminders   Int[]

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([startDate, endDate])
  @@index([householdId])
  @@map("events")
}

// ============================================
// INVENTORY
// ============================================

model InventoryCategory {
  id          String   @id @default(cuid())
  name        String
  icon        String?
  color       String?
  order       Int      @default(0)

  // Hierarchy
  parentId    String?
  parent      InventoryCategory?  @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children    InventoryCategory[] @relation("CategoryHierarchy")

  // Relations
  householdId String
  household   Household           @relation(fields: [householdId], references: [id])
  items       InventoryItem[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([householdId])
  @@index([parentId])
  @@map("inventory_categories")
}

model InventoryItem {
  id          String   @id @default(cuid())
  name        String
  description String?
  quantity    Float
  unit        String   // piece, kg, liters, etc.
  location    String?  // physical location in house

  // Purchase info
  purchaseDate  DateTime?
  purchasePrice Float?
  expiryDate    DateTime?

  // Stock management
  lowStockThreshold Float?
  barcode           String?
  sku               String?

  // Photos
  photos      String[] // Array of photo URLs

  // Category
  categoryId  String
  category    InventoryCategory @relation(fields: [categoryId], references: [id])

  // Relations
  householdId String
  household   Household         @relation(fields: [householdId], references: [id])

  // Shopping list
  onShoppingList Boolean @default(false)

  // History
  stockHistory StockHistory[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([householdId])
  @@index([categoryId])
  @@index([expiryDate])
  @@map("inventory_items")
}

model StockHistory {
  id          String   @id @default(cuid())
  itemId      String
  item        InventoryItem @relation(fields: [itemId], references: [id], onDelete: Cascade)

  quantityChange Float   // positive for addition, negative for removal
  reason         String? // "Purchased", "Used", "Expired", etc.
  notes          String?

  createdAt   DateTime @default(now())

  @@index([itemId])
  @@map("stock_history")
}

// ============================================
// FINANCE
// ============================================

model Budget {
  id          String       @id @default(cuid())
  name        String
  period      BudgetPeriod
  startDate   DateTime
  endDate     DateTime

  // Categories with budgeted amounts
  categories  BudgetCategory[]

  // Totals
  totalBudgeted Float

  // Relations
  creatorId   String
  creator     User         @relation(fields: [creatorId], references: [id])

  householdId String
  household   Household    @relation(fields: [householdId], references: [id])

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([householdId, startDate])
  @@map("budgets")
}

model BudgetCategory {
  id        String @id @default(cuid())
  name      String
  budgeted  Float
  spent     Float  @default(0)

  budgetId  String
  budget    Budget @relation(fields: [budgetId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("budget_categories")
}

model Transaction {
  id          String          @id @default(cuid())
  type        TransactionType
  amount      Float
  category    String
  description String?
  date        DateTime

  paymentMethod String?

  // Recurring
  isRecurring Boolean @default(false)
  recurrence  String? // JSON or separate table

  // Receipt
  receiptUrl  String?

  // Relations
  creatorId   String
  creator     User      @relation(fields: [creatorId], references: [id])

  householdId String
  household   Household @relation(fields: [householdId], references: [id])

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([householdId, date])
  @@index([category])
  @@map("transactions")
}

model Bill {
  id          String   @id @default(cuid())
  name        String
  amount      Float
  category    String
  dueDate     DateTime
  paid        Boolean  @default(false)
  paidDate    DateTime?

  // Recurring
  isRecurring Boolean  @default(false)
  frequency   RecurrenceFrequency?

  autoPay     Boolean  @default(false)
  notes       String?

  // Relations
  householdId String
  household   Household @relation(fields: [householdId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([householdId, dueDate])
  @@index([paid])
  @@map("bills")
}

// ============================================
// EMPLOYEES
// ============================================

model Employee {
  id          String   @id @default(cuid())
  firstName   String
  lastName    String
  email       String?
  phone       String?
  address     String?
  position    String
  department  String?

  // Employment
  employmentType String   // Full-time, Part-time, Contract
  salary         Float
  payFrequency   String   // Weekly, Bi-weekly, Monthly
  hireDate       DateTime
  terminationDate DateTime?

  // Emergency contact
  emergencyContactName  String?
  emergencyContactPhone String?

  // Photo
  photo       String?

  // Relations
  householdId String
  household   Household       @relation(fields: [householdId], references: [id])

  payments    SalaryPayment[]
  vacations   EmployeeVacation[]
  documents   EmployeeDocument[]
  notes       EmployeeNote[]

  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  @@index([householdId])
  @@map("employees")
}

model SalaryPayment {
  id          String   @id @default(cuid())
  amount      Float
  paymentDate DateTime
  period      String   // e.g., "January 2024"
  paymentMethod String?
  notes       String?

  employeeId  String
  employee    Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@index([employeeId, paymentDate])
  @@map("salary_payments")
}

model EmployeeVacation {
  id          String   @id @default(cuid())
  startDate   DateTime
  endDate     DateTime
  days        Int
  approved    Boolean  @default(false)
  notes       String?

  employeeId  String
  employee    Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("employee_vacations")
}

model EmployeeDocument {
  id          String   @id @default(cuid())
  name        String
  type        String   // Contract, Certificate, ID, etc.
  url         String
  uploadedAt  DateTime @default(now())

  employeeId  String
  employee    Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  @@map("employee_documents")
}

model EmployeeNote {
  id          String   @id @default(cuid())
  title       String
  content     String
  type        String   // Performance, Incident, Award, etc.

  employeeId  String
  employee    Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("employee_notes")
}

// ============================================
// VEHICLES
// ============================================

model Vehicle {
  id          String      @id @default(cuid())
  type        VehicleType
  make        String
  model       String
  year        Int
  color       String?
  vin         String?
  licensePlate String?
  mileage     Int?

  // Purchase
  purchaseDate  DateTime?
  purchasePrice Float?
  currentValue  Float?

  // Owner (household member)
  ownerId     String?

  // Insurance
  insurance   VehicleInsurance?

  // Relations
  householdId String
  household   Household           @relation(fields: [householdId], references: [id])

  maintenance VehicleMaintenance[]
  fuelLogs    FuelLog[]
  expenses    VehicleExpense[]

  // Photos
  photos      String[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([householdId])
  @@map("vehicles")
}

model VehicleInsurance {
  id          String   @id @default(cuid())
  provider    String
  policyNumber String
  coverageType String
  premium     Float
  startDate   DateTime
  expiryDate  DateTime
  policyDocumentUrl String?

  vehicleId   String   @unique
  vehicle     Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("vehicle_insurance")
}

model VehicleMaintenance {
  id          String   @id @default(cuid())
  type        String   // Oil Change, Tire Rotation, Brake Service, etc.
  date        DateTime
  mileage     Int?
  cost        Float?
  serviceProvider String?
  notes       String?
  nextServiceDue  DateTime?

  vehicleId   String
  vehicle     Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([vehicleId, date])
  @@map("vehicle_maintenance")
}

model FuelLog {
  id          String   @id @default(cuid())
  date        DateTime
  gallons     Float
  costPerGallon Float
  totalCost   Float
  mileage     Int?
  fuelType    String?  // Regular, Premium, Diesel, etc.
  gasStation  String?

  vehicleId   String
  vehicle     Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@index([vehicleId, date])
  @@map("fuel_logs")
}

model VehicleExpense {
  id          String   @id @default(cuid())
  date        DateTime
  category    String   // Maintenance, Fuel, Insurance, Registration, etc.
  amount      Float
  description String?

  vehicleId   String
  vehicle     Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@index([vehicleId, date])
  @@map("vehicle_expenses")
}

// ============================================
// PETS
// ============================================

model Pet {
  id          String      @id @default(cuid())
  name        String
  species     PetSpecies
  breed       String?
  birthDate   DateTime?
  gender      String?     // Male, Female, Unknown
  color       String?
  microchipNumber String?
  weight      Float?      // in kg or lbs

  // Vet info
  vetName     String?
  vetPhone    String?
  vetAddress  String?

  // Relations
  householdId String
  household   Household   @relation(fields: [householdId], references: [id])

  vaccinations  PetVaccination[]
  appointments  PetAppointment[]
  medications   PetMedication[]
  weightHistory PetWeightHistory[]
  expenses      PetExpense[]

  // Photos
  photos      String[]

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([householdId])
  @@map("pets")
}

model PetVaccination {
  id          String   @id @default(cuid())
  name        String   // Rabies, DHPP, etc.
  dateGiven   DateTime
  nextDue     DateTime
  vet         String?
  certificateUrl String?

  petId       String
  pet         Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([petId, nextDue])
  @@map("pet_vaccinations")
}

model PetAppointment {
  id          String   @id @default(cuid())
  date        DateTime
  reason      String
  vet         String?
  notes       String?
  cost        Float?

  petId       String
  pet         Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([petId, date])
  @@map("pet_appointments")
}

model PetMedication {
  id          String    @id @default(cuid())
  name        String
  dosage      String
  frequency   String    // Daily, Weekly, Monthly, As needed
  startDate   DateTime
  endDate     DateTime?
  prescribedBy String?
  notes       String?

  petId       String
  pet         Pet       @relation(fields: [petId], references: [id], onDelete: Cascade)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([petId])
  @@map("pet_medications")
}

model PetWeightHistory {
  id        String   @id @default(cuid())
  date      DateTime
  weight    Float    // in kg or lbs
  notes     String?

  petId     String
  pet       Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@index([petId, date])
  @@map("pet_weight_history")
}

model PetExpense {
  id          String   @id @default(cuid())
  date        DateTime
  category    String   // Vet, Food, Supplies, Grooming, etc.
  amount      Float
  description String?

  petId       String
  pet         Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@index([petId, date])
  @@map("pet_expenses")
}

// ============================================
// RECIPES
// ============================================

model Recipe {
  id          String   @id @default(cuid())
  name        String
  description String?
  servings    Int?
  prepTime    Int?     // minutes
  cookTime    Int?     // minutes
  difficulty  String?  // Easy, Medium, Hard
  imageUrl    String?
  source      String?  // URL or book name

  // Relations
  creatorId   String
  creator     User             @relation(fields: [creatorId], references: [id])

  householdId String
  household   Household        @relation(fields: [householdId], references: [id])

  ingredients RecipeIngredient[]
  instructions RecipeInstruction[]

  // Tags
  tags        String[]

  // Nutrition (optional)
  calories    Int?
  protein     Float?
  carbs       Float?
  fat         Float?

  // Favorites
  favoriteBy  String[] // Array of user IDs

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([householdId])
  @@map("recipes")
}

model RecipeIngredient {
  id        String   @id @default(cuid())
  name      String
  quantity  Float
  unit      String

  recipeId  String
  recipe    Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  order     Int

  createdAt DateTime @default(now())

  @@map("recipe_ingredients")
}

model RecipeInstruction {
  id        String   @id @default(cuid())
  stepNumber Int
  text      String
  timer     Int?     // optional timer in minutes

  recipeId  String
  recipe    Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@map("recipe_instructions")
}

// ============================================
// AUDIT & SECURITY
// ============================================

model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  userEmail   String
  action      String   // LOGIN, LOGOUT, CREATE, UPDATE, DELETE, etc.
  resource    String   // User, Task, Budget, etc.
  resourceId  String?
  details     Json?    // Additional details
  ipAddress   String?
  userAgent   String?

  createdAt   DateTime @default(now())

  @@index([userId, createdAt])
  @@index([resource, resourceId])
  @@index([action])
  @@map("audit_logs")
}

// ============================================
// NOTIFICATIONS (Future)
// ============================================

model Notification {
  id          String   @id @default(cuid())
  userId      String
  type        String   // TASK_ASSIGNED, BILL_DUE, LOW_STOCK, etc.
  title       String
  message     String
  read        Boolean  @default(false)
  actionUrl   String?  // Link to related resource

  createdAt   DateTime @default(now())

  @@index([userId, read])
  @@index([createdAt])
  @@map("notifications")
}
```

---

## Database Relationships

### User ↔ Household
- User can create multiple households (1:N)
- User profile belongs to one household (1:1)

### Household ↔ Modules
- Household has many: tasks, events, recipes, inventory items, budgets, etc. (1:N)
- All household data is scoped to household

### Hierarchical Categories
- InventoryCategory has self-referential relationship
- Parent-child via `parentId`
- Unlimited nesting depth

### Task Hierarchy
- Task → Subtasks (1:N)
- Task → Comments (1:N)
- Task → Recurrence (1:1 optional)

### Vehicle Tracking
- Vehicle → Insurance (1:1)
- Vehicle → Maintenance records (1:N)
- Vehicle → Fuel logs (1:N)

### Pet Care
- Pet → Vaccinations (1:N)
- Pet → Appointments (1:N)
- Pet → Medications (1:N)
- Pet → Weight history (1:N)

---

## Indexes

Strategic indexes for performance:

1. **Foreign Keys** - All foreign keys indexed
2. **Date Ranges** - Date fields for filtering
3. **Household Scoping** - `householdId` on all tables
4. **Search** - Email, names for user search
5. **Status Fields** - Task status, bill paid status

---

## Data Scoping

### Household Data Isolation
All data is scoped to households:
```typescript
// Backend example
async getTasks(userId: string) {
  const user = await getUser(userId);
  const householdId = user.profile.householdId;

  return prisma.task.findMany({
    where: { householdId }
  });
}
```

### Admin Access
Admins can access all households:
```typescript
if (user.role === 'ADMIN') {
  // No household filter
} else {
  // Filter by user's household
}
```

---

## Migrations

### Initial Migration
```bash
npx prisma migrate dev --name init
```

### Adding New Features
```bash
# Modify schema.prisma
npx prisma migrate dev --name add_feature_name
```

### Reset Database (Dev only)
```bash
npx prisma migrate reset
```

---

## Seeding

Create seed data for development:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@household.com',
      password: await bcrypt.hash('password', 12),
      role: 'ADMIN',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User'
        }
      }
    }
  });

  // Create household
  const household = await prisma.household.create({
    data: {
      name: 'Smith Family',
      creatorId: admin.id
    }
  });

  // Update admin profile with household
  await prisma.userProfile.update({
    where: { userId: admin.id },
    data: { householdId: household.id }
  });

  // Create sample data...
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## Usage Examples

### Create Task
```typescript
const task = await prisma.task.create({
  data: {
    title: 'Buy groceries',
    priority: 'HIGH',
    dueDate: new Date('2024-03-15'),
    creatorId: userId,
    assigneeId: memberId,
    householdId: householdId,
    subtasks: {
      create: [
        { title: 'Make list', order: 1 },
        { title: 'Go to store', order: 2 }
      ]
    }
  },
  include: {
    subtasks: true,
    assignee: {
      include: {
        profile: true
      }
    }
  }
});
```

### Query Inventory with Categories
```typescript
const items = await prisma.inventoryItem.findMany({
  where: {
    householdId,
    categoryId: categoryId
  },
  include: {
    category: {
      include: {
        parent: {
          include: {
            parent: true // Get full category path
          }
        }
      }
    }
  }
});
```

### Financial Report
```typescript
const transactions = await prisma.transaction.groupBy({
  by: ['category'],
  where: {
    householdId,
    date: {
      gte: startDate,
      lte: endDate
    },
    type: 'EXPENSE'
  },
  _sum: {
    amount: true
  }
});
```

---

## Best Practices

1. **Always scope by household** (except admins)
2. **Use transactions for multi-table operations**
3. **Include relations only when needed**
4. **Use pagination for large lists**
5. **Index frequently queried fields**
6. **Validate data before database operations**
7. **Use soft deletes for important data** (add `deletedAt` field)

---

## Performance Optimization

### Pagination
```typescript
const tasks = await prisma.task.findMany({
  skip: (page - 1) * limit,
  take: limit,
  where: { householdId }
});
```

### Select Specific Fields
```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    profile: {
      select: {
        firstName: true,
        lastName: true
      }
    }
  }
});
```

### Use Aggregations
```typescript
const stats = await prisma.task.aggregate({
  where: { householdId },
  _count: true,
  _avg: { priority: true }
});
```

---

## Next Steps

1. Review schema with team
2. Set up PostgreSQL with Docker
3. Run initial migration
4. Create seed data
5. Test queries with Prisma Studio
6. Begin backend API development

---

**Database ready for development! 🗄️**
