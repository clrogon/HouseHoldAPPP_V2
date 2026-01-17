# Module Specifications - Household Hero v2

Complete functional specifications for all modules with user stories, acceptance criteria, and technical requirements.

---

## Table of Contents

1. [Authentication & Authorization](#1-authentication--authorization)
2. [Admin Module](#2-admin-module)
3. [Dashboard Module](#3-dashboard-module)
4. [Household & Members](#4-household--members)
5. [Employees Module](#5-employees-module)
6. [Vehicles Module](#6-vehicles-module)
7. [Pets Module](#7-pets-module)
8. [Tasks Module](#8-tasks-module)
9. [Inventory Module](#9-inventory-module)
10. [Finance Module](#10-finance-module)
11. [Calendar Module](#11-calendar-module)
12. [Recipes Module](#12-recipes-module)

---

## 1. Authentication & Authorization

### Purpose
Secure user authentication with role-based access control

### User Roles
- **ADMIN** - System administrator
- **PARENT** - Household parent/guardian
- **MEMBER** - Household member (child, teenager)
- **STAFF** - Household employee

### Features

#### 1.1 User Registration
**User Story:** As a new user, I want to create an account so I can access the application.

**Acceptance Criteria:**
- [ ] Multi-step registration wizard (3 steps):
  - Step 1: Email + Password
  - Step 2: Personal Information (name, phone)
  - Step 3: Household (create new or join existing)
- [ ] Email validation (format check)
- [ ] Password requirements:
  - Minimum 8 characters
  - At least 1 uppercase, 1 lowercase, 1 number
  - Optional: 1 special character
- [ ] Password confirmation field
- [ ] Show/hide password toggle
- [ ] Progress indicator
- [ ] Back/Next navigation
- [ ] Success message after registration
- [ ] Auto-login after registration

**UI Components:**
```
RegisterPage
├── Step1: AccountInfo (email, password, confirm password)
├── Step2: PersonalInfo (firstName, lastName, phone, avatar)
└── Step3: HouseholdSetup (create or join)
```

---

#### 1.2 User Login
**User Story:** As a registered user, I want to log in securely.

**Acceptance Criteria:**
- [ ] Email and password fields
- [ ] Remember me checkbox
- [ ] Show/hide password toggle
- [ ] Form validation
- [ ] Error messages for invalid credentials
- [ ] Account lockout after 5 failed attempts (15 min)
- [ ] Loading state during authentication
- [ ] Redirect to dashboard after successful login
- [ ] "Forgot password?" link

**UI Components:**
```
LoginPage
└── LoginForm
    ├── EmailInput
    ├── PasswordInput (with toggle)
    ├── RememberMeCheckbox
    ├── SubmitButton
    └── ForgotPasswordLink
```

---

#### 1.3 Two-Factor Authentication (2FA)
**User Story:** As a user, I want 2FA for additional security.

**Acceptance Criteria:**
- [ ] Enable/disable 2FA in settings
- [ ] QR code generation for authenticator apps
- [ ] 6-digit code verification
- [ ] Backup codes (10 codes)
- [ ] 2FA prompt during login (if enabled)
- [ ] Trusted device option (30 days)
- [ ] Recovery option if device lost

**UI Components:**
```
TwoFactorSetup
├── QRCodeDisplay
├── ManualKeyDisplay
├── VerificationCodeInput
└── BackupCodesList
```

---

#### 1.4 Password Reset
**User Story:** As a user, I want to reset my password if forgotten.

**Acceptance Criteria:**
- [ ] Email input for password reset request
- [ ] Email with reset link (valid for 1 hour)
- [ ] New password form with confirmation
- [ ] Password requirements validation
- [ ] Success message
- [ ] Auto-redirect to login

---

#### 1.5 Role-Based Access Control
**Technical Requirement:** Implement route and component-level guards

**Role Permissions:**

| Feature | ADMIN | PARENT | MEMBER | STAFF |
|---------|-------|--------|--------|-------|
| Admin Panel | ✅ | ❌ | ❌ | ❌ |
| Household Mgmt | ✅ | ✅ | ❌ | ❌ |
| Finance (Full) | ✅ | ✅ | ❌ | ❌ |
| Finance (View) | ✅ | ✅ | ✅ | ❌ |
| Employees | ✅ | ✅ | ❌ | ❌ |
| Vehicles | ✅ | ✅ | ✅ | ❌ |
| Pets | ✅ | ✅ | ✅ | ❌ |
| Tasks (All) | ✅ | ✅ | ✅ | ✅ |
| Tasks (Own) | ✅ | ✅ | ✅ | ✅ |
| Inventory | ✅ | ✅ | ✅ | ✅ |
| Calendar | ✅ | ✅ | ✅ | ✅ |
| Recipes | ✅ | ✅ | ✅ | ✅ |

**Implementation:**
```typescript
// Frontend guard
<ProtectedRoute roles={['ADMIN', 'PARENT']}>
  <FinancePage />
</ProtectedRoute>

// Backend guard
@Roles('ADMIN', 'PARENT')
@Get('/finance')
getFinanceData() { }
```

---

## 2. Admin Module

### Purpose
System administration and monitoring

### Features

#### 2.1 Admin Dashboard
**User Story:** As an admin, I want to monitor system health and usage.

**Widgets:**
1. **System Health**
   - Database status (connected/disconnected)
   - API response time
   - Error rate (last 24h)
   - Uptime

2. **User Statistics**
   - Total users
   - Active users (last 7 days)
   - Users by role (pie chart)
   - New registrations (last 30 days)

3. **Household Statistics**
   - Total households
   - Average members per household
   - Household growth chart

4. **Module Usage**
   - Most used modules (bar chart)
   - API call distribution
   - Storage usage

5. **Recent Activity**
   - Last 20 system activities
   - Error logs
   - Security events

**Acceptance Criteria:**
- [ ] All widgets load within 2 seconds
- [ ] Real-time updates every 30 seconds
- [ ] Charts are interactive
- [ ] Export data to CSV
- [ ] Responsive layout

---

#### 2.2 User Management
**User Story:** As an admin, I want to manage all users.

**Features:**
- [ ] User list with search and filters
- [ ] View user details
- [ ] Edit user information
- [ ] Change user role
- [ ] Activate/deactivate accounts
- [ ] Reset user password
- [ ] View user activity log
- [ ] Delete users (with confirmation)

**User List Columns:**
- Full Name
- Email
- Role
- Household
- Status (Active/Inactive)
- Last Login
- Actions

---

#### 2.3 Household Management
**User Story:** As an admin, I want to view all households.

**Features:**
- [ ] Household list
- [ ] View household details
- [ ] View members
- [ ] Household statistics
- [ ] Deactivate households

---

#### 2.4 Audit Logs
**User Story:** As an admin, I want to view all system activity.

**Log Types:**
- User logins/logouts
- Failed login attempts
- User role changes
- Data modifications
- Security events

**Filters:**
- Date range
- User
- Event type
- Severity

---

## 3. Dashboard Module

### Purpose
Personalized overview for all users

### Features

#### 3.1 Main Dashboard (All Users)
**User Story:** As a user, I want to see my personalized overview.

**Widgets:**

1. **Welcome Card**
   - Personalized greeting
   - Current date/time
   - Weather (optional)

2. **Quick Stats**
   - My pending tasks (count)
   - Today's events (count)
   - Budget status (percentage)
   - Low stock items (count)

3. **My Tasks**
   - Top 5 upcoming tasks
   - Overdue tasks highlighted
   - Quick complete checkbox
   - Link to full task list

4. **Upcoming Events**
   - Next 7 days
   - Event category color coding
   - Quick event details

5. **Budget Summary**
   - Current month spent vs budgeted
   - Progress bar
   - Category breakdown (top 3)

6. **Recent Activity**
   - Last 10 activities across all modules
   - Timestamps
   - User avatars

7. **Quick Actions**
   - New Task button
   - New Event button
   - Add Inventory Item button
   - Add Expense button

**Layout:** Responsive grid (3 columns desktop, 1 column mobile)

---

#### 3.2 Customization (Future)
**User Story:** As a user, I want to customize my dashboard.

**Features:**
- [ ] Show/hide widgets
- [ ] Rearrange widgets (drag-drop)
- [ ] Widget settings
- [ ] Save layout preferences

---

## 4. Household & Members

### Purpose
Manage household structure and family members

### Features

#### 4.1 Household Profile
**User Story:** As a parent, I want to manage my household information.

**Fields:**
- Household name
- Address
- Primary contact
- Created date
- Member count

**Actions:**
- Edit household info
- View all members
- Invite new members
- Household settings

---

#### 4.2 Member Management
**User Story:** As a parent, I want to manage family members.

**Member List Views:**
- Grid view (cards with avatars)
- Table view (detailed info)

**Member Card:**
- Avatar
- Full name
- Role
- Email
- Join date
- Quick actions (View, Edit, Remove)

**Member Profile:**
- Personal info (name, DOB, phone)
- Contact info
- Role
- Permissions
- Activity history
- Profile picture

**Actions:**
- Add new member
- Edit member
- Change member role
- Remove member (with confirmation)
- View member activity

---

#### 4.3 Member Invitation
**User Story:** As a parent, I want to invite family members.

**Process:**
1. Enter member email
2. Select role
3. Add personal message (optional)
4. Send invitation
5. Track invitation status (Pending, Accepted, Expired)

**Invitation Email:**
- Personalized message
- Household name
- Registration link (expires in 7 days)
- Accept/Decline buttons

---

## 5. Employees Module

### Purpose
Manage household staff and employees

### Features

#### 5.1 Employee Directory
**User Story:** As a parent, I want to manage household employees.

**Employee Card:**
- Photo
- Full name
- Position
- Contact info
- Hire date
- Employment status
- Quick actions

**Filters:**
- Position
- Status (Active/Inactive)
- Hire date range

---

#### 5.2 Employee Profile
**User Story:** As a parent, I want to view detailed employee information.

**Tabs:**

1. **Personal Info**
   - Full name
   - Contact (email, phone, address)
   - Emergency contact
   - Date of birth
   - Hire date

2. **Employment**
   - Position/title
   - Department
   - Employment type (Full-time, Part-time)
   - Salary
   - Pay frequency

3. **Schedule**
   - Working days
   - Working hours
   - Calendar view

4. **Payments**
   - Payment history table
   - Columns: Date, Amount, Period, Notes
   - Total paid (YTD)
   - Add payment button

5. **Vacation/Leave**
   - Vacation balance
   - Leave history
   - Upcoming vacations
   - Request vacation button

6. **Documents**
   - Contract
   - Certifications
   - ID copies
   - Upload document

7. **Notes**
   - Performance notes
   - Incidents
   - Awards/recognition

---

#### 5.3 Payroll Management
**User Story:** As a parent, I want to manage employee payments.

**Features:**
- Record payment
- Payment history
- Payment calendar
- Export to CSV
- Payment reminders

**Payment Form:**
- Employee
- Amount
- Payment date
- Period (e.g., "January 2024")
- Payment method
- Notes

---

#### 5.4 Vacation Tracker
**User Story:** As a parent, I want to track employee vacations.

**Features:**
- Calendar view of vacations
- Vacation requests
- Approve/deny vacations
- Vacation balance per employee
- Vacation history

---

## 6. Vehicles Module

### Purpose
Track family vehicles and maintenance

### Features

#### 6.1 Vehicle Gallery
**User Story:** As a user, I want to see all family vehicles.

**Vehicle Card:**
- Photo
- Make, Model, Year
- License plate
- Mileage
- Status indicators (insurance, maintenance)
- Quick actions

**Filters:**
- Vehicle type
- Ownership
- Status

---

#### 6.2 Vehicle Profile
**User Story:** As a user, I want to view detailed vehicle information.

**Tabs:**

1. **Details**
   - Make, Model, Year
   - Color
   - VIN
   - License plate
   - Purchase date
   - Purchase price
   - Current value
   - Owner (household member)
   - Photos

2. **Insurance**
   - Insurance provider
   - Policy number
   - Coverage type
   - Premium amount
   - Start date
   - Expiry date
   - Renewal reminder (30 days before)
   - Upload policy document

3. **Maintenance**
   - Maintenance schedule
   - Service history table
   - Upcoming maintenance alerts
   - Add service record

4. **Fuel Log**
   - Fuel entries table
   - Fuel efficiency chart
   - Average MPG
   - Total fuel cost
   - Add fuel entry

5. **Expenses**
   - All expenses (maintenance, fuel, insurance)
   - Expense chart (by category)
   - Total cost of ownership
   - Export to CSV

---

#### 6.3 Maintenance Tracking
**User Story:** As a user, I want to track vehicle maintenance.

**Service Types:**
- Oil change
- Tire rotation
- Brake service
- Inspection
- Other

**Service Record:**
- Service type
- Date
- Mileage
- Cost
- Service provider
- Notes
- Next service due

**Alerts:**
- Oil change due (every 5,000 miles)
- Tire rotation due
- Inspection due
- Custom maintenance reminders

---

#### 6.4 Fuel Logging
**User Story:** As a user, I want to track fuel consumption.

**Fuel Entry:**
- Date
- Gallons
- Cost per gallon
- Total cost
- Mileage
- Fuel type
- Gas station

**Analytics:**
- MPG calculation
- Fuel efficiency trend chart
- Cost per mile
- Monthly fuel costs

---

## 7. Pets Module

### Purpose
Pet care and health tracking

### Features

#### 7.1 Pet Gallery
**User Story:** As a user, I want to see all family pets.

**Pet Card:**
- Photo
- Name
- Species & breed
- Age
- Health indicators
- Quick actions

**Filters:**
- Species
- Age
- Health status

---

#### 7.2 Pet Profile
**User Story:** As a user, I want to view detailed pet information.

**Tabs:**

1. **Details**
   - Name
   - Species
   - Breed
   - Birth date / Age
   - Gender
   - Color/markings
   - Microchip number
   - Photos

2. **Health**
   - Vaccinations list
   - Vaccination due dates
   - Allergies
   - Medical conditions
   - Current medications
   - Vet contact info

3. **Vaccinations**
   - Vaccination schedule
   - Vaccination history table
   - Columns: Name, Date Given, Next Due, Vet
   - Upload vaccination records
   - Reminders (30 days before due)

4. **Vet Appointments**
   - Upcoming appointments
   - Appointment history
   - Columns: Date, Reason, Vet, Notes, Cost
   - Add appointment
   - Calendar view

5. **Medications**
   - Current medications
   - Medication schedule
   - Columns: Name, Dosage, Frequency, Start Date, End Date
   - Medication reminders
   - Add medication

6. **Weight Tracking**
   - Weight history table
   - Weight chart (line graph)
   - Target weight
   - Add weight entry

7. **Expenses**
   - All pet expenses (vet, food, supplies)
   - Expense chart
   - Total cost per month/year
   - Export to CSV

---

#### 7.3 Vaccination Tracker
**User Story:** As a pet owner, I want to track vaccinations.

**Features:**
- Vaccination schedule
- Due date alerts
- Vaccination history
- Upload vaccination certificates
- Print vaccination record

---

#### 7.4 Medication Management
**User Story:** As a pet owner, I want to manage pet medications.

**Medication Entry:**
- Medication name
- Dosage
- Frequency (Daily, Weekly, Monthly, As needed)
- Start date
- End date (optional)
- Prescribed by
- Notes

**Reminders:**
- Daily medication reminders
- Refill reminders
- Notification system

---

## 8. Tasks Module

### Purpose
Task management and collaboration

### Features

#### 8.1 Task Views
**User Story:** As a user, I want multiple ways to view tasks.

**View Options:**
1. **List View**
   - Default view
   - Sortable columns
   - Filters sidebar
   - Group by: Status, Priority, Assignee, Due Date

2. **Kanban Board**
   - Columns: Pending, In Progress, Completed
   - Drag-and-drop to change status
   - Card shows: Title, assignee avatar, due date, priority

3. **Calendar View**
   - Tasks shown on due dates
   - Color-coded by priority
   - Drag-and-drop to change due date
   - Month/week/day views

**View Switching:** Tabs at top of page

---

#### 8.2 Task Creation
**User Story:** As a user, I want to create tasks easily.

**Task Form:**
- Title (required)
- Description (rich text)
- Priority (Low, Medium, High)
- Status (Pending, In Progress, Completed)
- Due date (date + time picker)
- Assign to (member selector)
- Tags (multi-select)
- Subtasks (add/remove)
- Attach files (future)

**Quick Create:** Modal popup from + button

**Full Create:** Dedicated page with all options

---

#### 8.3 Task Details
**User Story:** As a user, I want to see complete task information.

**Sections:**

1. **Header**
   - Title (editable inline)
   - Status selector
   - Priority indicator
   - Due date
   - Assignee avatar

2. **Description**
   - Rich text editor
   - Edit/save inline

3. **Subtasks**
   - Checklist of subtasks
   - Checkbox to complete
   - Add new subtask inline
   - Progress bar (X of Y completed)

4. **Activity/Comments**
   - Comment thread
   - User avatars
   - Timestamps
   - System activities ("John changed status to In Progress")
   - Add comment box

5. **Metadata Sidebar**
   - Created by
   - Created date
   - Last updated
   - Tags
   - Attachment count

**Actions:**
- Edit
- Delete
- Duplicate
- Mark complete
- Share

---

#### 8.4 Task Assignment
**User Story:** As a parent, I want to assign tasks to family members.

**Features:**
- Assign to one or multiple members
- Reassign task
- Self-assignment
- Assignment notifications

---

#### 8.5 Task Templates
**User Story:** As a user, I want to create recurring task templates.

**Template Features:**
- Save task as template
- Template library
- Create task from template
- Template categories

**Common Templates:**
- Weekly grocery shopping
- Monthly bills
- Daily chores
- Seasonal tasks

---

#### 8.6 Recurring Tasks
**User Story:** As a user, I want tasks to repeat automatically.

**Recurrence Options:**
- Daily
- Weekly (select days)
- Monthly (select date)
- Yearly
- Custom

**Settings:**
- Start date
- End date (or no end)
- Skip weekends
- Auto-create X days before due

---

#### 8.7 Task Filters & Search
**User Story:** As a user, I want to find tasks easily.

**Filters:**
- Status (multi-select)
- Priority (multi-select)
- Assignee (multi-select)
- Due date range
- Tags
- Created by

**Search:**
- Search by title
- Search by description
- Real-time results

**Saved Filters:**
- Save filter combinations
- Quick filter buttons (My Tasks, Overdue, High Priority)

---

## 9. Inventory Module

### Purpose
Track household items with hierarchical categories

### Features

#### 9.1 Category System
**User Story:** As a user, I want to organize items in categories.

**Category Structure:**
- Unlimited nesting levels
- Parent-child relationships
- Category icons
- Category colors

**Example Structure:**
```
Kitchen (🍴)
├── Appliances (🔌)
│   ├── Small Appliances
│   │   ├── Blenders
│   │   └── Toasters
│   └── Large Appliances
│       ├── Refrigerators
│       └── Ovens
├── Cookware (🍳)
│   ├── Pots & Pans
│   └── Bakeware
└── Utensils (🥄)

Pantry (🏪)
├── Dry Goods
├── Canned Foods
└── Spices

Garage (🔧)
└── Tools
    ├── Power Tools
    └── Hand Tools
```

**Category Management:**
- Create category
- Edit category (name, icon, color)
- Delete category (move items to parent or another category)
- Reorder categories (drag-drop)
- Move category to different parent

---

#### 9.2 Category Navigation
**User Story:** As a user, I want to browse items by category.

**Navigation UI:**

**Option 1: Tree View (Sidebar)**
```
Sidebar
├── [+] Kitchen (12 items)
│   ├── [+] Appliances (5 items)
│   │   ├── Small Appliances (3 items)
│   │   └── Large Appliances (2 items)
│   └── Cookware (7 items)
├── [+] Pantry (45 items)
└── [+] Garage (8 items)
```

**Option 2: Breadcrumb + Grid**
```
Breadcrumb: Home > Kitchen > Appliances > Small Appliances

Grid View:
[Subcategory Cards] + [Item Cards]
```

**Features:**
- Expand/collapse categories
- Click to navigate
- Item count per category
- Search within category

---

#### 9.3 Item Management
**User Story:** As a user, I want to track all household items.

**Item List Views:**
- Grid view (cards with photos)
- Table view (detailed info)
- Filter and search

**Item Card:**
- Photo
- Name
- Category path
- Quantity
- Location
- Status indicators (low stock, expiring)
- Quick actions

**Item Detail:**
- Name
- Description
- Category (hierarchical selector)
- Quantity & Unit
- Location
- Purchase date
- Purchase price
- Expiry date (if applicable)
- Low stock threshold
- Barcode/SKU
- Photos (multiple)
- Notes

**Actions:**
- Add item
- Edit item
- Delete item
- Adjust quantity
- Move to different category
- Add to shopping list

---

#### 9.4 Stock Management
**User Story:** As a user, I want to track item quantities.

**Features:**
- Quick quantity adjustment (+/-)
- Stock history (additions/removals)
- Low stock alerts
- Out of stock indicator
- Bulk quantity update

**Quantity Adjustment:**
- Simple: +1, -1 buttons
- Advanced: Add/Remove with reason
- Inventory count/audit

---

#### 9.5 Shopping List
**User Story:** As a user, I want to generate shopping lists.

**Features:**
- Auto-generate from low stock items
- Manual item addition
- Group by category
- Check off items as purchased
- Share shopping list
- Print shopping list
- Shopping history

**Shopping List Item:**
- Item name
- Quantity needed
- Category
- Estimated price
- Store location (optional)
- Checkbox (purchased)

---

#### 9.6 Expiry Tracking
**User Story:** As a user, I want to track item expiry dates.

**Features:**
- Expiry date field
- Expiring soon alerts (7 days before)
- Expired items list
- Expiry date reminders
- FIFO (First In, First Out) tracking

**Expiry Alerts:**
- Red: Expired
- Orange: Expiring within 7 days
- Yellow: Expiring within 30 days

---

## 10. Finance Module

### Purpose
Budget and financial management

### Features

#### 10.1 Finance Dashboard
**User Story:** As a parent, I want to see financial overview.

**Widgets:**
1. **Budget Summary**
   - Current month budget
   - Total budgeted
   - Total spent
   - Remaining
   - Progress bar

2. **Income vs Expenses**
   - Line chart (last 6 months)
   - Monthly comparison

3. **Category Breakdown**
   - Pie chart of expenses by category
   - Top 5 categories

4. **Upcoming Bills**
   - Bills due in next 30 days
   - Amount due
   - Pay button

5. **Financial Health Score**
   - Score out of 100
   - Factors: Budget adherence, savings rate, debt

6. **Recent Transactions**
   - Last 10 transactions
   - Quick filters

---

#### 10.2 Budget Management
**User Story:** As a parent, I want to create and manage budgets.

**Budget Types:**
- Monthly
- Weekly
- Yearly
- Custom period

**Budget Creation:**
- Budget name
- Period (start/end dates)
- Categories with amounts
- Total budget

**Budget Categories:**
- Groceries
- Utilities
- Entertainment
- Transportation
- Healthcare
- Education
- Savings
- Other
- Custom categories

**Budget Tracking:**
- Spent vs budgeted (per category)
- Progress bars
- Over-budget warnings
- Trend analysis

**Actions:**
- Create budget
- Edit budget
- Copy from previous period
- Delete budget

---

#### 10.3 Transaction Management
**User Story:** As a parent, I want to track all income and expenses.

**Transaction Form:**
- Type (Income / Expense)
- Date
- Amount
- Category
- Description
- Payment method
- Recurring (yes/no)
- Receipt upload (future)

**Transaction List:**
- Columns: Date, Description, Category, Amount, Type
- Filters: Date range, Category, Type
- Search
- Export to CSV
- Total income/expenses

**Quick Add:**
- Modal for fast entry
- Recent transactions for templates

---

#### 10.4 Bill Management
**User Story:** As a parent, I want to track and manage bills.

**Bill Form:**
- Bill name
- Amount
- Due date
- Category
- Recurring (yes/no)
- Recurrence frequency (monthly, yearly, etc.)
- Auto-pay (yes/no)
- Notes

**Bill List:**
- Upcoming bills (next 30 days)
- All bills
- Paid bills history

**Bill Card:**
- Name
- Amount
- Due date
- Status (Paid / Unpaid)
- Days until due
- Pay button
- Mark as paid button

**Reminders:**
- Email/notification 7 days before due
- Email/notification 1 day before due
- Overdue notification

---

#### 10.5 Financial Reports
**User Story:** As a parent, I want to analyze spending patterns.

**Reports:**
1. **Income Statement**
   - Total income
   - Total expenses
   - Net income
   - Period selector

2. **Expense Analysis**
   - By category (pie chart)
   - By month (bar chart)
   - Trends (line chart)

3. **Budget Performance**
   - Budget vs actual (all categories)
   - Variance analysis

4. **Cash Flow**
   - Monthly cash flow
   - Running balance

**Export Options:**
- PDF
- CSV
- Excel (future)

---

## 11. Calendar Module

### Purpose
Unified household calendar

### Features

#### 11.1 Calendar Views
**User Story:** As a user, I want multiple calendar views.

**Views:**
1. **Month View**
   - Default view
   - Shows all events
   - Color-coded by category
   - Click date to add event

2. **Week View**
   - Time slots (hourly)
   - All-day events at top
   - Drag to resize event duration
   - Drag to move event

3. **Day View**
   - Detailed hourly view
   - Event details visible
   - Timeline

4. **Agenda View**
   - List of upcoming events
   - Grouped by date
   - Next 30 days

**View Controls:**
- Previous/Next navigation
- Today button
- Date picker
- View selector

---

#### 11.2 Event Management
**User Story:** As a user, I want to create and manage events.

**Event Form:**
- Title (required)
- Description
- Category (Birthday, Appointment, Meeting, Holiday, School, Sports, Other)
- Date & time
- All-day event toggle
- End date & time
- Location
- Attendees (household members)
- Reminders (15 min, 1 hour, 1 day before)
- Recurring (yes/no)
- Color

**Event Categories:**
- Birthday 🎂
- Appointment 📅
- Meeting 👥
- Holiday 🎉
- School 📚
- Sports ⚽
- Other 📌

**Recurring Events:**
- Daily
- Weekly (select days)
- Monthly (select date or day of week)
- Yearly
- Custom

**Actions:**
- Create event
- Edit event
- Delete event
- Duplicate event
- Export to Google Calendar (future)

---

#### 11.3 Event Details
**User Story:** As a user, I want to see event information.

**Event Modal:**
- Title
- Date/time
- Location (with map link)
- Description
- Category badge
- Attendees (avatars)
- Reminder settings
- Edit button
- Delete button

---

#### 11.4 Calendar Filtering
**User Story:** As a user, I want to filter calendar events.

**Filters:**
- By category (multi-select)
- By member (show only specific member's events)
- By type (all-day, timed)

**Calendar Settings:**
- Start day of week (Sunday/Monday)
- Time format (12h/24h)
- Default reminder time
- Default view

---

## 12. Recipes Module

### Purpose
Recipe collection and meal planning

### Features

#### 12.1 Recipe Gallery
**User Story:** As a user, I want to browse recipes.

**Recipe Card:**
- Photo
- Title
- Description (short)
- Prep time
- Cook time
- Servings
- Tags
- Favorite button
- Quick actions

**Views:**
- Grid view (cards)
- List view
- Favorites only

**Filters:**
- Tags
- Prep time
- Servings
- Dietary restrictions (future)

**Search:**
- By name
- By ingredient
- By tag

---

#### 12.2 Recipe Management
**User Story:** As a user, I want to create and edit recipes.

**Recipe Form:**

**Section 1: Basic Info**
- Title
- Description
- Photo upload
- Prep time (minutes)
- Cook time (minutes)
- Total time (calculated)
- Servings
- Difficulty (Easy, Medium, Hard)
- Tags (multi-select)

**Section 2: Ingredients**
- Ingredient list (dynamic)
- Each ingredient:
  - Name
  - Quantity
  - Unit
  - Add/remove buttons
- Import from inventory

**Section 3: Instructions**
- Step-by-step instructions
- Each step:
  - Step number (auto)
  - Text (rich text)
  - Timer (optional)
  - Add/remove buttons
- Reorder steps (drag-drop)

**Section 4: Additional**
- Nutrition info (optional)
- Source (URL or book)
- Notes

**Actions:**
- Save recipe
- Save as draft
- Duplicate recipe
- Print recipe
- Share recipe

---

#### 12.3 Recipe Detail
**User Story:** As a user, I want to view recipe details.

**Layout:**
- Large photo
- Title and description
- Metadata (times, servings, difficulty)
- Tags
- Ingredients list (with checkboxes)
- Instructions (numbered steps)
- Notes section
- Add to meal plan button
- Generate shopping list button

**Cooking Mode:**
- Large text
- Step-by-step navigation
- Timers
- Hands-free voice control (future)

---

#### 12.4 Meal Planning
**User Story:** As a user, I want to plan meals.

**Meal Planner:**
- Weekly calendar grid
- Meal slots: Breakfast, Lunch, Dinner, Snacks
- Drag recipes from library to slots
- Quick notes per meal

**Features:**
- Add recipe to meal plan
- Add manual meal (no recipe)
- Notes per day
- Generate shopping list from meal plan
- Print meal plan

**Shopping List Generation:**
- Combine ingredients from all planned recipes
- Group by category
- Adjust quantities based on servings
- Remove items already in inventory
- Add to shopping list

---

## Success Metrics

For each module:
- [ ] All user stories completed
- [ ] Acceptance criteria met
- [ ] UI matches mockups
- [ ] Forms validate correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessibility (WCAG AA)
- [ ] Performance (page load < 2s)

---

## Next Steps

1. Review specifications with stakeholders
2. Create UI mockups/wireframes
3. Begin frontend development (per roadmap)
4. Implement backend once frontend approved
5. Integration testing
6. User acceptance testing

---

## Notes for Developers

- All forms require validation
- All delete actions require confirmation
- All lists support pagination
- All data loads with loading states
- All errors show user-friendly messages
- All dates use user's timezone
- All currency uses user's locale

---

**Ready to build! 🚀**
