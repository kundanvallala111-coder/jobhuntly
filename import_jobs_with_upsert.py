#!/usr/bin/env python3
"""
Generate SQL UPSERT statements to import jobs.csv into Supabase
This handles duplicate keys by updating existing records instead of failing

Usage:
1. Run: python import_jobs_with_upsert.py
2. Copy the generated SQL and run it in Supabase SQL Editor
"""

import csv

def escape_sql_string(value):
    """Escape single quotes in SQL strings"""
    if value is None or value == '':
        return 'NULL'
    return "'" + str(value).replace("'", "''") + "'"

def generate_upsert_sql():
    """Generate SQL UPSERT statements from jobs.csv"""
    try:
        with open('jobs.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            jobs = list(reader)
    except FileNotFoundError:
        print("Error: jobs.csv not found")
        print("   Make sure jobs.csv is in the current directory")
        return
    
    sql_statements = []
    sql_statements.append("-- SQL script to UPSERT jobs from jobs.csv")
    sql_statements.append("-- This will UPDATE existing records or INSERT new ones")
    sql_statements.append("-- Run this in Supabase SQL Editor")
    sql_statements.append("")
    
    for job in jobs:
        # Extract all fields
        job_id = escape_sql_string(job.get('id', ''))
        title = escape_sql_string(job.get('title', ''))
        description = escape_sql_string(job.get('description', ''))
        location = escape_sql_string(job.get('location', ''))
        job_type = escape_sql_string(job.get('job_type', ''))
        salary_range = escape_sql_string(job.get('salary_range', ''))
        required_skills = escape_sql_string(job.get('required_skills', ''))
        posted_by = escape_sql_string(job.get('posted_by', ''))
        company_id = escape_sql_string(job.get('company_id', '')) if job.get('company_id') else 'NULL'
        company_name = escape_sql_string(job.get('company_name', ''))
        status = escape_sql_string(job.get('status', ''))
        created_at = escape_sql_string(job.get('created_at', ''))
        updated_at = escape_sql_string(job.get('updated_at', ''))
        
        # Generate UPSERT SQL (INSERT ... ON CONFLICT DO UPDATE)
        sql = f"""INSERT INTO jobs (
    id,
    title,
    description,
    location,
    job_type,
    salary_range,
    required_skills,
    posted_by,
    company_id,
    company_name,
    status,
    created_at,
    updated_at
) VALUES (
    {job_id}::uuid,
    {title},
    {description},
    {location},
    {job_type},
    {salary_range},
    {required_skills}::text[],
    {posted_by}::uuid,
    {company_id}::uuid,
    {company_name},
    {status},
    {created_at}::timestamptz,
    {updated_at}::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    location = EXCLUDED.location,
    job_type = EXCLUDED.job_type,
    salary_range = EXCLUDED.salary_range,
    required_skills = EXCLUDED.required_skills,
    posted_by = EXCLUDED.posted_by,
    company_id = EXCLUDED.company_id,
    company_name = EXCLUDED.company_name,
    status = EXCLUDED.status,
    -- created_at is preserved (not updated) to keep original creation time
    updated_at = EXCLUDED.updated_at;"""
        
        sql_statements.append(sql)
        sql_statements.append("")
    
    # Write to file
    output_file = 'import_jobs_upsert_generated.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"Generated SQL file: {output_file}")
    print(f"   Contains {len(jobs)} job UPSERT statements")
    print(f"\nNext steps:")
    print(f"   1. Open Supabase Dashboard -> SQL Editor")
    print(f"   2. Copy and paste the contents of {output_file}")
    print(f"   3. Run the SQL script")
    print(f"\nThis will update existing jobs and insert new ones without errors!")

if __name__ == "__main__":
    generate_upsert_sql()

