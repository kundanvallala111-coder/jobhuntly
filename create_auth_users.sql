-- SQL script to create auth users for sample data
-- Run this in Supabase SQL Editor BEFORE importing profiles.csv
-- This requires admin access to auth.users table

-- Note: This script creates users in auth.users table
-- You'll need to run this in Supabase SQL Editor with proper permissions

-- First, generate the profiles.csv file using the Python script
-- Then extract the IDs and emails from profiles.csv
-- Replace the UUIDs and emails below with the ones from your profiles.csv

-- Example: Creating 20 users (adjust based on your profiles.csv)
-- Format: INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
-- VALUES (uuid, email, crypt('password123', gen_salt('bf')), now(), now(), now(), jsonb_build_object('full_name', 'Name', 'role', 'candidate'));

-- IMPORTANT: 
-- 1. Generate profiles.csv first using: python generate_sample_data.py
-- 2. Copy the IDs and emails from profiles.csv
-- 3. Replace the placeholders below with actual values
-- 4. Run this script in Supabase SQL Editor
-- 5. Then import profiles.csv

-- Alternative: Use Supabase Admin API to create users programmatically
-- See create_auth_users.py for a Python script that does this

-- Example template (replace with actual data from profiles.csv):
/*
DO $$
DECLARE
    profile_record RECORD;
BEGIN
    -- Loop through profiles.csv data
    -- This is a template - you'll need to replace with actual UUIDs and emails
    FOR profile_record IN 
        SELECT id, email, full_name, role 
        FROM (VALUES
            ('uuid-1', 'user1@example.com', 'User 1', 'candidate'),
            ('uuid-2', 'user2@example.com', 'User 2', 'candidate')
            -- Add all 20 users here
        ) AS t(id, email, full_name, role)
    LOOP
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_user_meta_data,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            profile_record.id::uuid,
            '00000000-0000-0000-0000-000000000000'::uuid,
            profile_record.email,
            crypt('SamplePassword123!', gen_salt('bf')),
            now(),
            now(),
            now(),
            jsonb_build_object(
                'full_name', profile_record.full_name,
                'role', profile_record.role
            ),
            '',
            '',
            '',
            ''
        )
        ON CONFLICT (id) DO NOTHING;
    END LOOP;
END $$;
*/

-- Better approach: Use Supabase Admin API via Python script
-- See create_auth_users.py



