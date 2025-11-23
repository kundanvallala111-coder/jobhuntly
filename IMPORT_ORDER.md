# Supabase Import Order Guide

## Complete Step-by-Step Import Process

### STEP 1: Create Auth Users (REQUIRED FIRST)

**Option A: Using Generated SQL (Recommended)**
1. Run: `python generate_auth_users_sql.py`
2. This creates: `create_auth_users_generated.sql`
3. Open Supabase Dashboard → SQL Editor
4. Copy and paste the entire contents of `create_auth_users_generated.sql`
5. Click "Run" to execute

**Option B: Using Python Script**
1. Set environment variables:
   ```bash
   export SUPABASE_URL='your-project-url'
   export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'
   ```
2. Run: `python create_auth_users.py`

**After creating auth users, proceed to CSV imports below.**

---

### STEP 2: Update Profiles (AUTO-CREATED by trigger)

**⚠️ IMPORTANT:** Profiles are automatically created by the `on_auth_user_created` trigger when you create auth users!

**Action:** Run `update_profiles_generated.sql` in SQL Editor
- This updates existing profiles with full data (avatar_url, phone, location, company_id, etc.)
- The trigger only creates basic profiles (id, email, name, role)
- **DO NOT import profiles.csv** - it will cause duplicate key errors!

**To generate update SQL:**
```bash
python update_profiles_from_csv.py
```

**Then:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `update_profiles_generated.sql`
3. Run the SQL script

---

### STEP 3: Import CSV Files (In This Exact Order)

#### 1. **companies.csv** ✅ No dependencies
   - **Why second?** Jobs and profiles can reference companies
   - **Import method:** Table Editor → companies → Import CSV

#### 2. **jobs.csv** ⚠️ REQUIRES: profiles (updated in Step 2)
   - **Why third?** Applications reference jobs
   - **Foreign keys:** 
     - `posted_by` → `profiles(id)`
     - `company_id` → `companies(id)` (optional)
   - **Import method:** Table Editor → jobs → Import CSV

#### 3. **candidate_profiles.csv** ⚠️ REQUIRES: profiles (updated in Step 2)
   - **Why fourth?** Candidate data references profiles
   - **Foreign key:** `user_id` → `profiles(id)`
   - **Import method:** Table Editor → candidate_profiles → Import CSV

#### 4. **candidate_experiences.csv** ⚠️ REQUIRES: candidate_profiles.csv
   - **Foreign key:** `candidate_id` → `candidate_profiles(user_id)`
   - **Import method:** Table Editor → candidate_experiences → Import CSV

#### 5. **candidate_education.csv** ⚠️ REQUIRES: candidate_profiles.csv
   - **Foreign key:** `candidate_id` → `candidate_profiles(user_id)`
   - **Import method:** Table Editor → candidate_education → Import CSV

#### 6. **candidate_portfolio_projects.csv** ⚠️ REQUIRES: candidate_profiles.csv
   - **Foreign key:** `candidate_id` → `candidate_profiles(user_id)`
   - **Import method:** Table Editor → candidate_portfolio_projects → Import CSV

#### 7. **applications.csv** ⚠️ REQUIRES: jobs.csv + profiles
   - **Why eighth?** Needs both jobs and candidate profiles
   - **Foreign keys:**
     - `job_id` → `jobs(id)`
     - `candidate_id` → `profiles(id)`
   - **Import method:** Table Editor → applications → Import CSV

#### 8. **notifications.csv** ⚠️ REQUIRES: profiles
   - **Foreign key:** `user_id` → `profiles(id)`
   - **Import method:** Table Editor → notifications → Import CSV

#### 9. **user_roles.csv** ⚠️ REQUIRES: auth.users (from Step 1)
   - **Note:** May also be auto-created by trigger, check if exists first
   - **Foreign key:** `user_id` → `auth.users(id)`
   - **Import method:** Table Editor → user_roles → Import CSV

---

## Visual Dependency Tree

```
auth.users (Step 1 - SQL)
    ↓
profiles.csv (Step 2)
    ├──→ candidate_profiles.csv (Step 4)
    │       ├──→ candidate_experiences.csv (Step 5)
    │       ├──→ candidate_education.csv (Step 6)
    │       └──→ candidate_portfolio_projects.csv (Step 7)
    │
    ├──→ jobs.csv (Step 3)
    │       └──→ applications.csv (Step 8)
    │
    ├──→ applications.csv (Step 8)
    ├──→ notifications.csv (Step 9)
    └──→ user_roles.csv (Step 10)

companies.csv (Step 2)
    └──→ jobs.csv (Step 3) [optional]
```

---

## Quick Checklist

- [ ] Step 1: Create auth users (SQL or Python script)
- [ ] Step 2: Import `profiles.csv`
- [ ] Step 3: Import `companies.csv`
- [ ] Step 4: Import `jobs.csv`
- [ ] Step 5: Import `candidate_profiles.csv`
- [ ] Step 6: Import `candidate_experiences.csv`
- [ ] Step 7: Import `candidate_education.csv`
- [ ] Step 8: Import `candidate_portfolio_projects.csv`
- [ ] Step 9: Import `applications.csv`
- [ ] Step 10: Import `notifications.csv`
- [ ] Step 11: Import `user_roles.csv`

---

## Troubleshooting

### Error: "violates foreign key constraint"
- **Cause:** Importing a table before its dependencies
- **Fix:** Check the import order above and ensure parent tables are imported first

### Error: "Key (id)=... is not present in table"
- **Cause:** Referenced ID doesn't exist in parent table
- **Fix:** 
  1. Verify parent table was imported successfully
  2. Check that IDs match between CSV files
  3. Regenerate CSV files if IDs don't match

### Error: "duplicate key value violates unique constraint"
- **Cause:** Trying to import data that already exists
- **Fix:** Clear existing data from the table first, or skip duplicates

---

## Notes

- **Default password** for all sample users: `SamplePassword123!`
- Import **one table at a time** and wait for completion
- Verify each import succeeded before moving to the next
- If an import fails, fix the issue before continuing

