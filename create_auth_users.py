#!/usr/bin/env python3
"""
Create auth users in Supabase for sample data
This script uses Supabase Admin API to create users that match profiles.csv

Requirements:
- supabase-py: pip install supabase
- Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables

Usage:
1. Generate profiles.csv: python generate_sample_data.py
2. Set environment variables:
   export SUPABASE_URL="your-project-url"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
3. Run this script: python create_auth_users.py
"""

import csv
import os
import sys
import json

# Try to load .env file if python-dotenv is available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv not installed, continue without it

# Try to use supabase client, but fallback to requests if needed
try:
    from supabase import create_client, Client
    USE_SUPABASE_CLIENT = True
except ImportError:
    USE_SUPABASE_CLIENT = False
    try:
        import requests
    except ImportError:
        print("❌ Error: Need either 'supabase' or 'requests' package")
        print("   Install with: pip install supabase")
        print("   Or: pip install requests")
        sys.exit(1)

# Get Supabase credentials from environment
# Try multiple possible variable names
SUPABASE_URL = (
    os.getenv("VITE_SUPABASE_URL") or 
    os.getenv("SUPABASE_URL") or
    os.getenv("NEXT_PUBLIC_SUPABASE_URL")
)

# IMPORTANT: Service Role Key is different from Publishable Key!
# Service Role Key is needed for admin operations like creating users
SUPABASE_SERVICE_ROLE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY") or
    os.getenv("SUPABASE_SERVICE_KEY")
)

if not SUPABASE_URL:
    print("❌ Error: SUPABASE_URL not found")
    print("\nSet it in your .env file or environment:")
    print("  VITE_SUPABASE_URL='https://your-project.supabase.co'")
    print("\nOr export it:")
    print("  export VITE_SUPABASE_URL='https://your-project.supabase.co'")
    sys.exit(1)

if not SUPABASE_SERVICE_ROLE_KEY:
    print("❌ Error: SUPABASE_SERVICE_ROLE_KEY not found")
    print("\n⚠️  IMPORTANT: You need the SERVICE ROLE KEY (not publishable key)!")
    print("\nTo get your Service Role Key:")
    print("  1. Go to Supabase Dashboard")
    print("  2. Settings → API")
    print("  3. Find 'service_role' key (it's a SECRET key, starts with 'eyJ...')")
    print("  4. Copy it and add to your .env file:")
    print("     SUPABASE_SERVICE_ROLE_KEY='your-service-role-key-here'")
    print("\nOr export it:")
    print("  export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'")
    print("\n⚠️  WARNING: Never commit the service role key to git!")
    sys.exit(1)

def read_profiles_csv():
    """Read profiles from CSV file"""
    profiles = []
    try:
        with open('profiles.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                profiles.append({
                    'id': row['id'],
                    'email': row['email'],
                    'full_name': row['full_name'],
                    'role': row['role']
                })
    except FileNotFoundError:
        print("❌ Error: profiles.csv not found")
        print("   Run 'python generate_sample_data.py' first to generate it")
        sys.exit(1)
    return profiles

def create_user_via_api(profile, supabase_url, service_role_key):
    """Create user via direct HTTP API call (more reliable)"""
    import requests
    
    url = f"{supabase_url}/auth/v1/admin/users"
    
    headers = {
        "apikey": service_role_key,
        "Authorization": f"Bearer {service_role_key}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "email": profile['email'],
        "password": "SamplePassword123!",
        "email_confirm": True,
        "user_metadata": {
            "full_name": profile['full_name'],
            "role": profile['role']
        }
    }
    
    # Try with ID first
    try:
        payload_with_id = {**payload, "id": profile['id']}
        response = requests.post(url, headers=headers, json=payload_with_id, timeout=10)
        if response.status_code in [200, 201]:
            return response
        # If 422, try without ID
        if response.status_code == 422:
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            return response
        return response
    except requests.exceptions.RequestException as e:
        class MockResponse:
            def __init__(self):
                self.status_code = 500
                self.text = f"Network error: {str(e)}"
        return MockResponse()

