# Admin CMS Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Dashboard (Frontend)                 │
│  ┌──────────┬──────────┬────────┬──────────┬─────────┐      │
│  │ Sermons  │ Events   │ Blog   │Donations │ Users   │      │
│  │Management│Management│Management│Analytics │Management     │
│  └──────────┴──────────┴────────┴──────────┴─────────┘      │
│                          │                                    │
│                   Protected Routes                            │
│              (Requires userRole === 'admin')                  │
└──────────────┬────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Authentication Context                       │
│                   (AuthContext.tsx)                          │
│                                                               │
│  ✓ Check Supabase Auth Session                              │
│  ✓ Fetch User Role from 'users' table                       │
│  ✓ Dev Mode: Auto-assign 'admin' role on signup             │
│  ✓ Prod Mode: Manual role assignment only                   │
└──────────────┬────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Auth (Supabase Authentication)              │   │
│  │  • User registration                                  │   │
│  │  • Password authentication                            │   │
│  │  • OAuth (Google, etc.)                               │   │
│  │  • Session management                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │    Database ('users' table with RLS policies)        │   │
│  │                                                        │   │
│  │  id (UUID)        → Links to auth.users               │   │
│  │  email (TEXT)     → User email                        │   │
│  │  role (ENUM)      → 'user' or 'admin'                │   │
│  │  created_at       → Account creation date             │   │
│  │  updated_at       → Last role update                  │   │
│  │                                                        │   │
│  │  Row Level Security (RLS):                            │   │
│  │  • Users can view own record                          │   │
│  │  • Admins can view all users                          │   │
│  │  • Only admins can update roles                       │   │
│  │  • Triggers auto-update 'updated_at' field            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## User Registration Flow (Development Mode)

```
User Signs Up at /auth/signup
    │
    ├─→ Enter: email + password
    │
    ▼
Supabase Auth Creates User
    │
    ├─→ User ID generated
    ├─→ Email stored in auth.users
    ├─→ Password hashed
    │
    ▼
Check: Is Dev Mode Enabled?
    │
    ├─→ YES (NEXT_PUBLIC_DEV_MODE=true)
    │   │
    │   ▼
    │   Create 'users' record with role='admin'
    │   │
    │   ▼
    │   ✅ User is ADMIN (can access /admin)
    │
    └─→ NO (Production)
        │
        ▼
        Create 'users' record with role='user'
        │
        ▼
        ✅ User is USER (cannot access /admin)
           Admin must manually change role
```

---

## User Login Flow

```
User Goes to /auth/login
    │
    ├─→ Enter: email + password
    │
    ▼
Supabase Auth Validates Credentials
    │
    ├─→ Email & password match?
    │   YES ─→ Session created
    │   NO  ─→ Login fails
    │
    ▼
React Context Fetches User Role
    │
    ├─→ Query: SELECT role FROM users WHERE id = ?
    │
    ▼
AuthContext Updates State
    │
    ├─→ user = { User object }
    ├─→ isAuthenticated = true
    ├─→ userRole = 'admin' or 'user'
    │
    ▼
Check: userRole === 'admin'?
    │
    ├─→ YES ─→ Can access /admin ✅
    │   ├─→ Can view all CMS pages
    │   ├─→ Can create/edit/delete content
    │   └─→ Can manage users & settings
    │
    └─→ NO ─→ Redirected to /auth/login ❌
        └─→ Shows "Access Denied" message
```

---

## Admin Role Assignment Methods

### Method 1️⃣ : Development Mode (Instant)

```
signup → auto role='admin' ✓ Fastest
           ↑
       Dev Mode Only
```

**When**: Local development, testing
**How**: Just signup, immediately admin
**Effort**: ⭐ Zero

### Method 2️⃣ : Seed Script (Automated)

```
seed-admin.ts → creates admin@elimcity.com ✓ Automated
                 ↓
          Production-ready
```

**When**: New deployment, creating initial admin
**How**: `npx ts-node scripts/seed-admin.ts`
**Effort**: ⭐ Minimal

### Method 3️⃣ : Manual Role Change (Flexible)

```
User Signs Up → role='user' → Admin edits → role='admin' ✓ Flexible
                              via /admin/users
```

**When**: Adding team members, granting permissions
**How**: Login as admin → goto /admin/users → change role
**Effort**: ⭐⭐ Two steps

### Method 4️⃣ : Direct Database (Emergency)

```
Supabase Dashboard → users table → UPDATE role ✓ Direct
                     ↓
              Fastest if UI fails
```

**When**: UI broken, emergency access needed
**How**: Supabase → Table Editor → users → Edit row
**Effort**: ⭐⭐⭐ Three steps

---

## Development vs. Production Modes

