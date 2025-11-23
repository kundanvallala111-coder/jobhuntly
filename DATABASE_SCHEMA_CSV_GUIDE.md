# Database Schema & CSV Import Guide

This document provides complete details for all tables in the Supabase database, including column specifications and CSV format requirements for bulk data import.

## Table of Contents
1. [profiles](#profiles)
2. [companies](#companies)
3. [jobs](#jobs)
4. [candidate_profiles](#candidate_profiles)
5. [candidate_experiences](#candidate_experiences)
6. [candidate_education](#candidate_education)
7. [candidate_portfolio_projects](#candidate_portfolio_projects)
8. [applications](#applications)
9. [notifications](#notifications)
10. [user_roles](#user_roles)

---

## profiles

**Description:** Main user profiles table (linked to auth.users)

### Columns

| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | ✅ Yes | - | Primary key, references auth.users(id) |
| full_name | TEXT | ✅ Yes | - | User's full name |
| email | TEXT | ✅ Yes | - | User's email address |
| role | app_role | ✅ Yes | 'candidate' | Enum: 'candidate', 'recruiter', 'admin' |
| avatar_url | TEXT | ❌ No | NULL | URL to profile picture |
| phone | TEXT | ❌ No | NULL | Phone number |
| location | TEXT | ❌ No | NULL | User location |
| company_id | UUID | ❌ No | NULL | References companies(id) - for recruiters |
| created_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |
| updated_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |

### CSV Format Example

```csv
id,full_name,email,role,avatar_url,phone,location,company_id
550e8400-e29b-41d4-a716-446655440000,John Doe,john.doe@example.com,candidate,https://example.com/avatar1.jpg,+1234567890,New York, NY,
550e8400-e29b-41d4-a716-446655440001,Jane Smith,jane.smith@example.com,recruiter,https://example.com/avatar2.jpg,+1234567891,San Francisco, CA,comp-001
```

**Important Notes:**
- `id` must be a valid UUID (can use `gen_random_uuid()` in SQL or generate UUIDs)
- `role` must be one of: `candidate`, `recruiter`, `admin`
- `company_id` should only be set for recruiters
- Leave empty cells as empty (no NULL text)

---

## companies

**Description:** Company/organization information

### Columns

| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | ✅ Yes | gen_random_uuid() | Primary key |
| name | TEXT | ✅ Yes | - | Company name (UNIQUE) |
| description | TEXT | ❌ No | NULL | Company description |
| website | TEXT | ❌ No | NULL | Company website URL |
| logo_url | TEXT | ❌ No | NULL | Company logo URL |
| location | TEXT | ❌ No | NULL | Company location |
| industry | TEXT | ❌ No | NULL | Industry sector |
| created_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |
| updated_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |

### CSV Format Example

```csv
id,name,description,website,logo_url,location,industry
comp-001,Google,Technology company specializing in search and cloud services,https://google.com,https://google.com/logo.png,Mountain View, CA,Technology
comp-002,Microsoft,Software and cloud computing company,https://microsoft.com,https://microsoft.com/logo.png,Redmond, WA,Technology
comp-003,Amazon,E-commerce and cloud services,https://amazon.com,https://amazon.com/logo.png,Seattle, WA,E-commerce
```

**Important Notes:**
- `name` must be unique
- `id` can be auto-generated or manually set (UUID format)

---

## jobs

**Description:** Job postings

### Columns

| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | ✅ Yes | gen_random_uuid() | Primary key |
| title | TEXT | ✅ Yes | - | Job title |
| description | TEXT | ✅ Yes | - | Job description |
| location | TEXT | ✅ Yes | - | Job location |
| job_type | TEXT | ✅ Yes | - | e.g., 'full-time', 'part-time', 'contract', 'remote' |
| salary_range | TEXT | ❌ No | NULL | e.g., '$80,000 - $120,000' |
| required_skills | TEXT[] | ❌ No | '{}' | Array of skills |
| posted_by | UUID | ✅ Yes | - | References profiles(id) |
| company_id | UUID | ❌ No | NULL | References companies(id) |
| company_name | TEXT | ❌ No | NULL | Company name (can be set if company_id is NULL) |
| status | TEXT | ✅ Yes | 'active' | 'active', 'closed', 'draft' |
| created_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |
| updated_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |

### CSV Format Example

```csv
id,title,description,location,job_type,salary_range,required_skills,posted_by,company_id,company_name,status
job-001,Senior Software Engineer,We are looking for an experienced software engineer...,San Francisco, CA,full-time,"$120,000 - $180,000","{JavaScript,TypeScript,React,Node.js}",recruiter-001,comp-001,Google,active
job-002,Frontend Developer,Join our team as a frontend developer...,Remote,full-time,"$90,000 - $130,000","{React,Vue.js,HTML,CSS}",recruiter-002,comp-002,Microsoft,active
```

**Important Notes:**
- `required_skills` is an array - in CSV, use PostgreSQL array format: `{skill1,skill2,skill3}`
- `posted_by` must reference an existing profile ID
- `company_id` and `company_name` - use one or both

---

## candidate_profiles

**Description:** Extended profile information for candidates

### Columns

| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | ✅ Yes | gen_random_uuid() | Primary key |
| user_id | UUID | ✅ Yes | - | References profiles(id) - UNIQUE |
| skills | TEXT[] | ❌ No | '{}' | Array of skills |
| experience_years | INTEGER | ❌ No | NULL | Years of experience |
| resume_url | TEXT | ❌ No | NULL | URL to resume file |
| bio | TEXT | ❌ No | NULL | Candidate bio/summary |
| education | TEXT | ❌ No | NULL | Education summary |
| current_role | TEXT | ❌ No | NULL | Current job title |
| current_company | TEXT | ❌ No | NULL | Current company name |
| industry | TEXT | ❌ No | NULL | Industry sector |
| preferred_job_titles | TEXT[] | ❌ No | NULL | Array of preferred job titles |
| preferred_employment_type | TEXT | ❌ No | NULL | e.g., 'full-time', 'remote' |
| expected_salary_range | TEXT | ❌ No | NULL | e.g., '$100,000 - $150,000' |
| notice_period | TEXT | ❌ No | NULL | e.g., '2 weeks', '1 month' |
| open_to_relocation | BOOLEAN | ❌ No | NULL | true/false |
| remote_preference | TEXT | ❌ No | NULL | 'remote', 'hybrid', 'onsite' |
| linkedin_url | TEXT | ❌ No | NULL | LinkedIn profile URL |
| github_url | TEXT | ❌ No | NULL | GitHub profile URL |
| website_url | TEXT | ❌ No | NULL | Personal website URL |
| created_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |
| updated_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |

### CSV Format Example

```csv
id,user_id,skills,experience_years,resume_url,bio,education,current_role,current_company,industry,preferred_job_titles,preferred_employment_type,expected_salary_range,notice_period,open_to_relocation,remote_preference,linkedin_url,github_url,website_url
cand-prof-001,550e8400-e29b-41d4-a716-446655440000,"{JavaScript,React,Node.js,Python}",5,https://example.com/resume1.pdf,Experienced full-stack developer...,BS Computer Science,Senior Developer,Tech Corp,Technology,"{Software Engineer,Full Stack Developer}",full-time,"$120,000 - $150,000",2 weeks,true,remote,https://linkedin.com/in/johndoe,https://github.com/johndoe,https://johndoe.dev
```

**Important Notes:**
- `user_id` must reference an existing profile with role='candidate'
- `user_id` must be unique (one candidate profile per user)
- Array fields: use PostgreSQL format `{item1,item2,item3}`
- Boolean: use `true` or `false` (lowercase)

---

## candidate_experiences

**Description:** Work experience entries for candidates

### Columns

| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | ✅ Yes | gen_random_uuid() | Primary key |
| candidate_id | UUID | ✅ Yes | - | References candidate_profiles(user_id) |
| job_title | TEXT | ✅ Yes | - | Job title |
| company_name | TEXT | ✅ Yes | - | Company name |
| start_date | DATE | ✅ Yes | - | Start date (YYYY-MM-DD) |
| end_date | DATE | ❌ No | NULL | End date (YYYY-MM-DD), NULL if current |
| description | TEXT | ❌ No | NULL | Job description/responsibilities |
| created_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |
| updated_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |

### CSV Format Example

```csv
id,candidate_id,job_title,company_name,start_date,end_date,description
exp-001,550e8400-e29b-41d4-a716-446655440000,Software Engineer,Google,2020-01-15,2022-06-30,Developed web applications using React and Node.js
exp-002,550e8400-e29b-41d4-a716-446655440000,Senior Software Engineer,Tech Corp,2022-07-01,,Led a team of 5 developers and architected microservices
```

**Important Notes:**
- `candidate_id` references `candidate_profiles.user_id` (not `candidate_profiles.id`)
- Dates format: `YYYY-MM-DD`
- Leave `end_date` empty for current positions

---

## candidate_education

**Description:** Education entries for candidates

### Columns

| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | ✅ Yes | gen_random_uuid() | Primary key |
| candidate_id | UUID | ✅ Yes | - | References candidate_profiles(user_id) |
| degree | TEXT | ✅ Yes | - | Degree name (e.g., 'Bachelor of Science') |
| institution | TEXT | ✅ Yes | - | School/university name |
| major | TEXT | ❌ No | NULL | Field of study |
| start_year | INTEGER | ❌ No | NULL | Start year (YYYY) |
| graduation_year | INTEGER | ❌ No | NULL | Graduation year (YYYY) |
| created_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |
| updated_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |

### CSV Format Example

```csv
id,candidate_id,degree,institution,major,start_year,graduation_year
edu-001,550e8400-e29b-41d4-a716-446655440000,Bachelor of Science,Stanford University,Computer Science,2016,2020
edu-002,550e8400-e29b-41d4-a716-446655440001,Master of Science,MIT,Software Engineering,2020,2022
```

**Important Notes:**
- `candidate_id` references `candidate_profiles.user_id` (not `candidate_profiles.id`)
- Years are integers (e.g., 2020, not "2020")

---

## candidate_portfolio_projects

**Description:** Portfolio projects for candidates

### Columns

| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | ✅ Yes | gen_random_uuid() | Primary key |
| candidate_id | UUID | ✅ Yes | - | References candidate_profiles(user_id) |
| title | TEXT | ✅ Yes | - | Project title |
| description | TEXT | ❌ No | NULL | Project description |
| url | TEXT | ❌ No | NULL | Project URL (GitHub, live demo, etc.) |
| created_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |
| updated_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |

### CSV Format Example

```csv
id,candidate_id,title,description,url
proj-001,550e8400-e29b-41d4-a716-446655440000,E-commerce Platform,Built a full-stack e-commerce platform using React and Node.js,https://github.com/johndoe/ecommerce
proj-002,550e8400-e29b-41d4-a716-446655440000,Task Management App,A collaborative task management application,https://taskapp.example.com
```

**Important Notes:**
- `candidate_id` references `candidate_profiles.user_id` (not `candidate_profiles.id`)

---

## applications

**Description:** Job applications submitted by candidates

### Columns

| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | ✅ Yes | gen_random_uuid() | Primary key |
| job_id | UUID | ✅ Yes | - | References jobs(id) |
| candidate_id | UUID | ✅ Yes | - | References profiles(id) |
| status | application_status | ✅ Yes | 'pending' | Enum: 'pending', 'reviewing', 'interview', 'accepted', 'rejected' |
| cover_letter | TEXT | ❌ No | NULL | Cover letter text |
| feedback | TEXT | ❌ No | NULL | Recruiter feedback |
| applied_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |
| updated_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |

### CSV Format Example

```csv
id,job_id,candidate_id,status,cover_letter,feedback
app-001,job-001,550e8400-e29b-41d4-a716-446655440000,pending,"Dear Hiring Manager, I am excited to apply...",
app-002,job-001,550e8400-e29b-41d4-a716-446655440001,reviewing,"I believe my experience aligns well...",
app-003,job-002,550e8400-e29b-41d4-a716-446655440000,interview,,"Scheduled for technical interview on 2024-01-15"
```

**Important Notes:**
- `job_id` and `candidate_id` combination must be unique (one application per candidate per job)
- `status` must be one of: `pending`, `reviewing`, `interview`, `accepted`, `rejected`
- `candidate_id` references `profiles(id)`, not `candidate_profiles.user_id`

---

## notifications

**Description:** User notifications

### Columns

| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | ✅ Yes | gen_random_uuid() | Primary key |
| user_id | UUID | ✅ Yes | - | References profiles(id) |
| message | TEXT | ✅ Yes | - | Notification message |
| type | TEXT | ✅ Yes | - | e.g., 'application_update', 'job_posted', 'interview_scheduled' |
| related_id | UUID | ❌ No | NULL | Can reference job_id or application_id |
| is_read | BOOLEAN | ✅ Yes | false | Read status |
| created_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |

### CSV Format Example

```csv
id,user_id,message,type,related_id,is_read
notif-001,550e8400-e29b-41d4-a716-446655440000,Your application for Senior Software Engineer has been reviewed,application_update,app-001,false
notif-002,550e8400-e29b-41d4-a716-446655440000,New job posted: Frontend Developer,job_posted,job-002,false
notif-003,550e8400-e29b-41d4-a716-446655440001,Interview scheduled for tomorrow at 2 PM,interview_scheduled,app-003,true
```

**Important Notes:**
- `is_read` must be `true` or `false` (lowercase)
- `related_id` can reference any related entity (job, application, etc.)

---

## user_roles

**Description:** User role assignments (security table)

### Columns

| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | ✅ Yes | gen_random_uuid() | Primary key |
| user_id | UUID | ✅ Yes | - | References auth.users(id) |
| role | app_role | ✅ Yes | - | Enum: 'candidate', 'recruiter', 'admin' |
| created_at | TIMESTAMPTZ | ✅ Yes | NOW() | Auto-generated |

### CSV Format Example

```csv
id,user_id,role
role-001,550e8400-e29b-41d4-a716-446655440000,candidate
role-002,550e8400-e29b-41d4-a716-446655440001,recruiter
role-003,550e8400-e29b-41d4-a716-446655440002,admin
```

**Important Notes:**
- `user_id` references `auth.users(id)`, not `profiles(id)`
- `role` must be one of: `candidate`, `recruiter`, `admin`
- `user_id` and `role` combination must be unique

---

## CSV Import Tips

### 1. **UUID Generation**
- Use PostgreSQL's `gen_random_uuid()` function
- Or generate UUIDs using online tools or programming languages
- Format: `550e8400-e29b-41d4-a716-446655440000`

### 2. **Array Fields**
- Format: `{item1,item2,item3}` (PostgreSQL array syntax)
- Example: `{JavaScript,React,Node.js,Python}`
- No spaces after commas inside braces

### 3. **Boolean Fields**
- Use lowercase: `true` or `false`
- Not: `TRUE`, `FALSE`, `1`, `0`, `yes`, `no`

### 4. **Date Fields**
- Format: `YYYY-MM-DD` (e.g., `2024-01-15`)
- For TIMESTAMPTZ: `YYYY-MM-DD HH:MM:SS+TZ` (e.g., `2024-01-15 10:30:00+00`)

### 5. **NULL Values**
- Leave cells empty (no text)
- Don't write "NULL" or "null" as text

### 6. **Foreign Key References**
- Ensure referenced IDs exist before importing
- Import order matters:
  1. `profiles` (or ensure auth.users exist)
  2. `companies`
  3. `jobs` (needs profiles and companies)
  4. `candidate_profiles` (needs profiles)
  5. `candidate_experiences`, `candidate_education`, `candidate_portfolio_projects` (need candidate_profiles)
  6. `applications` (needs jobs and profiles)
  7. `notifications` (needs profiles)
  8. `user_roles` (needs auth.users)

### 7. **Importing to Supabase**
- Use Supabase Dashboard → Table Editor → Import CSV
- Or use SQL: `COPY table_name FROM '/path/to/file.csv' WITH (FORMAT csv, HEADER true);`
- Or use Supabase API with bulk insert

---

## Sample Data Generation

You can use tools like:
- **Mockaroo** (https://www.mockaroo.com/) - Generate realistic CSV data
- **Faker.js** - Programmatic data generation
- **Python pandas** - Generate and manipulate CSV files
- **PostgreSQL COPY command** - Direct CSV import

---

## Quick Reference: Enums

### app_role
- `candidate`
- `recruiter`
- `admin`

### application_status
- `pending`
- `reviewing`
- `interview`
- `accepted`
- `rejected`

---

## Example: Complete Data Set

For a complete working example, you would need:
- 10-20 profiles (mix of candidates and recruiters)
- 5-10 companies
- 20-30 jobs
- 10-15 candidate_profiles (linked to candidate profiles)
- 30-50 candidate_experiences
- 20-30 candidate_education entries
- 10-20 candidate_portfolio_projects
- 50-100 applications
- 30-50 notifications
- user_roles matching profiles

This provides a realistic dataset for testing and development.



