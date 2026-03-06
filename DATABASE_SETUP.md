# Database Migrations Setup Guide

This guide walks you through running all the database migrations in your Supabase project to enable full Elim Digital functionality.

## 📋 Migrations Overview

The following tables will be created:

1. **users** (001) - User accounts and roles (already exists)
2. **sermons** (002) - Sermon management
3. **events** (003) - Event management
4. **blog_posts** (004) - Blog content management
5. **donations** (005) - Donation tracking and analytics
6. **event_attendees** (006) - Event attendance tracking

## 🚀 Running Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. **Open Supabase**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Run Each Migration in Order**:
   - Go to **SQL Editor** → **New Query**
   - For each file below, in order:
     - Open the migration file from `database/migrations/`
     - Copy the entire contents
     - Paste into the SQL editor
     - Click **Run** (or Cmd/Ctrl+Enter)

3. **Expected Order**:
   ```
   ✓ 001_create_users_table.sql (should already exist)
   ✓ 002_create_sermons_table.sql
   ✓ 003_create_events_table.sql
   ✓ 004_create_blog_posts_table.sql
   ✓ 005_create_donations_table.sql
   ✓ 006_create_event_attendees_table.sql
   ```

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link your local project to your Supabase project
supabase link --project-ref your_project_id

# Run all migrations
supabase db push
```

## ✅ Verification

After running all migrations, verify everything is set up correctly:

### 1. Check Tables in Supabase Dashboard

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `users`
   - `sermons`
   - `events`
   - `blog_posts`
   - `donations`
   - `event_attendees`

### 2. Check Data Types

Each table should have these columns:

**sermons**

- `id` (UUID, primary key)
- `title` (text)
- `speaker` (text)
- `date` (date)
- `duration` (integer)
- `description` (text)
- `created_at`, `updated_at` (timestamps)

**events**

- `id` (UUID, primary key)
- `title` (text)
- `description` (text)
- `date` (date)
- `time` (time)
- `location` (text)
- `capacity` (integer)
- `status` (text: scheduled/cancelled/completed)
- `created_at`, `updated_at` (timestamps)

**blog_posts**

- `id` (UUID, primary key)
- `title` (text)
- `slug` (text, unique)
- `content` (text)
- `excerpt` (text)
- `category` (text: news/events/devotion/ministry)
- `status` (text: draft/published)
- `featured_image` (text)
- `author_id` (foreign key to users)
- `published_at`, `created_at`, `updated_at` (timestamps)

**donations**

- `id` (UUID, primary key)
- `user_id` (foreign key to users)
- `amount` (decimal)
- `currency` (text)
- `payment_method` (text: stripe/paystack/bank_transfer)
- `status` (text: pending/completed/failed/refunded)
- `transaction_id` (text, unique)
- `donor_name`, `donor_email` (text)
- `note` (text)
- `created_at`, `updated_at` (timestamps)

**event_attendees**

- `id` (UUID, primary key)
- `event_id` (foreign key to events)
- `user_id` (foreign key to users)
- `attendee_name` (text)
- `attendee_email` (text)
- `status` (text: registered/attended/cancelled)
- `created_at`, `updated_at` (timestamps)

## 🔐 Security Features

All tables have Row Level Security (RLS) enabled with these policies:

- **Public Read**: Anyone can view most data
- **Admin Write**: Only authenticated admin users can create/update/delete
- **User Privacy**: Users can only see their own data where applicable

## 📊 Analytics View

The donations migration creates a `donation_analytics` view for tracking:

- Monthly donation totals
- Payment method breakdown
- Donation status counts
- Average donation amounts

Access it in Supabase under Views → `donation_analytics`

## 🔄 Auto-Update Timestamps

All tables have automatic triggers that update the `updated_at` field whenever a record is modified.

## ⚙️ Indexes for Performance

All tables have optimized indexes on commonly searched fields:

- `date`, `created_at` (sort operations)
- `status`, `category` (filters)
- `user_id` (relationships)

## ❌ Troubleshooting

### Migration fails with "already exists" error

- The table may already exist in your database
- This is safe to ignore or you can drop the table first and re-run

### Permission denied errors

- Ensure your Supabase user has editor role
- Check you're in the correct project

### Foreign key constraint errors

- Run migrations in the correct order (001 → 006)
- The `users` table must exist before other migrations

### Indexes not being created

- This is usually safe to ignore
- They may already exist from a previous run

## 🚀 Next Steps

After migrations are complete:

1. **Start your dev server**:

   ```bash
   npm run dev
   ```

2. **Login to admin dashboard**:
   - Go to `http://localhost:3000/auth/login`
   - Use your admin credentials or dev account

3. **Test database operations**:
   - Add a sermon
   - Create an event
   - Write a blog post
   - Record a donation

4. **Check Supabase Realtime** (optional):
   - Go to **Realtime** in Supabase
   - Subscribe to table changes for real-time updates in your app

## 📝 Notes

- All migrations use `IF NOT EXISTS` to prevent duplicate creation errors
- Proper foreign key relationships are established
- RLS policies protect data privacy and security
- Triggers ensure data consistency with automatic timestamps

---

**Ready to use your new database! 🎉**