| Aspect             | Development Mode            | Production Mode              |
| ------------------ | --------------------------- | ---------------------------- |
| **Env Variable**   | `NEXT_PUBLIC_DEV_MODE=true` | `NEXT_PUBLIC_DEV_MODE=false` |
| **Signup → Role**  | Auto `admin`                | Auto `user`                  |
| **Use Case**       | Local testing               | Live website                 |
| **Security**       | ⚠️ Low (everyone admin)     | ✅ High (selective admin)    |
| **When Enable**    | `npm run dev` locally       | `.env.production` only       |
| **Admin Creation** | Via signup                  | Seed script or manual        |

---

## Database Schema Relationships

```
Supabase Auth Instance
    │
    ├─→ auth.users (Managed by Supabase)
    │   │
    │   ├─ id (UUID) ────────────┐
    │   ├─ email (TEXT)           │ Links to
    │   ├─ created_at             │ our users table
    │   └─ ...                    │
    │                             │
    ▼                             ▼
Public Schema
    │
    └─→ users (Created by migration)
        │
        ├─ id (UUID) ──→ References auth.users(id)
        ├─ email (TEXT) ─→ Unique, indexed
        ├─ role (ENUM) ──→ 'user' or 'admin'
        ├─ created_at ───→ Auto-timestamp
        ├─ updated_at ───→ Auto-updated on role change
        │
        └─ Indexes:
           ├─ idx_users_email ──→ Fast email lookups
           └─ idx_users_role ───→ Fast role queries
```

---

## File Structure Overview

```
Source Files
├── src/
│   ├── context/
│   │   └── AuthContext.tsx ←─ Updated
│   │       └─ Dev mode logic
│   │       └─ Role auto-assignment
│   │       └─ Role fetching from DB
│   │
│   └── pages/
│       ├── admin/
│       │   ├── index.tsx ←─ Dashboard (protected)
│       │   ├── sermons.tsx ←─ CMS (protected)
│       │   ├── events.tsx
│       │   ├── blog.tsx
│       │   ├── giving.tsx
│       │   ├── users.tsx
│       │   └── settings.tsx
│       │
│       └── auth/
│           ├── login.tsx ←─ Auth entry
│           └── signup.tsx ←─ Creates users + assigns role

Config Files
├── .env.local ←─ Updated with NEXT_PUBLIC_DEV_MODE
├── .env.example ←─ Template
├── .env.production ←─ (Not in repo)

Database
├── database/
│   └── migrations/
│       └── 001_create_users_table.sql ←─ NEW
│           └─ Creates users table
│           └─ Sets up RLS policies
│           └─ Creates indexes & triggers

Scripts
├── scripts/
│   └── seed-admin.ts ←─ NEW
│       └─ Creates admin@elimcity.com
│       └─ Auto-confirms email
│       └─ Assigns admin role

Documentation
├── ADMIN_SETUP.md ←─ Complete guide
├── ADMIN_SETUP_CHECKLIST.md ←─ Quick checklist
└── ARCHITECTURE.md ←─ This file
```

---

## Security Implementation

### Row Level Security (RLS) Policies

```sql
Policy 1: "Users can read their own record"
├─→ SELECT ✓ WHERE auth.uid() = id
└─→ Use: Users view own profile

Policy 2: "Admins can read all users"
├─→ SELECT ✓ WHERE role='admin'
└─→ Use: Admin dashboard list users

Policy 3: "Only admins can update roles"
├─→ UPDATE ✓ WHERE role='admin'
└─→ Use: Role assignment in /admin/users
└─→ Prevents: Non-admins changing roles
```

### Why RLS Matters

```
Without RLS:
    Client ──→ [Anyone could query any role] ──→ Dangerous

With RLS:
    Client ──→ [Policy check] ──→ [Only authorized data returned]
                     ↓
              Is user admin? → Yes ✓ / No ✗
```

---

## API Integration Points (Future)

These endpoints can be added to `/src/pages/api/` to persist data:

```
POST   /api/admin/sermons        ← Create sermon
GET    /api/admin/sermons        ← List sermons
PUT    /api/admin/sermons/:id    ← Update sermon
DELETE /api/admin/sermons/:id    ← Delete sermon

POST   /api/admin/events         ← Etc...
POST   /api/admin/blog
POST   /api/admin/users
```

Currently, all data is stored in-memory (client state). Connect to database:

```typescript
// Example: Save sermon to Supabase
const { data, error } = await supabase
  .from("sermons")
  .insert([{ title, speaker, date, duration, description }])
  .select();
```

---

## Summary

✅ **What's Implemented**:

- Protected admin routes (`/admin/*`)
- User authentication & authorization
- Role-based access control (admin vs user)
- Development mode for fast testing
- Production mode for security
- Supabase database schema with RLS
- Admin seeding script
- Complete documentation

🚀 **Ready to Deploy**:

1. Run database migration
2. Configure environment variables
3. Create admin account (seed or manual)
4. Disable dev mode for production
5. Start managing content!

---

**Questions? See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed instructions.**
