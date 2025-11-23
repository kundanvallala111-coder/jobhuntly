#!/usr/bin/env python3
"""Generate SQL UPDATE statements for candidate_profiles from CSV"""

import csv

def generate_update_sql():
    try:
        with open('candidate_profiles.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            profiles = list(reader)
    except FileNotFoundError:
        print("Error: candidate_profiles.csv not found")
        return
    
    sql_statements = []
    sql_statements.append("-- SQL script to UPDATE existing candidate_profiles")
    sql_statements.append("-- Profiles are auto-created by trigger, so we UPDATE instead of INSERT")
    sql_statements.append("")
    
    for profile in profiles:
        user_id = profile['user_id']
        
        # Handle array fields - convert from PostgreSQL array format
        skills = profile.get('skills', '{}')
        preferred_job_titles = profile.get('preferred_job_titles', '{}')
        
        # Build UPDATE statement
        updates = []
        
        if skills and skills != '{}':
            updates.append(f"skills = '{skills}'::text[]")
        else:
            updates.append("skills = '{}'::text[]")
        
        if profile.get('experience_years'):
            updates.append(f"experience_years = {profile['experience_years']}")
        else:
            updates.append("experience_years = NULL")
        
        if profile.get('resume_url'):
            resume_url_escaped = profile['resume_url'].replace("'", "''")
            updates.append(f"resume_url = '{resume_url_escaped}'")
        else:
            updates.append("resume_url = NULL")
        
        if profile.get('bio'):
            bio_escaped = profile['bio'].replace("'", "''")
            updates.append(f"bio = '{bio_escaped}'")
        else:
            updates.append("bio = NULL")
        
        if profile.get('education'):
            education_escaped = profile['education'].replace("'", "''")
            updates.append(f"education = '{education_escaped}'")
        else:
            updates.append("education = NULL")
        
        if profile.get('current_role'):
            current_role_escaped = profile['current_role'].replace("'", "''")
            updates.append(f"current_role = '{current_role_escaped}'")
        else:
            updates.append("current_role = NULL")
        
        if profile.get('current_company'):
            current_company_escaped = profile['current_company'].replace("'", "''")
            updates.append(f"current_company = '{current_company_escaped}'")
        else:
            updates.append("current_company = NULL")
        
        if profile.get('industry'):
            industry_escaped = profile['industry'].replace("'", "''")
            updates.append(f"industry = '{industry_escaped}'")
        else:
            updates.append("industry = NULL")
        
        if preferred_job_titles and preferred_job_titles != '{}':
            updates.append(f"preferred_job_titles = '{preferred_job_titles}'::text[]")
        else:
            updates.append("preferred_job_titles = NULL")
        
        if profile.get('preferred_employment_type'):
            updates.append(f"preferred_employment_type = '{profile['preferred_employment_type']}'")
        else:
            updates.append("preferred_employment_type = NULL")
        
        if profile.get('expected_salary_range'):
            salary_escaped = profile['expected_salary_range'].replace("'", "''")
            updates.append(f"expected_salary_range = '{salary_escaped}'")
        else:
            updates.append("expected_salary_range = NULL")
        
        if profile.get('notice_period'):
            updates.append(f"notice_period = '{profile['notice_period']}'")
        else:
            updates.append("notice_period = NULL")
        
        if profile.get('open_to_relocation'):
            updates.append(f"open_to_relocation = {profile['open_to_relocation'].lower()}")
        else:
            updates.append("open_to_relocation = NULL")
        
        if profile.get('remote_preference'):
            updates.append(f"remote_preference = '{profile['remote_preference']}'")
        else:
            updates.append("remote_preference = NULL")
        
        if profile.get('linkedin_url'):
            updates.append(f"linkedin_url = '{profile['linkedin_url']}'")
        else:
            updates.append("linkedin_url = NULL")
        
        if profile.get('github_url'):
            updates.append(f"github_url = '{profile['github_url']}'")
        else:
            updates.append("github_url = NULL")
        
        if profile.get('website_url'):
            updates.append(f"website_url = '{profile['website_url']}'")
        else:
            updates.append("website_url = NULL")
        
        updates.append("updated_at = now()")
        
        updates_str = ',\n    '.join(updates)
        sql = f"""UPDATE public.candidate_profiles
SET
    {updates_str}
WHERE user_id = '{user_id}'::uuid;"""
        
        sql_statements.append(sql)
        sql_statements.append("")
    
    output_file = 'update_candidate_profiles_generated.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"Generated SQL file: {output_file}")
    print(f"Contains {len(profiles)} candidate_profile UPDATE statements")

if __name__ == "__main__":
    generate_update_sql()

