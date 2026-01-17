# Fresh Start Setup Guide - Household Hero with NestJS

This guide will walk you through setting up the complete development environment for the new Household Hero app using NestJS, PostgreSQL, and React.

---

## Prerequisites

Before starting, make sure you have these installed:

```bash
# Node.js 20 LTS (check version)
node --version  # Should be v20.x.x

# npm (comes with Node)
npm --version   # Should be 10.x.x or higher

# Docker Desktop
docker --version        # Should be 24.x.x or higher
docker-compose --version  # Should be 2.x.x or higher

# Git
git --version
```

**Don't have them?**
- **Node.js 20**: Download from https://nodejs.org/
- **Docker Desktop**: Download from https://www.docker.com/products/docker-desktop/
- **Git**: Download from https://git-scm.com/

---

## Project Structure Overview

```
household-hero/                    # Root directory (fresh start)
├── apps/
│   ├── api/                      # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/         # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── tasks/
│   │   │   │   ├── calendar/
│   │   │   │   └── ...
│   │   │   ├── common/          # Shared code
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── test/
│   │   ├── .env
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── web/                      # React frontend
│       ├── src/
│       │   ├── features/        # Feature modules
│       │   │   ├── auth/
│       │   │   ├── tasks/
│       │   │   └── ...
│       │   ├── shared/          # Shared components
│       │   └── App.tsx
│       ├── public/
│       ├── .env
│       ├── .env.example
│       └── package.json
│
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   └── init.sql
│
├── docs/
│   └── (documentation files)
│
├── .gitignore
├── package.json                  # Root package.json (monorepo)
└── README.md
```

---

## Step-by-Step Setup

### Step 1: Install NestJS CLI

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Verify installation
nest --version
```

### Step 2: Create Backend (API)

```bash
# Navigate to your project root
cd /home/user/household-hero-app

# Create apps directory
mkdir -p apps

# Create NestJS backend
cd apps
nest new api

# When prompted, choose npm as package manager
# Wait for installation to complete...

cd api
```

### Step 3: Install Backend Dependencies

```bash
# Still in apps/api directory

# Install Prisma
npm install prisma @prisma/client

# Install authentication dependencies
npm install @nestjs/passport passport @nestjs/jwt passport-jwt bcryptjs
npm install -D @types/passport-jwt @types/bcryptjs

# Install validation
npm install class-validator class-transformer

# Install configuration
npm install @nestjs/config

# Install CORS
npm install @nestjs/cors

# Install rate limiting
npm install @nestjs/throttler

# Install testing utilities (already included but let's ensure)
npm install -D @nestjs/testing

# Install speakeasy for 2FA
npm install speakeasy qrcode
npm install -D @types/speakeasy @types/qrcode
```

### Step 4: Initialize Prisma

```bash
# Still in apps/api

# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env file
```

### Step 5: Set Up Docker

```bash
# Navigate to project root
cd /home/user/household-hero-app

# Create docker directory
mkdir -p docker

# Docker files will be created in the next step
```

### Step 6: Start Docker Services

```bash
# From project root
cd /home/user/household-hero-app/docker

# Start PostgreSQL and Redis
docker-compose up -d

# Verify containers are running
docker ps

# You should see:
# - household-hero-db (PostgreSQL)
# - household-hero-redis (Redis)
# - household-hero-pgadmin (Optional admin UI)
```

### Step 7: Configure Database Connection

```bash
# Edit apps/api/.env
# Update DATABASE_URL to:

DATABASE_URL="postgresql://household:dev_password@localhost:5432/household_hero?schema=public"
```

### Step 8: Run Database Migrations

```bash
# From apps/api
cd /home/user/household-hero-app/apps/api

# Generate Prisma client
npx prisma generate

# Create first migration
npx prisma migrate dev --name init

# Open Prisma Studio to see your database
npx prisma studio
# Opens at http://localhost:5555
```

### Step 9: Set Up Frontend

```bash
# Navigate to apps directory
cd /home/user/household-hero-app/apps

# Create React app with Vite
npm create vite@latest web -- --template react-ts

cd web

# Install dependencies
npm install

# Install additional dependencies
npm install react-router-dom @tanstack/react-query axios zustand
npm install react-hook-form zod @hookform/resolvers
npm install i18next react-i18next

# Install UI dependencies (shadcn/ui)
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui CLI
npm install -D @shadcn/ui

# Initialize shadcn/ui
npx shadcn-ui@latest init
```

### Step 10: Start Development Servers

```bash
# Terminal 1: Start backend
cd /home/user/household-hero-app/apps/api
npm run start:dev

