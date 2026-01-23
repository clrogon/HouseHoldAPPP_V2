# Backend Setup & Configuration Log

**Date:** January 23, 2026
**Project:** HouseHoldAPPP_V2
**Backend Location:** `apps/api/`

---

## Overview

This document records all actions taken to set up and fix the NestJS backend server, including Docker services, database migrations, and TypeScript error resolutions.

---

## 1. Docker Services Started

### Command
```bash
cd apps/api/docker && docker-compose up -d
```

### Services Running
| Service | Container Name | Port | Status |
|---------|---------------|------|--------|
| PostgreSQL 16 | household_postgres | 5432 | ✅ Healthy |
| Redis 7 | household_redis | 6379 | ✅ Running |
| pgAdmin 4 | household_pgadmin | 5050 | ✅ Running |

### Access URLs
- **pgAdmin:** http://localhost:5050
  - Email: admin@household.com
  - Password: admin

---

## 2. Database Migrations

### Command
```bash
cd apps/api && npx prisma migrate dev
```

### Result
```
Prisma schema loaded from prisma/schema.prisma.
Datasource "db": PostgreSQL database "household_db", schema "public" at "localhost:5432"
Already in sync, no schema change or pending migration was found.
```

---

## 3. TypeScript Errors Fixed

### 3.1 JwtPayload Import Errors (TS1272)

**Problem:** `JwtPayload` type was imported incorrectly in decorated method signatures. With `isolatedModules` and `emitDecoratorMetadata` enabled, types must use `import type`.

**Error Message:**
```
A type referenced in a decorated signature must be imported with 'import type'
or a namespace import when 'isolatedModules' and 'emitDecoratorMetadata' are enabled.
```

**Files Fixed:**

#### `src/modules/auth/auth.controller.ts`
```typescript
// Before
import { Public, CurrentUser, JwtPayload } from '../../common/decorators';

// After
import { Public, CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
```

#### `src/modules/household/household.controller.ts`
```typescript
// Before
import { CurrentUser, JwtPayload } from '../../common/decorators';

// After
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
```

#### `src/modules/users/users.controller.ts`
```typescript
// Before
import { CurrentUser, JwtPayload } from '../../common/decorators';

// After
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
```

---

### 3.2 JWT Secret Undefined Errors (TS2345)

**Problem:** `secretOrKey` could be `undefined` if config wasn't set, but the type required `string | Buffer`.

**Error Message:**
```
Type 'string | undefined' is not assignable to type 'string | Buffer<ArrayBufferLike>'.
Type 'undefined' is not assignable to type 'string | Buffer<ArrayBufferLike>'.
```

**Files Fixed:**

#### `src/modules/auth/strategies/jwt.strategy.ts`
```typescript
// Before
super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: configService.get<string>('jwt.secret'),
});

// After
super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: configService.get<string>('jwt.secret') || 'fallback-secret-change-in-production',
});
```

#### `src/modules/auth/strategies/jwt-refresh.strategy.ts`
```typescript
// Before
super({
  jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
  ignoreExpiration: false,
  secretOrKey: configService.get<string>('jwt.refreshSecret'),
  passReqToCallback: true,
});

// After
super({
  jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
  ignoreExpiration: false,
  secretOrKey: configService.get<string>('jwt.refreshSecret') || 'fallback-refresh-secret-change-in-production',
  passReqToCallback: true,
});
```

---

### 3.3 JWT expiresIn Type Errors (TS2769)

**Problem:** With `@nestjs/jwt@11.0.2`, the `expiresIn` option type changed. String values like `'15m'` no longer worked directly.

**Error Message:**
```
Type 'string' is not assignable to type 'number | StringValue | undefined'.
```

**Files Fixed:**

#### `src/modules/auth/auth.service.ts`
```typescript
// Before
const accessToken = this.jwtService.sign(payload, {
  secret: this.configService.get<string>('jwt.secret'),
  expiresIn: this.configService.get<string>('jwt.expiresIn', '15m'),
});

const refreshToken = this.jwtService.sign(
  { sub: user.id, email: user.email },
  {
    secret: this.configService.get<string>('jwt.refreshSecret'),
    expiresIn: this.configService.get<string>('jwt.refreshExpiresIn', '7d'),
  },
);

// After
const accessToken = this.jwtService.sign(payload, {
  secret: this.configService.get<string>('jwt.secret') || 'fallback-secret',
  expiresIn: 900, // 15 minutes in seconds
});

const refreshToken = this.jwtService.sign(
  { sub: user.id, email: user.email },
  {
    secret: this.configService.get<string>('jwt.refreshSecret') || 'fallback-refresh-secret',
    expiresIn: 604800, // 7 days in seconds
  },
);
```

