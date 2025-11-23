#!/usr/bin/env python3
"""
Generate SQL script to create auth users from profiles.csv
This creates a SQL file that can be run directly in Supabase SQL Editor

Usage:
1. Generate profiles.csv: python generate_sample_data.py
2. Run this script: python generate_auth_users_sql.py
3. Copy the output SQL and run it in Supabase SQL Editor
"""

import csv
import uuid

def generate_sql_from_csv():
    """Generate SQL INSERT statements from profiles.csv"""
    try:
        with open('profiles.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            profiles = list(reader)
    except FileNotFoundError:
        print("Error: profiles.csv not found")
        print("   Run 'python generate_sample_data.py' first to generate it")
        return
    
    sql_statements = []
    sql_statements.append("-- SQL script to create auth users for sample data")
    sql_statements.append("-- Generated from profiles.csv")
    sql_statements.append("-- Run this in Supabase SQL Editor")
    sql_statements.append("")
    sql_statements.append("-- IMPORTANT: This must be run as a Supabase admin")
    sql_statements.append("-- Password for all users: SamplePassword123!")
    sql_statements.append("")
    
    for i, profile in enumerate(profiles, 1):
        user_id = profile['id']
        email = profile['email']
        full_name = profile['full_name']
        role = profile['role']
        
        # Escape single quotes in strings
        email_escaped = email.replace("'", "''")
        full_name_escaped = full_name.replace("'", "''")
        
        # Generate SQL INSERT statement for auth.users
        # Note: confirmed_at is a generated column, so we don't include it
        sql = f"""-- User {i}
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '{user_id}'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    '{email_escaped}',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{{"full_name": "{full_name_escaped}", "role": "{role}"}}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

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
    '{user_id}'::uuid,
    jsonb_build_object('sub', '{user_id}'::text, 'email', '{email_escaped}'),
    'email',
    '{email_escaped}',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '{user_id}'::uuid AND provider = 'email'
);"""
        
        sql_statements.append(sql)
        sql_statements.append("")
    
    # Write to file
    output_file = 'create_auth_users_generated.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"Generated SQL file: {output_file}")
    print(f"Contains {len(profiles)} user INSERT statements")
    print(f"\nNext steps:")
    print(f"   1. Open Supabase Dashboard -> SQL Editor")
    print(f"   2. Copy and paste the contents of {output_file}")
    print(f"   3. Run the SQL script")
    print(f"   4. Then import profiles.csv and other CSV files")

if __name__ == "__main__":
    generate_sql_from_csv()