# Terminal 2: Start frontend
cd /home/user/household-hero-app/apps/web
npm run dev

# Backend runs on: http://localhost:3000
# Frontend runs on: http://localhost:5173
```

---

## Verification Checklist

After setup, verify everything works:

- [ ] Docker containers running: `docker ps`
- [ ] PostgreSQL accessible: `psql -h localhost -U household -d household_hero`
- [ ] Prisma Studio opens: `npx prisma studio`
- [ ] Backend starts: `http://localhost:3000`
- [ ] Frontend starts: `http://localhost:5173`
- [ ] No errors in terminals

---

## Database Access

### Using Prisma Studio (Recommended)
```bash
cd apps/api
npx prisma studio
```
Opens at http://localhost:5555 - GUI for viewing/editing data

### Using pgAdmin (Alternative)
Open http://localhost:5050
- Email: admin@household.local
- Password: admin

Add server:
- Host: postgres (or localhost)
- Port: 5432
- Username: household
- Password: dev_password
- Database: household_hero

### Using psql (Terminal)
```bash
docker exec -it household-hero-db psql -U household -d household_hero
```

---

## Common Commands

### Docker
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart postgres

# Remove all data (⚠️ destructive)
docker-compose down -v
```

### Prisma
```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (⚠️ destructive)
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open Studio
npx prisma studio
```

### NestJS
```bash
# Start dev server (with watch mode)
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Generate module
nest generate module <name>

# Generate controller
nest generate controller <name>

# Generate service
nest generate service <name>

# Generate complete resource (module + controller + service)
nest generate resource <name>
```

### React (Vite)
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

---

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://household:dev_password@localhost:5432/household_hero?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# App
NODE_ENV="development"
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"

# Email (for password reset - optional for now)
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER=""
SMTP_PASSWORD=""
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## Project Structure Details

### Backend Module Structure

Each NestJS module follows this pattern:

```
src/modules/tasks/
├── dto/                          # Data Transfer Objects
│   ├── create-task.dto.ts
│   └── update-task.dto.ts
├── entities/                     # Prisma entities/types
│   └── task.entity.ts
├── tasks.controller.ts           # HTTP endpoints
├── tasks.service.ts              # Business logic
├── tasks.module.ts               # Module definition
└── tasks.controller.spec.ts      # Tests
```

### Frontend Feature Structure

Each React feature follows this pattern:

```
src/features/tasks/
├── components/                   # Feature-specific components
│   ├── TaskList.tsx
│   ├── TaskCard.tsx
│   └── TaskForm.tsx
├── hooks/                        # Custom hooks
│   ├── useTasks.ts
│   └── useTaskMutations.ts
├── services/                     # API calls
│   └── taskApi.ts
├── types/                        # TypeScript types
│   └── task.types.ts
├── pages/                        # Route pages
│   └── TasksPage.tsx
└── index.ts                      # Public exports
```

---

## Next Steps

After setup is complete:

1. **Study the architecture**
   - Read NestJS documentation: https://docs.nestjs.com/
   - Read Prisma documentation: https://www.prisma.io/docs/

2. **Build first module**
   - Start with authentication
   - Follow the AUTH_MODULE_GUIDE.md

3. **Set up testing**
   - Write unit tests for services
   - Write e2e tests for endpoints

4. **Build frontend**
   - Set up routing
   - Create authentication flow
   - Build first feature (tasks)

---

## Troubleshooting

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Docker connection refused
```bash
# Check if Docker is running
docker ps

# Restart Docker Desktop

# Recreate containers
docker-compose down
docker-compose up -d
```

### Prisma errors
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database
npx prisma migrate reset
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Learning Resources

### NestJS
- Official Docs: https://docs.nestjs.com/
- Video Course: https://www.udemy.com/course/nestjs-zero-to-hero/
- GitHub Examples: https://github.com/nestjs/nest/tree/master/sample

### Prisma
- Official Docs: https://www.prisma.io/docs/
- Interactive Tutorial: https://www.prisma.io/docs/getting-started
- Schema Reference: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference

### Docker
- PostgreSQL Image: https://hub.docker.com/_/postgres
- Docker Compose: https://docs.docker.com/compose/

### TypeScript
- Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- Best Practices: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html

---

## Success! 🎉

You now have a professional-grade development environment with:
- ✅ NestJS backend with TypeScript
- ✅ PostgreSQL database running in Docker
- ✅ Prisma ORM for type-safe database access
- ✅ Redis for caching
- ✅ React frontend with Vite
- ✅ Complete development tooling

**You're ready to build Household Hero v2!**

Next: Check out `AUTH_MODULE_GUIDE.md` to build your first module.
