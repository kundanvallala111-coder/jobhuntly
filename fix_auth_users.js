// Quick fix script to reset passwords or recreate users
// node fix_auth_users.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kamllplbsvxwgguqitfe.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbWxscGxic3Z4d2dndXFpdGZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxMTc1NSwiZXhwIjoyMDc4Mjg3NzU1fQ.OK6DaZO61DnX5JG_68y5QTC6T10b4iHmTgkGT5al710';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const PASSWORD = 'SamplePassword123!';
const TEST_EMAIL = 'user2@example.com';

async function checkUser(email) {
  console.log(`\n🔍 Checking user: ${email}`);
  
  try {
    // Check if user exists via admin API
    const { data: usersData, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Error listing users:', error.message);
      console.error('   Full error:', JSON.stringify(error, null, 2));
      return null;
    }
    
    if (!usersData || !usersData.users) {
      console.error('❌ No users data returned');
      return null;
    }
    
    console.log(`\n📊 Found ${usersData.users.length} total users in auth.users`);
    console.log('   First few users:');
    usersData.users.slice(0, 5).forEach(u => {
      console.log(`   - ${u.email} (ID: ${u.id})`);
    });
    
    // Try exact match first
    let user = usersData.users.find(u => u.email === email);
    
    // Try case-insensitive match
    if (!user) {
      user = usersData.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    }
    
    if (user) {
      console.log(`\n✅ User found:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   Created: ${user.created_at}`);
      return user;
    } else {
      console.log(`\n❌ User not found in auth.users`);
      console.log(`   Searched for: ${email}`);
      console.log(`   Available emails: ${usersData.users.map(u => u.email).join(', ')}`);
      return null;
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('   Stack:', err.stack);
    return null;
  }
}

async function resetPassword(email) {
  console.log(`\n🔧 Resetting password for: ${email}`);
  
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(
      // We need to find the user ID first
      await findUserIdByEmail(email),
      {
        password: PASSWORD,
        email_confirm: true
      }
    );
    
    if (error) {
      console.error('❌ Error resetting password:', error.message);
      return false;
    }
    
    console.log('✅ Password reset successfully!');
    return true;
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function findUserIdByEmail(email) {
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users.users.find(u => u.email === email);
  return user?.id;
}

async function deleteAndRecreateUser(email, userId, fullName, role) {
  console.log(`\n🗑️  Deleting user: ${email}`);
  
  try {
    // Delete user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error('❌ Error deleting user:', deleteError.message);
      return false;
    }
    
    console.log('✅ User deleted');
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Recreate user
    console.log(`\n➕ Recreating user: ${email}`);
    
    const { data, error } = await supabase.auth.admin.createUser({
      id: userId,
      email: email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: role
      }
    });
    
    if (error) {
      console.error('❌ Error creating user:', error.message);
      return false;
    }
    
    console.log('✅ User recreated successfully!');
    return true;
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function quickFix() {
  console.log('🚀 Quick Fix for Auth Users\n');
  console.log('='.repeat(50));
  
  // First, verify we can access the API
  console.log('\n🔐 Testing API access...');
  try {
    const { data: testData, error: testError } = await supabase.auth.admin.listUsers();
    if (testError) {
      console.error('❌ Cannot access Supabase Admin API:', testError.message);
      console.error('   Check your SERVICE_ROLE_KEY is correct');
      return;
    }
    console.log(`✅ API access OK (found ${testData.users.length} users)`);
  } catch (err) {
    console.error('❌ API test failed:', err.message);
    return;
  }
  
  // Check if user exists
  const user = await checkUser(TEST_EMAIL);
  
  if (!user) {
    console.log('\n⚠️  User not found in auth.users table.');
    console.log('   This could mean:');
    console.log('   1. User exists in public.profiles but not in auth.users');
    console.log('   2. Email address is different');
    console.log('   3. User was never created in auth system');
    console.log('\n   Try running: node create_auth_users.js');
    return;
  }
  
  // Try to reset password first (easier)
  console.log('\n📝 Attempting to reset password...');
  const userId = await findUserIdByEmail(TEST_EMAIL);
  
  if (userId) {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: PASSWORD,
        email_confirm: true
      });
      
      if (error) {
        console.error('❌ Password reset failed:', error.message);
        console.log('\n🔄 Trying delete and recreate...');
        
        // Delete and recreate
        await deleteAndRecreateUser(
          TEST_EMAIL,
          userId,
          'User 2',
          'candidate'
        );
      } else {
        console.log('✅ Password reset successful!');
      }
    } catch (err) {
      console.error('❌ Error:', err.message);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('\n✅ Fix complete! Try logging in with:');
  console.log(`   Email: ${TEST_EMAIL}`);
  console.log(`   Password: ${PASSWORD}`);
}

// Run the fix
quickFix().catch(console.error);

