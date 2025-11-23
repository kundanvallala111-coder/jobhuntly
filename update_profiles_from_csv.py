#!/usr/bin/env python3
"""
Generate SQL UPDATE statements to update existing profiles with data from profiles.csv
Since the trigger automatically creates profiles, we need to UPDATE them, not INSERT

Usage:
1. Run: python update_profiles_from_csv.py
2. Copy the generated SQL and run it in Supabase SQL Editor
"""

import csv

def generate_update_sql():
    """Generate SQL UPDATE statements from profiles.csv"""
    try:
        with open('profiles.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            profiles = list(reader)
    except FileNotFoundError:
        print("Error: profiles.csv not found")
        print("   Run 'python generate_sample_data.py' first to generate it")
        return
    
    sql_statements = []
    sql_statements.append("-- SQL script to UPDATE existing profiles with data from profiles.csv")
    sql_statements.append("-- Since profiles are auto-created by trigger, we UPDATE them instead of INSERT")
    sql_statements.append("-- Run this in Supabase SQL Editor AFTER creating auth users")
    sql_statements.append("")
    
    for profile in profiles:
        user_id = profile['id']
        full_name = profile['full_name'].replace("'", "''")
        email = profile['email'].replace("'", "''")
        role = profile['role']
        avatar_url = profile.get('avatar_url', '').replace("'", "''") if profile.get('avatar_url') else 'NULL'
        phone = profile.get('phone', '').replace("'", "''") if profile.get('phone') else 'NULL'
        location = profile.get('location', '').replace("'", "''") if profile.get('location') else 'NULL'
        company_id = profile.get('company_id', '').replace("'", "''") if profile.get('company_id') else 'NULL'
        
        # Build UPDATE statement
        updates = []
        updates.append(f"full_name = '{full_name}'")
        updates.append(f"email = '{email}'")
        updates.append(f"role = '{role}'::app_role")
        
        if avatar_url != 'NULL':
            updates.append(f"avatar_url = '{avatar_url}'")
        else:
            updates.append("avatar_url = NULL")
            
        if phone != 'NULL':
            updates.append(f"phone = '{phone}'")
        else:
            updates.append("phone = NULL")
            
        if location != 'NULL':
            updates.append(f"location = '{location}'")
        else:
            updates.append("location = NULL")
            
        # Always set company_id to NULL in update - companies will be imported later
        # Users can manually link companies after importing companies.csv
        updates.append("company_id = NULL")
        
        updates_str = ',\n    '.join(updates)
        sql = f"""UPDATE public.profiles
SET
    {updates_str},
    updated_at = now()
WHERE id = '{user_id}'::uuid;"""
        
        sql_statements.append(sql)
        sql_statements.append("")
    
    # Write to file
    output_file = 'update_profiles_generated.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"Generated SQL file: {output_file}")
    print(f"Contains {len(profiles)} profile UPDATE statements")
    print(f"\nNext steps:")
    print(f"   1. Open Supabase Dashboard -> SQL Editor")
    print(f"   2. Copy and paste the contents of {output_file}")
    print(f"   3. Run the SQL script")
    print(f"   4. Then continue with other CSV imports (skip profiles.csv)")

if __name__ == "__main__":
    generate_update_sql()