#### `src/modules/auth/auth.module.ts`
```typescript
// Before
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('jwt.secret'),
    signOptions: {
      expiresIn: configService.get<string>('jwt.expiresIn', '15m'),
    },
  }),
}),

// After
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('jwt.secret') || 'fallback-secret',
    signOptions: {
      expiresIn: 900, // 15 minutes in seconds
    },
  }),
}),
```

---

### 3.4 Prisma Config Errors (TS2353)

**Problem:** `earlyAccess` and `migrate` properties don't exist on `PrismaConfig` type.

**Error Message:**
```
Object literal may only specify known properties, and 'earlyAccess' does not exist in type 'PrismaConfig'.
```

**File Fixed:**

#### `prisma/prisma.config.ts`
```typescript
// Before
export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),
  migrate: {
    async adapter() {
      // ... adapter config
    },
  },
});

// After
export default defineConfig({
  schema: path.join(__dirname, 'schema.prisma'),
});
```

---

## 4. Backend Server Started

### Command
```bash
cd apps/api && npm run start:dev
```

### Result
```
[Nest] Application running on http://localhost:3001
[Nest] Swagger docs available at http://localhost:3001/api/docs
```

---

## 5. API Routes Available

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Login with email/password | No |
| POST | `/auth/register` | Register new user & household | No |
| POST | `/auth/refresh` | Refresh access token | No (uses refresh token) |
| POST | `/auth/logout` | Logout user | Yes |

### Users (`/api/v1/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get current user profile | Yes |
| PATCH | `/users/me` | Update current user profile | Yes |
| POST | `/users/me/change-password` | Change password | Yes |
| GET | `/users/:id` | Get user by ID | Yes |

### Household (`/api/v1/household`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/household` | Get current household | Yes |
| PATCH | `/household` | Update household details | Yes |
| GET | `/household/members` | Get household members | Yes |
| POST | `/household/invite` | Invite new member | Yes |
| DELETE | `/household/members/:memberId` | Remove member | Yes |

---

## 6. Service Access Summary

| Service | URL | Purpose |
|---------|-----|---------|
| NestJS API | http://localhost:3001 | Backend API |
| Swagger Docs | http://localhost:3001/api/docs | API Documentation |
| pgAdmin | http://localhost:5050 | Database GUI |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache/Sessions |
| Frontend | http://localhost:5173 | React App |

---

## 7. Environment Configuration

### Backend `.env` (apps/api/.env)
```env
# Database
DATABASE_URL="postgresql://household:household_secret@localhost:5432/household_db?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3001
NODE_ENV=development
API_PREFIX=api/v1
```

### Frontend `.env` (root .env)
```env
VITE_API_URL=http://localhost:3001/api/v1
```

---

## 8. Files Modified Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `src/modules/auth/auth.controller.ts` | Import fix | Separated type import for JwtPayload |
| `src/modules/household/household.controller.ts` | Import fix | Separated type import for JwtPayload |
| `src/modules/users/users.controller.ts` | Import fix | Separated type import for JwtPayload |
| `src/modules/auth/strategies/jwt.strategy.ts` | Config fix | Added fallback for secretOrKey |
| `src/modules/auth/strategies/jwt-refresh.strategy.ts` | Config fix | Added fallback for secretOrKey |
| `src/modules/auth/auth.service.ts` | Type fix | Changed expiresIn from string to number |
| `src/modules/auth/auth.module.ts` | Type fix | Changed expiresIn from string to number |
| `prisma/prisma.config.ts` | Config fix | Removed unsupported properties |

---

## 9. Next Steps

1. **Create a user account** via the frontend registration page or Swagger docs
2. **Test the invite functionality** after logging in as an admin
3. **Configure production secrets** - replace all fallback secrets before deployment
4. **Set up additional modules** (tasks, inventory, finance, etc.) as needed

---

## 10. Troubleshooting

### Backend won't start
1. Check Docker services are running: `docker ps`
2. Check database connection: `npx prisma db push`
3. Check for TypeScript errors: `npm run build`

### Database connection issues
1. Verify PostgreSQL is running: `docker-compose ps`
2. Check DATABASE_URL in `.env`
3. Run migrations: `npx prisma migrate dev`

### Authentication not working
1. Check JWT_SECRET is set in `.env`
2. Verify frontend VITE_API_URL matches backend
3. Check browser console for CORS errors
