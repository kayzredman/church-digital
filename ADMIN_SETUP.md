# Admin Setup & Configuration Guide

This guide walks you through setting up the Admin CMS Dashboard with proper database schema, dev mode, and seeded admin accounts.

## 📋 Table of Contents

1. [Quick Start (Development)](#quick-start-development)
2. [Database Setup](#database-setup)
3. [Admin Account Creation](#admin-account-creation)
4. [Accessing the Admin Dashboard](#accessing-the-admin-dashboard)
5. [Production Deployment](#production-deployment)

---

## Quick Start (Development)

### For Local Development (Easiest Setup)

1. **Development mode is already enabled** in `.env.local`:

   ```
   NEXT_PUBLIC_DEV_MODE=true
   ```

2. **Create any account** to test:
   - Visit `http://localhost:3000/auth/signup`
   - Fill in email and password
   - **Any signup will automatically get `admin` role** in dev mode

3. **Access admin dashboard**:
   - Go to `http://localhost:3000/admin`
   - Full access to all CMS features

⚠️ **Important:** Dev mode should only be used locally. Always disable for production!

---

## Database Setup

### Step 1: Run Supabase Migration

You need to set up the users table in your Supabase database.

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy the entire contents of `database/migrations/001_create_users_table.sql`
5. Paste into the SQL editor
6. Click **Run** (or Cmd+Enter)

Expected output:

```
CREATE TABLE
CREATE INDEX
CREATE INDEX
ALTER TABLE
CREATE POLICY
CREATE POLICY
CREATE POLICY
CREATE FUNCTION
CREATE TRIGGER
```

#### Option B: Using Supabase CLI

```bash
# Install CLI (if not already installed)
npm install -g supabase

# Run migrations
supabase db pull  # Downloads your schema
supabase db push  # Pushes local migrations
```

#### Option C: Manual SQL

If the migration file approach doesn't work, run each SQL statement individually in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ... (rest of migration file)
```

### Verify the Table Exists

In Supabase Dashboard:

1. Go to **Table Editor**
2. Look for `users` table
3. Should have columns: `id`, `email`, `role`, `created_at`, `updated_at`

---

## Admin Account Creation

### Option 1: Development Mode (Instant)

**Already configured!** Just:

1. Start the dev server: `npm run dev`
2. Sign up at `http://localhost:3000/auth/signup`
3. Any account = admin in dev mode ✓

### Option 2: Seed Script (Recommended for Production Prep)

This creates a default admin account: `admin@elimcity.com` / `admin123`

```bash
# Make sure you have SUPABASE_SERVICE_ROLE_KEY in your .env.local
# Then run:
npx ts-node scripts/seed-admin.ts
```

Expected output:

```
🌱 Starting admin account seeding...

Creating admin user: admin@elimcity.com
✓ Admin user created: [user-id]
✓ Admin user record created with admin role

✅ Admin account seeding completed!

📝 Admin Credentials:
   Email: admin@elimcity.com
   Password: admin123

⚠️  IMPORTANT: Change this password after first login!
```

### Option 3: Manual Creation via Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email: `admin@elimcity.com`
4. Enter password: `admin123`
5. Check **Auto Confirm User**
6. Click **Create User**

Then add the user record:

1. Go to **Table Editor** → **users** table
2. Click **Insert Row**
3. Fill in:
   - `id`: Copy the user ID from the Auth user created above
   - `email`: `admin@elimcity.com`
   - `role`: `admin`
   - Leave `created_at` and `updated_at` as default

---

## Accessing the Admin Dashboard

### Prerequisites

1. Server running: `npm run dev`
2. Supabase configured and connected
3. Admin user created (one of the methods above)
4. Database migration applied

### Login Steps

1. **Go to login page**:

   ```
   http://localhost:3000/auth/login
   ```

2. **Enter admin credentials**:
   - Email: `admin@elimcity.com` (or your dev signup email)
   - Password: `admin123` (or your dev signup password)

3. **Access dashboard**:
   ```
   http://localhost:3000/admin
   ```

### Dashboard Sections

Once logged in as admin, you can access:

- **Dashboard** (`/admin`)
  - Overview stats (sermons, events, donations, users)
  - Quick navigation to all modules

- **Sermon Management** (`/admin/sermons`)
  - Add, edit, delete sermons
  - Search by title or speaker
  - Manage duration and descriptions

- **Event Management** (`/admin/events`)
  - Create and manage events
  - Track attendance and capacity
  - Control event details

- **Blog Management** (`/admin/blog`)
  - Write and publish blog posts
  - Categorize content (news, events, devotion, ministry)
  - Draft/publish status control

- **Donations Analytics** (`/admin/giving`)
  - View donation statistics
  - Track payment methods
  - Monthly/yearly reports

- **User Management** (`/admin/users`)
  - List all users
  - Assign/change roles (admin/user)
  - Control user status (active/inactive)

- **Settings** (`/admin/settings`)
  - Church information
  - API key configuration
  - Email settings
  - Feature toggles
  - Maintenance mode

---

## Production Deployment

### Before Going Live

1. **Disable Development Mode**:

   ```
   # .env.local or production env
   NEXT_PUBLIC_DEV_MODE=false
   ```

2. **Create Production Admin Account**:

   ```bash
   # Run seed script with production Supabase creds
   SUPABASE_SERVICE_ROLE_KEY=your_prod_key npx ts-node scripts/seed-admin.ts
   ```

3. **Change Default Admin Password**:
   - Login with `admin@elimcity.com` / `admin123`
   - Go to `/admin/settings`
   - Update password immediately

4. **Configure API Keys** in Settings:
   - Stripe keys
   - Paystack keys
   - Cloudinary keys
   - Email service keys

5. **Create Additional Admins**:
   - Users → Edit → Change role to "admin"
   - As needed for your team

6. **Test All Features**:
   - Create test sermon
   - Create test event
   - Process test donation
   - Verify email notifications

### Environment Variables for Production

```bash
# .env.production
NEXT_PUBLIC_SUPABASE_URL=your_prod_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_prod_service_key

# Disable dev mode
NEXT_PUBLIC_DEV_MODE=false

# Configure all API keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
# ... etc
```

---

## Troubleshooting

### "Admin Dashboard not accessible"

- ✓ Check if logged in: Go to `/auth/login`
- ✓ Verify user role: Check `users` table in Supabase
- ✓ Check dev mode: `NEXT_PUBLIC_DEV_MODE` should be `true` locally
- ✓ Clear browser cache and cookies

### "Database migration failed"

- ✓ Check user has editor role in Supabase
- ✓ Verify `users` table doesn't already exist
- ✓ Try running SQL statements individually in SQL Editor

### "Seed script fails"

- ✓ Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- ✓ Verify database migration already ran
- ✓ Check if user already exists: `admin@elimcity.com`

### "Can't create new sermons/events"

- ✓ Verify you're logged in as admin
- ✓ Check browser console for errors
- ✓ Ensure database is responding: go to Supabase Dashboard

---

## File Structure

```
elimthronerm-site/
├── database/
│   └── migrations/
│       └── 001_create_users_table.sql  ← Database schema
├── scripts/
│   └── seed-admin.ts                   ← Admin seeding script
├── src/
│   ├── context/
│   │   └── AuthContext.tsx             ← Updated with dev mode logic
│   └── pages/
│       ├── admin/
│       │   ├── index.tsx               ← Main dashboard
│       │   ├── sermons.tsx             ← Sermon CMS
│       │   ├── events.tsx              ← Event CMS
│       │   ├── blog.tsx                ← Blog CMS
│       │   ├── giving.tsx              ← Donation analytics
│       │   ├── users.tsx               ← User management
│       │   └── settings.tsx            ← Configuration
│       └── auth/
│           ├── login.tsx
│           └── signup.tsx
├── .env.local                          ← Updated with NEXT_PUBLIC_DEV_MODE
└── package.json
```

---

## Quick Command Reference

```bash
# Development
npm run dev                              # Start dev server

# Building
npm run build                            # Build for production

# Seeding (requires SUPABASE_SERVICE_ROLE_KEY)
npx ts-node scripts/seed-admin.ts       # Create admin account

# Database
# (Use Supabase Dashboard for most operations)
```

---

## Security Notes

⚠️ **Important Security Guidelines**:

1. **Never commit `.env.local`** to version control
2. **Change default admin password** after first production deployment
3. **Rotate API keys** regularly
4. **Use strong passwords** for admin accounts
5. **Enable 2FA** if Supabase supports it
6. **Keep `SUPABASE_SERVICE_ROLE_KEY` secret** (never in client code)
7. **Disable `NEXT_PUBLIC_DEV_MODE`** for production
8. **Review RLS policies** regularly

---

## Support & Issues

For help with:

- **Supabase issues**: Check [Supabase Docs](https://supabase.com/docs)
- **Next.js questions**: See [Next.js Docs](https://nextjs.org/docs)
- **Admin CMS features**: Check individual page documentation

---

**Happy CMS-ing! 🚀**
