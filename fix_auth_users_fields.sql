-- Fix all bulk-inserted users that are missing aud and role fields
-- Run this in Supabase SQL Editor

-- Step 1: Update auth.users to set required fields
UPDATE auth.users
SET 
    aud = 'authenticated',
    role = 'authenticated',
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email LIKE 'user%@example.com'
  AND (aud IS NULL OR aud != 'authenticated' OR role IS NULL OR role != 'authenticated');

-- Step 2: Verify the users are fixed
SELECT 
    email,
    aud,
    role,
    email_confirmed_at IS NOT NULL as email_confirmed,
    confirmed_at IS NOT NULL as confirmed,
    encrypted_password IS NOT NULL as has_password
FROM auth.users
WHERE email LIKE 'user%@example.com'
ORDER BY email;

-- Step 3: Ensure identities exist for all users (with provider_id)
INSERT INTO auth.identities (
    id, 
    user_id, 
    identity_data, 
    provider, 
    provider_id,
    last_sign_in_at, 
    created_at, 
    updated_at
)
SELECT 
    gen_random_uuid(),
    u.id,
    jsonb_build_object('sub', u.id::text, 'email', u.email),
    'email',
    u.email,  -- provider_id should be the email for email provider
    now(),
    now(),
    now()
FROM auth.users u
WHERE u.email LIKE 'user%@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM auth.identities i 
    WHERE i.user_id = u.id AND i.provider = 'email'
  );

-- Step 4: Final verification - check everything is correct
SELECT 
    u.email,
    u.aud,
    u.role,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    COUNT(i.id) as identity_count,
    CASE 
        WHEN u.aud = 'authenticated' 
         AND u.role = 'authenticated' 
         AND u.email_confirmed_at IS NOT NULL
         AND COUNT(i.id) > 0
        THEN '✅ Ready'
        ELSE '❌ Issues'
    END as status
FROM auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id AND i.provider = 'email'
WHERE u.email LIKE 'user%@example.com'
GROUP BY u.email, u.aud, u.role, u.email_confirmed_at
ORDER BY u.email;

-- Step 5: If any users still have NULL aud/role, show them
SELECT 
    email,
    id,
    aud,
    role,
    email_confirmed_at
FROM auth.users
WHERE email LIKE 'user%@example.com'
  AND (aud IS NULL OR role IS NULL OR aud != 'authenticated' OR role != 'authenticated');










