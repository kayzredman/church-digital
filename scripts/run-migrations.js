#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Missing DATABASE_URL in .env.local');
  process.exit(1);
}

const migrationDir = path.join(__dirname, '../database/migrations');

async function runMigrations() {
  // Parse DATABASE_URL manually to handle special chars in password
  const dbMatch = databaseUrl.match(/postgresql:\/\/([^:]+):(.+)@([^:]+):(\d+)\/(.+)/);
  if (!dbMatch) {
    console.error('❌ Invalid DATABASE_URL format');
    process.exit(1);
  }

  const client = new Client({
    user: dbMatch[1],
    password: dbMatch[2],
    host: dbMatch[3],
    port: parseInt(dbMatch[4]),
    database: dbMatch[5],
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🚀 Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ Connected!\n');

    const files = fs.readdirSync(migrationDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('⚠️  No migration files found');
      return;
    }

    console.log(`Found ${files.length} migration files\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      const filePath = path.join(migrationDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      console.log(`📄 Running: ${file}...`);

      try {
        await client.query(sql);
        console.log(`   ✅ Success\n`);
        successCount++;
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`   ✅ Already exists (skipped)\n`);
          successCount++;
        } else {
          console.log(`   ❌ Error: ${err.message}\n`);
          errorCount++;
        }
      }
    }

    console.log('='.repeat(50));
    console.log(`✨ Migration complete! ${successCount} succeeded, ${errorCount} failed\n`);

    // Verify tables
    console.log('📋 Verifying tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\n📊 Tables in your database:');
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    console.log();

  } catch (err) {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from database');
  }
}

runMigrations();


