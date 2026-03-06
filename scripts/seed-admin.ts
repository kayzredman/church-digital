/**
 * Seed script for creating initial admin account
 * Run this after setting up Supabase to create the first admin user
 * 
 * Usage:
 *   npx ts-node scripts/seed-admin.ts
 * 
 * Or manually:
 * 1. Go to Supabase Dashboard > SQL Editor
 * 2. Run the database migration (001_create_users_table.sql)
 * 3. Run this seed script or manually insert admin record
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_ADMIN_EMAIL = 'admin@elimcity.com';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

async function seedAdmin() {
  try {
    console.log('🌱 Starting admin account seeding...\n');

    // 1. Create admin user via Auth
    console.log(`Creating admin user: ${DEFAULT_ADMIN_EMAIL}`);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      if (authError.message.includes('already exists')) {
        console.log('ℹ️  Admin user already exists, skipping auth creation');
      } else {
        throw authError;
      }
    } else {
      console.log(`✓ Admin user created: ${authData?.user?.id}`);
    }

    // 2. Check if user record exists in users table
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', DEFAULT_ADMIN_EMAIL)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingUser) {
      console.log('ℹ️  Admin user record already exists in users table');
    } else {
      // 3. Insert user record with admin role
      if (authData?.user?.id) {
        console.log(`Creating admin user record...`);
        const { error: insertError } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            email: DEFAULT_ADMIN_EMAIL,
            role: 'admin',
          },
        ]);

        if (insertError) throw insertError;
        console.log('✓ Admin user record created with admin role');
      }
    }

    console.log('\n✅ Admin account seeding completed!');
    console.log('\n📝 Admin Credentials:');
    console.log(`   Email: ${DEFAULT_ADMIN_EMAIL}`);
    console.log(`   Password: ${DEFAULT_ADMIN_PASSWORD}`);
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
  } catch (error) {
    console.error('❌ Error seeding admin account:', error);
    process.exit(1);
  }
}

seedAdmin();
