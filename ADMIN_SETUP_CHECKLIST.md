# Admin Setup Checklist

Complete this checklist to get your Admin CMS Dashboard up and running.

## ✅ Phase 1: Development Setup (5 minutes)

- [ ] Server is running: `npm run dev`
- [ ] Development mode enabled in `.env.local`:
  ```
  NEXT_PUBLIC_DEV_MODE=true
  ```
- [ ] Go to `http://localhost:3000/auth/signup`
- [ ] Create any test account (auto-gets admin role)
- [ ] Go to `http://localhost:3000/admin` ← Admin Dashboard access!
- [ ] Test accessing all admin pages

## ✅ Phase 2: Database Setup (10 minutes)

- [ ] Open [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] Select your project
- [ ] Go to **SQL Editor** → **New Query**
- [ ] Open `database/migrations/001_create_users_table.sql`
- [ ] Copy the entire SQL and paste into Supabase SQL Editor
- [ ] Click **Run** (Cmd/Ctrl+Enter)
- [ ] Verify `users` table appears in **Table Editor**

## ✅ Phase 3: Production Admin Account (Optional - For Later)

- [ ] Get `SUPABASE_SERVICE_ROLE_KEY` from Supabase settings
- [ ] Add to `.env.local`:
  ```
  SUPABASE_SERVICE_ROLE_KEY=your_key_here
  ```
- [ ] Run seed script:
  ```bash
  npx ts-node scripts/seed-admin.ts
  ```
- [ ] Default admin created:
  - Email: `admin@elimcity.com`
  - Password: `admin123`
- [ ] ⚠️ Change password after first login!

## ✅ Phase 4: Configuration (As Needed)

### API Keys

- [ ] Stripe keys → `/admin/settings`
- [ ] Paystack keys → `/admin/settings`
- [ ] Cloudinary keys → `/admin/settings`
- [ ] Email settings → `/admin/settings`

### Church Info

- [ ] Update church name → `/admin/settings`
- [ ] Update church email → `/admin/settings`
- [ ] Update church phone → `/admin/settings`
- [ ] Update church address → `/admin/settings`

### Features

- [ ] Enable/disable donations → `/admin/settings`
- [ ] Enable/disable events → `/admin/settings`
- [ ] Enable/disable blog → `/admin/settings`
- [ ] Configure maintenance mode → `/admin/settings`

## ✅ Phase 5: Test All Features

### Sermons

- [ ] Go to `/admin/sermons`
- [ ] Add test sermon
- [ ] Edit sermon
- [ ] Delete sermon

### Events

- [ ] Go to `/admin/events`
- [ ] Create test event
- [ ] Edit event
- [ ] View attendance tracking

### Blog

- [ ] Go to `/admin/blog`
- [ ] Write test post
- [ ] Select category
- [ ] Publish post
- [ ] Edit post

### Users

- [ ] Go to `/admin/users`
- [ ] View user list
- [ ] Create another admin user:
  - [ ] User must signup first
  - [ ] Edit user role to "admin"
  - [ ] Verify can access admin panel

### Donations

- [ ] Go to `/admin/giving`
- [ ] View donation stats
- [ ] Check payment methods
- [ ] Review analytics

## ✅ Phase 6: Production Preparation

- [ ] Test build: `npm run build`
- [ ] Disable dev mode in production `.env`:
  ```
  NEXT_PUBLIC_DEV_MODE=false
  ```
- [ ] Set all production Supabase variables
- [ ] Set all production API keys
- [ ] Create production admin account using seed script
- [ ] Change default admin password
- [ ] Test complete workflow in production environment
- [ ] Set up backup/recovery procedures
- [ ] Document admin access for your team

## 📋 Quick Reference

**Admin URL**: `http://localhost:3000/admin`

**Database Migration**:

- File: `database/migrations/001_create_users_table.sql`
- Location: Supabase SQL Editor
- Frequency: Run once on new project

**Seed Script**:

- File: `scripts/seed-admin.ts`
- Usage: `npx ts-node scripts/seed-admin.ts`
- Creates: `admin@elimcity.com` / `admin123`

**Environment Variables**:

- File: `.env.local`
- Dev flag: `NEXT_PUBLIC_DEV_MODE=true`
- Prod flag: `NEXT_PUBLIC_DEV_MODE=false`

## 🆘 Troubleshooting

**Can't access admin dashboard?**

1. Check if logged in at `/auth/login`
2. Verify user role in Supabase users table
3. Ensure dev mode is `true` if testing locally
4. Clear cache and cookies

**Database migration failed?**

1. Check Supabase SQL Editor for error messages
2. Verify user has correct permissions
3. Run SQL statements one at a time if needed
4. Check if `users` table already exists

**Seed script error?**

1. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
2. Check database migration already ran
3. Ensure network connection to Supabase
4. Check for typos in environment variables

## 📚 Documentation

- [Full Admin Setup Guide](./ADMIN_SETUP.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

**All done? You're ready to start managing your church content! 🎉**
