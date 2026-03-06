#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const projectId = supabaseUrl ? supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1] : null;

if (!supabaseUrl || !serviceRoleKey || !projectId) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const migrationDir = path.join(__dirname, '../database/migrations');

function executeSQLViaAPI(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql });

    const options = {
      hostname: `${projectId}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Prefer': 'return=minimal',
      }
    };

    // Use the Supabase Management API for SQL execution
    const mgmtOptions = {
      hostname: 'api.supabase.com',
      port: 443,
      path: `/v1/projects/${projectId}/database/query`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
      }
    };

    const req = https.request(mgmtOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          // Try alternate approach if management API fails
          resolve({ success: false, status: res.statusCode, data });
        }
      });
    });

    req.on('error', (err) => resolve({ success: false, error: err.message }));
    req.write(JSON.stringify({ query: sql }));
    req.end();
  });
}

function executeSQLViaPostgREST(sql) {
  return new Promise((resolve, reject) => {
    // Use pg_dump style via PostgREST
    const postData = sql;

    const options = {
      hostname: `${projectId}.supabase.co`,
      port: 443,
      path: '/pg/query',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          resolve({ success: false, status: res.statusCode, data });
        }
      });
    });

    req.on('error', (err) => resolve({ success: false, error: err.message }));
    req.write(postData);
    req.end();
  });
}

async function runMigrations() {
  console.log('🚀 Starting Supabase database migrations...');
  console.log(`📦 Project: ${projectId}`);
  console.log(`🔗 URL: ${supabaseUrl}\n`);

  const files = fs.readdirSync(migrationDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('⚠️  No migration files found');
    return;
  }

  console.log(`Found ${files.length} migration files\n`);

  for (const file of files) {
    const filePath = path.join(migrationDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    console.log(`📄 Running: ${file}...`);
    
    // Try Management API first
    let result = await executeSQLViaAPI(sql);
    
    if (!result.success) {
      // Try PostgREST fallback
      result = await executeSQLViaPostgREST(sql);
    }

    if (result.success) {
      console.log(`   ✅ Success\n`);
    } else {
      console.log(`   ⚠️  API returned: ${result.status || 'error'}`);
      if (result.data) {
        try {
          const parsed = JSON.parse(result.data);
          console.log(`   Message: ${parsed.message || parsed.error || result.data}`);
        } catch {
          console.log(`   Response: ${result.data.substring(0, 200)}`);
        }
      }
      console.log();
    }
  }

  console.log('✨ Migration process complete!\n');
  console.log('📋 Next steps:');
  console.log('   1. Verify tables in Supabase Dashboard → Table Editor');
  console.log('   2. You should see: users, sermons, events, blog_posts, donations, event_attendees');
}

runMigrations();


