// Run this script with Node.js to create users properly
// npm install @supabase/supabase-js csv-parser
// Requires Node.js 18+ (for native fetch support)

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';

// Node.js 18+ has native fetch, so we can use it directly
if (typeof fetch === 'undefined') {
  console.error('❌ Error: fetch is not available. Please use Node.js 18+');
  console.error('   Or install node-fetch: npm install node-fetch');
  process.exit(1);
}

// Replace with your actual values
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://kamllplbsvxwgguqitfe.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbWxscGxic3Z4d2dndXFpdGZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxMTc1NSwiZXhwIjoyMDc4Mjg3NzU1fQ.OK6DaZO61DnX5JG_68y5QTC6T10b4iHmTgkGT5al710';

// Validate that Supabase credentials are set
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || 
    SUPABASE_URL.includes('your-project') || 
    SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role-key')) {
  console.error('❌ Error: Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Either set environment variables or edit this file');
  console.error('\n   Example:');
  console.error('   export SUPABASE_URL="https://your-project.supabase.co"');
  console.error('   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  console.error('   node create_auth_users.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const PASSWORD = 'SamplePassword123!';

async function readProfilesFromCSV() {
  return new Promise((resolve, reject) => {
    const profiles = [];
    fs.createReadStream('profiles.csv')
      .pipe(csv())
      .on('data', (row) => {
        profiles.push({
          id: row.id,
          email: row.email,
          full_name: row.full_name,
          role: row.role
        });
      })
      .on('end', () => {
        resolve(profiles);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function createUser(profile, retryCount = 0) {
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds
  
  try {
    // Use direct REST API call to create user with specific ID
    // This requires the service role key and allows setting custom IDs
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: profile.id,
        email: profile.email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: profile.full_name,
          role: profile.role
        }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      // Check if user already exists
      if (response.status === 422 || (result.error && (result.error.includes('already') || result.error.includes('duplicate')))) {
        console.log(`⚠️  User already exists: ${profile.email}`);
        return { success: true, skipped: true, user: null };
      }
      
      // Retry on 500 errors (server errors)
      if (response.status === 500 && retryCount < maxRetries) {
        console.log(`⚠️  Server error (HTTP 500) for ${profile.email}, retrying in ${retryDelay/1000}s... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return createUser(profile, retryCount + 1);
      }
      
      // Show detailed error
      const errorMsg = result.error || result.message || `HTTP ${response.status}`;
      console.error(`❌ Error creating ${profile.email}: ${errorMsg}`);
      if (result.error_description) {
        console.error(`   Details: ${result.error_description}`);
      }
      return { success: false, error: new Error(errorMsg) };
    }

    if (result.id === profile.id) {
      console.log(`✅ Created ${profile.email} with ID: ${result.id}`);
      return { success: true, user: result };
    } else {
      console.log(`✅ Created ${profile.email} with ID: ${result.id} (expected: ${profile.id})`);
      return { success: true, user: result, idMismatch: true };
    }
  } catch (err) {
    // Retry on network errors
    if (retryCount < maxRetries && (err.message.includes('fetch') || err.message.includes('network'))) {
      console.log(`⚠️  Network error for ${profile.email}, retrying in ${retryDelay/1000}s... (${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return createUser(profile, retryCount + 1);
    }
    
    console.error(`❌ Error creating ${profile.email}:`, err.message);
    return { success: false, error: err };
  }
}

async function createUsers() {
  console.log('📋 Reading profiles from profiles.csv...\n');
  
  let profiles;
  try {
    profiles = await readProfilesFromCSV();
    console.log(`Found ${profiles.length} profiles to create\n`);
  } catch (error) {
    console.error('❌ Error reading profiles.csv:', error.message);
    console.error('   Make sure profiles.csv exists in the current directory');
    process.exit(1);
  }

  console.log('🚀 Creating auth users...\n');
  
  let created = 0;
  let skipped = 0;
  let errors = 0;
  let idMismatches = 0;

  for (const profile of profiles) {
    const result = await createUser(profile);
    
    if (result.success) {
      if (result.skipped) {
        skipped++;
      } else {
        created++;
        if (result.idMismatch) {
          idMismatches++;
        }
      }
    } else {
      errors++;
    }
    
    // Longer delay to avoid rate limiting (HTTP 500 errors)
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⚠️  Skipped (already exists): ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  if (idMismatches > 0) {
    console.log(`   ⚠️  ID Mismatches: ${idMismatches} (see warnings above)`);
  }

  if (created > 0 || skipped > 0) {
    console.log('\n✅ Users are ready! You can now login with:');
    console.log('   Email: user2@example.com');
    console.log('   Password: SamplePassword123!');
  }
}

// Run the script
createUsers().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

