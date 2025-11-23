// Simplified version - creates users without custom IDs (avoids HTTP 500 errors)
// node create_auth_users_simple.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';

const SUPABASE_URL = 'https://kamllplbsvxwgguqitfe.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbWxscGxic3Z4d2dndXFpdGZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxMTc1NSwiZXhwIjoyMDc4Mjg3NzU1fQ.OK6DaZO61DnX5JG_68y5QTC6T10b4iHmTgkGT5al710';

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
      .on('end', () => resolve(profiles))
      .on('error', reject);
  });
}

async function createUser(profile) {
  try {
    // Use Supabase Admin API - simpler, no custom ID (avoids HTTP 500)
    const { data, error } = await supabase.auth.admin.createUser({
      email: profile.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: profile.full_name,
        role: profile.role
      }
    });

    if (error) {
      if (error.message && (error.message.includes('already') || error.message.includes('duplicate'))) {
        console.log(`⚠️  User already exists: ${profile.email}`);
        return { success: true, skipped: true };
      }
      throw error;
    }

    console.log(`✅ Created ${profile.email} with ID: ${data.user.id}`);
    if (data.user.id !== profile.id) {
      console.log(`   ⚠️  Note: Expected ID ${profile.id}, got ${data.user.id}`);
      console.log(`   You may need to update profiles.csv or database references`);
    }
    return { success: true, user: data.user };
  } catch (err) {
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
    process.exit(1);
  }

  console.log('🚀 Creating auth users (without custom IDs to avoid errors)...\n');
  
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const profile of profiles) {
    const result = await createUser(profile);
    
    if (result.success) {
      if (result.skipped) {
        skipped++;
      } else {
        created++;
      }
    } else {
      errors++;
    }
    
    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⚠️  Skipped (already exists): ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);

  if (created > 0 || skipped > 0) {
    console.log('\n✅ Users are ready! You can now login with:');
    console.log('   Email: user2@example.com');
    console.log(`   Password: ${PASSWORD}`);
    console.log('\n⚠️  Note: User IDs may differ from profiles.csv');
    console.log('   If you need matching IDs, you may need to update your database');
  }
}

createUsers().catch(console.error);










