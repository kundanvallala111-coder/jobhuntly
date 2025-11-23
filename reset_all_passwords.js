// Reset passwords for all users from profiles.csv
// node reset_all_passwords.js

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

async function readProfiles() {
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

async function resetAllPasswords() {
  console.log('🔧 Resetting passwords for all users...\n');
  
  const profiles = await readProfiles();
  const { data: usersData } = await supabase.auth.admin.listUsers();
  const allUsers = usersData.users;
  
  let success = 0;
  let failed = 0;
  
  for (const profile of profiles) {
    const user = allUsers.find(u => u.email === profile.email);
    
    if (!user) {
      console.log(`⚠️  User not found: ${profile.email}`);
      failed++;
      continue;
    }
    
    try {
      const { error } = await supabase.auth.admin.updateUserById(user.id, {
        password: PASSWORD,
        email_confirm: true
      });
      
      if (error) {
        console.error(`❌ Failed to reset ${profile.email}:`, error.message);
        failed++;
      } else {
        console.log(`✅ Reset password for: ${profile.email}`);
        success++;
      }
    } catch (err) {
      console.error(`❌ Error with ${profile.email}:`, err.message);
      failed++;
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 Summary: ${success} successful, ${failed} failed`);
  console.log('\n✅ Try logging in with:');
  console.log('   Email: user2@example.com');
  console.log(`   Password: ${PASSWORD}`);
}

resetAllPasswords().catch(console.error);