def create_auth_users():
    """Create auth users in Supabase"""
    profiles = read_profiles_csv()
    print(f"📋 Found {len(profiles)} profiles in profiles.csv")
    print("🚀 Creating auth users...\n")
    print(f"🔗 Using Supabase URL: {SUPABASE_URL[:30]}...")
    print(f"🔑 Service Role Key: {SUPABASE_SERVICE_ROLE_KEY[:20]}...\n")
    
    created = 0
    skipped = 0
    errors = 0
    
    # Always use direct API calls (more reliable)
    import requests
    print("📡 Using direct HTTP API calls to Supabase Admin API...\n")
    
    # Test the connection first
    print("🔍 Testing service role key...")
    test_url = f"{SUPABASE_URL}/auth/v1/admin/users?limit=1"
    test_headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    }
    try:
        test_response = requests.get(test_url, headers=test_headers, timeout=5)
        print(f"   Test response: {test_response.status_code}")
        if test_response.status_code == 200:
            print("✅ Service role key is valid and has admin access\n")
        elif test_response.status_code == 401 or test_response.status_code == 403:
            print("❌ ERROR: Service role key is invalid or doesn't have admin permissions")
            print("\n🔍 Debugging info:")
            print(f"   URL: {test_url}")
            print(f"   Key length: {len(SUPABASE_SERVICE_ROLE_KEY)} characters")
            print(f"   Key starts with: {SUPABASE_SERVICE_ROLE_KEY[:30]}...")
            print("\n💡 Please verify:")
            print("   1. You're using SERVICE_ROLE_SECRET (not anon or publishable key)")
            print("   2. From: Supabase Dashboard → Settings → API → service_role (secret)")
            print("   3. The key is the FULL secret (usually 200+ characters)")
            print("\n⚠️  If this persists, use the SQL alternative (see create_auth_users.sql)")
            sys.exit(1)
        else:
            print(f"⚠️  Warning: Test request returned {test_response.status_code}")
            if test_response.text:
                print(f"   Response: {test_response.text[:200]}")
            print("   Continuing anyway...\n")
    except Exception as e:
        print(f"⚠️  Could not test connection: {e}")
        print("   Continuing anyway...\n")
    
    for i, profile in enumerate(profiles, 1):
        try:
            response = create_user_via_api(profile, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
            
            if response.status_code == 200 or response.status_code == 201:
                created += 1
                print(f"✅ [{i}/{len(profiles)}] Created user: {profile['email']}")
            elif response.status_code == 422:
                # User already exists or validation error
                try:
                    error_data = response.json() if response.text else {}
                    error_str = json.dumps(error_data) if isinstance(error_data, dict) else str(error_data)
                    if "already" in error_str.lower() or "duplicate" in error_str.lower():
                        skipped += 1
                        print(f"⚠️  [{i}/{len(profiles)}] User already exists: {profile['email']}")
                    else:
                        errors += 1
                        print(f"❌ [{i}/{len(profiles)}] Validation error: {error_str[:150]}")
                except:
                    errors += 1
                    print(f"❌ [{i}/{len(profiles)}] Validation error (422): {response.text[:150]}")
            elif response.status_code == 401 or response.status_code == 403:
                errors += 1
                print(f"❌ [{i}/{len(profiles)}] Permission denied ({response.status_code})")
                print(f"   ⚠️  Check your SERVICE_ROLE_SECRET key is correct")
                if i == 1:  # Only show this once
                    print(f"   URL: {SUPABASE_URL}/auth/v1/admin/users")
                    print(f"   Key starts with: {SUPABASE_SERVICE_ROLE_KEY[:20]}...")
            else:
                errors += 1
                error_msg = response.text[:200] if hasattr(response, 'text') and response.text else f"HTTP {response.status_code}"
                print(f"❌ [{i}/{len(profiles)}] Error ({response.status_code}): {error_msg}")
                
        except Exception as e:
            errors += 1
            print(f"❌ [{i}/{len(profiles)}] Exception: {str(e)}")
    
    print(f"\n📊 Summary:")
    print(f"   ✅ Created: {created}")
    print(f"   ⚠️  Skipped (already exists): {skipped}")
    print(f"   ❌ Errors: {errors}")
    
    if created > 0:
        print(f"\n✅ Successfully created {created} auth users!")
        print("💡 Now you can import profiles.csv to Supabase")
        print("💡 Default password for all users: SamplePassword123!")
    elif skipped > 0 and errors == 0:
        print(f"\n⚠️  All users already exist. You can proceed to import profiles.csv")
    elif errors > 0:
        print(f"\n❌ Failed to create users. {errors} errors occurred.")
        print("\n🔍 Troubleshooting:")
        print("   1. Verify you're using SERVICE_ROLE_KEY (not publishable key)")
        print("   2. Check Supabase Dashboard → Settings → API → service_role key")
        print("   3. Ensure the key starts with 'eyJ' and is the full secret key")
        print("   4. Check if your Supabase project has user creation restrictions")
        print("   5. Try creating one user manually in Supabase Dashboard to test")
        print("\n💡 Alternative: Use SQL script (create_auth_users.sql) with admin access")

if __name__ == "__main__":
    create_auth_users()

