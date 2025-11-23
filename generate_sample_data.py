#!/usr/bin/env python3
"""
Generate sample CSV data for Supabase database tables
Run: python generate_sample_data.py
"""

import csv
import uuid
from datetime import datetime, timedelta
import random

# Sample data pools
COMPANIES = [
    ("Google", "Technology company specializing in search and cloud services", "https://google.com", "Mountain View, CA", "Technology"),
    ("Microsoft", "Software and cloud computing company", "https://microsoft.com", "Redmond, WA", "Technology"),
    ("Amazon", "E-commerce and cloud services", "https://amazon.com", "Seattle, WA", "E-commerce"),
    ("Apple", "Consumer electronics and software", "https://apple.com", "Cupertino, CA", "Technology"),
    ("Meta", "Social media and virtual reality", "https://meta.com", "Menlo Park, CA", "Technology"),
    ("Netflix", "Streaming entertainment service", "https://netflix.com", "Los Gatos, CA", "Entertainment"),
    ("Tesla", "Electric vehicles and energy", "https://tesla.com", "Austin, TX", "Automotive"),
    ("Airbnb", "Online marketplace for lodging", "https://airbnb.com", "San Francisco, CA", "Travel"),
    ("Uber", "Ride-sharing and food delivery", "https://uber.com", "San Francisco, CA", "Transportation"),
    ("Stripe", "Online payment processing", "https://stripe.com", "San Francisco, CA", "Fintech"),
    # Additional tech companies
    ("Oracle", "Enterprise software and cloud infrastructure", "https://oracle.com", "Austin, TX", "Technology"),
    ("IBM", "Cloud computing and AI solutions", "https://ibm.com", "Armonk, NY", "Technology"),
    ("Salesforce", "Customer relationship management and cloud platform", "https://salesforce.com", "San Francisco, CA", "Technology"),
    ("Adobe", "Creative software and digital marketing solutions", "https://adobe.com", "San Jose, CA", "Technology"),
    ("NVIDIA", "Graphics processing and AI computing", "https://nvidia.com", "Santa Clara, CA", "Technology"),
    ("Intel", "Semiconductor and computing technology", "https://intel.com", "Santa Clara, CA", "Technology"),
    ("Cisco", "Networking and cybersecurity solutions", "https://cisco.com", "San Jose, CA", "Technology"),
    ("VMware", "Cloud infrastructure and virtualization", "https://vmware.com", "Palo Alto, CA", "Technology"),
    ("Splunk", "Data analytics and security information", "https://splunk.com", "San Francisco, CA", "Technology"),
    ("Palantir", "Big data analytics and enterprise software", "https://palantir.com", "Denver, CO", "Technology"),
]

SKILLS_POOL = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
    "React", "Vue.js", "Angular", "Node.js", "Express", "Django", "Flask",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes",
    "AWS", "Azure", "GCP", "Git", "CI/CD", "GraphQL", "REST API",
    "HTML", "CSS", "SASS", "Tailwind CSS", "Webpack", "Vite",
    "Machine Learning", "Data Science", "TensorFlow", "PyTorch",
    "Agile", "Scrum", "DevOps", "Microservices", "System Design",
    # Additional tech skills
    "Swift", "Kotlin", "Scala", "Ruby", "PHP", "Perl", "R", "MATLAB",
    "Next.js", "Svelte", "Nuxt.js", "Gatsby", "Remix", "SolidJS",
    "Spring Boot", "Laravel", "Ruby on Rails", "ASP.NET", "FastAPI",
    "Cassandra", "Elasticsearch", "Neo4j", "DynamoDB", "Firebase",
    "Terraform", "Ansible", "Jenkins", "GitLab CI", "GitHub Actions",
    "Linux", "Bash", "Shell Scripting", "PowerShell",
    "Computer Vision", "Natural Language Processing", "Deep Learning",
    "Blockchain", "Smart Contracts", "Web3", "Solidity",
    "Cybersecurity", "Penetration Testing", "Ethical Hacking",
    "Mobile Development", "iOS Development", "Android Development",
    "React Native", "Flutter", "Xamarin", "Ionic"
]

JOB_TITLES = [
    "Software Engineer", "Senior Software Engineer", "Full Stack Developer",
    "Frontend Developer", "Backend Developer", "DevOps Engineer",
    "Data Engineer", "Machine Learning Engineer", "Product Manager",
    "UX Designer", "UI Designer", "QA Engineer", "Security Engineer",
    "Cloud Architect", "Technical Lead", "Engineering Manager",
    # Additional tech job titles
    "Mobile App Developer", "iOS Developer", "Android Developer",
    "Site Reliability Engineer", "Platform Engineer", "Infrastructure Engineer",
    "Data Scientist", "AI Engineer", "MLOps Engineer",
    "Cybersecurity Analyst", "Penetration Tester", "Security Architect",
    "Blockchain Developer", "Smart Contract Developer", "Web3 Developer",
    "Game Developer", "Unity Developer", "Unreal Engine Developer",
    "Embedded Systems Engineer", "Firmware Engineer", "IoT Developer",
    "Computer Vision Engineer", "NLP Engineer", "Robotics Engineer",
    "Quantum Computing Engineer", "Research Scientist", "Technical Writer"
]

DEGREES = [
    "Bachelor of Science", "Bachelor of Arts", "Master of Science",
    "Master of Business Administration", "Doctor of Philosophy",
    "Associate Degree", "Bachelor of Engineering",
    # Additional tech-related degrees
    "Bachelor of Science in Computer Science",
    "Master of Science in Computer Science",
    "Bachelor of Science in Software Engineering",
    "Master of Science in Software Engineering",
    "Bachelor of Science in Information Technology",
    "Master of Science in Information Technology",
    "Bachelor of Science in Data Science",
    "Master of Science in Data Science",
    "Bachelor of Science in Cybersecurity",
    "Master of Science in Cybersecurity",
    "Bachelor of Science in Artificial Intelligence",
    "Master of Science in Artificial Intelligence",
    "Bachelor of Science in Computer Engineering",
    "Master of Science in Computer Engineering",
    "Bachelor of Science in Network Engineering",
    "Master of Science in Network Engineering",
    "Bachelor of Science in Information Systems",
    "Master of Science in Information Systems"
]

INSTITUTIONS = [
    "Stanford University", "MIT", "Harvard University", "UC Berkeley",
    "Carnegie Mellon", "Georgia Tech", "University of Washington",
    "University of Texas", "NYU", "Columbia University"
]

MAJORS = [
    "Computer Science", "Software Engineering", "Electrical Engineering",
    "Information Systems", "Data Science", "Mathematics", "Physics"
]

LOCATIONS = [
    "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX",
    "Boston, MA", "Chicago, IL", "Los Angeles, CA", "Remote",
    "Mountain View, CA", "Redmond, WA"
]

def generate_uuid():
    return str(uuid.uuid4())

def generate_date(start_year=2015, end_year=2024):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    random_date = start + timedelta(days=random.randint(0, (end - start).days))
    return random_date.strftime("%Y-%m-%d")

def generate_timestamp(days_ago=0):
    dt = datetime.now() - timedelta(days=days_ago)
    return dt.strftime("%Y-%m-%d %H:%M:%S+00")

def write_csv(filename, headers, rows):
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
    print(f"✅ Generated {filename} with {len(rows)} rows")

def generate_profiles(num=20):
    """Generate profiles (mix of candidates and recruiters)"""
    rows = []
    profile_ids = []
    
    for i in range(num):
        profile_id = generate_uuid()
        profile_ids.append(profile_id)
        role = 'candidate' if i < 15 else 'recruiter'
        company_id = generate_uuid() if role == 'recruiter' and i % 2 == 0 else ''
        
        rows.append([
            profile_id,
            f"User {i+1}",
            f"user{i+1}@example.com",
            role,
            f"https://example.com/avatar{i+1}.jpg",
            f"+1{random.randint(2000000000, 9999999999)}",
            random.choice(LOCATIONS),
            company_id,
            generate_timestamp(random.randint(0, 365)),
            generate_timestamp(random.randint(0, 30))
        ])
    
    write_csv('profiles.csv', [
        'id', 'full_name', 'email', 'role', 'avatar_url', 'phone', 'location', 'company_id',
        'created_at', 'updated_at'
    ], rows)
    return profile_ids

def generate_companies(num=10):
    """Generate companies"""
    rows = []
    company_ids = []
    
    for i, (name, desc, website, location, industry) in enumerate(COMPANIES[:num]):
        company_id = generate_uuid()
        company_ids.append(company_id)
        rows.append([
            company_id,
            name,
            desc,
            website,
            f"{website}/logo.png",
            location,
            industry,
            generate_timestamp(random.randint(0, 730)),
            generate_timestamp(random.randint(0, 30))
        ])
    
    write_csv('companies.csv', [
        'id', 'name', 'description', 'website', 'logo_url', 'location', 'industry',
        'created_at', 'updated_at'
    ], rows)
    return company_ids

def generate_jobs(num=30, profile_ids=None, company_ids=None):
    """Generate job postings"""
    rows = []
    
    job_types = ['full-time', 'part-time', 'contract', 'remote']
    statuses = ['active', 'active', 'active', 'closed', 'draft']  # More active jobs
    
    for i in range(num):
        job_id = generate_uuid()
        recruiter_id = random.choice([p for p in profile_ids if profile_ids.index(p) >= 15]) if profile_ids else generate_uuid()
        # Set company_id to empty - companies can be linked later if needed
        # This avoids foreign key errors if companies.csv IDs don't match
        company_id = ''
        company_name = COMPANIES[random.randint(0, min(len(COMPANIES)-1, len(COMPANIES)-1))][0]
        
        title = random.choice(JOB_TITLES)
        skills = random.sample(SKILLS_POOL, random.randint(3, 8))
        skills_str = '{' + ','.join(skills) + '}'
        
        salary_min = random.randint(80, 150) * 1000
        salary_max = salary_min + random.randint(30, 80) * 1000
        salary_range = f"${salary_min:,} - ${salary_max:,}"
        
        rows.append([
            job_id,
            title,
            f"Join our team as a {title.lower()}. We are looking for an experienced professional...",
            random.choice(LOCATIONS),
            random.choice(job_types),
            salary_range,
            skills_str,
            recruiter_id,
            company_id,
            company_name,
            random.choice(statuses),
            generate_timestamp(random.randint(0, 90)),
            generate_timestamp(random.randint(0, 30))
        ])
    
    write_csv('jobs.csv', [
        'id', 'title', 'description', 'location', 'job_type', 'salary_range',
        'required_skills', 'posted_by', 'company_id', 'company_name', 'status',
        'created_at', 'updated_at'
    ], rows)
    return [row[0] for row in rows]  # Return job IDs

def generate_candidate_profiles(profile_ids=None):
    """Generate candidate profiles"""
    rows = []
    candidate_user_ids = []
    
    # Only use candidate profiles (first 15)
    candidate_profiles = profile_ids[:15] if profile_ids else [generate_uuid() for _ in range(15)]
    
    for user_id in candidate_profiles:
        candidate_user_ids.append(user_id)
        skills = random.sample(SKILLS_POOL, random.randint(5, 12))
        skills_str = '{' + ','.join(skills) + '}'
        
        preferred_titles = random.sample(JOB_TITLES[:10], random.randint(1, 3))
        preferred_titles_str = '{' + ','.join(preferred_titles) + '}'
        
        rows.append([
            generate_uuid(),
            user_id,
            skills_str,
            random.randint(1, 15),
            f"https://example.com/resumes/{user_id}.pdf",
            f"Experienced professional with {random.randint(3, 15)} years in the industry...",
            f"{random.choice(DEGREES)} in {random.choice(MAJORS)}",
            random.choice(JOB_TITLES),
            random.choice(COMPANIES)[0],
            random.choice(['Technology', 'Finance', 'Healthcare', 'E-commerce']),
            preferred_titles_str,
            random.choice(['full-time', 'part-time', 'contract']),
            f"${random.randint(80, 200)}k - ${random.randint(200, 300)}k",
            random.choice(['2 weeks', '1 month', 'Immediate']),
            random.choice(['true', 'false']),
            random.choice(['remote', 'hybrid', 'onsite']),
            f"https://linkedin.com/in/user{random.randint(1, 1000)}",
            f"https://github.com/user{random.randint(1, 1000)}",
            f"https://user{random.randint(1, 1000)}.dev",
            generate_timestamp(random.randint(0, 365)),
            generate_timestamp(random.randint(0, 30))
        ])
    
    write_csv('candidate_profiles.csv', [
        'id', 'user_id', 'skills', 'experience_years', 'resume_url', 'bio', 'education',
        'current_role', 'current_company', 'industry', 'preferred_job_titles',
        'preferred_employment_type', 'expected_salary_range', 'notice_period',
        'open_to_relocation', 'remote_preference', 'linkedin_url', 'github_url',
        'website_url', 'created_at', 'updated_at'
    ], rows)
    return candidate_user_ids

def generate_candidate_experiences(candidate_user_ids=None):
    """Generate work experience entries"""
    rows = []
    
    for user_id in (candidate_user_ids or []):
        num_experiences = random.randint(2, 5)
        current_date = datetime.now()
        
        for i in range(num_experiences):
            start_year = 2020 - (num_experiences - i) * 2
            start_date = generate_date(start_year, start_year + 1)
            
            # Last experience might be current (no end_date)
            if i == num_experiences - 1 and random.random() > 0.3:
                end_date = ''
            else:
                end_date = generate_date(start_year + 1, start_year + 3)
            
            rows.append([
                generate_uuid(),
                user_id,
                random.choice(JOB_TITLES),
                random.choice(COMPANIES)[0],
                start_date,
                end_date,
                f"Responsible for developing and maintaining software applications..."
            ])
    
    write_csv('candidate_experiences.csv', [
        'id', 'candidate_id', 'job_title', 'company_name', 'start_date', 'end_date', 'description'
    ], rows)

def generate_candidate_education(candidate_user_ids=None):
    """Generate education entries"""
    rows = []
    
    for user_id in (candidate_user_ids or []):
        num_educations = random.randint(1, 2)
        
        for i in range(num_educations):
            start_year = 2014 + i * 4
            graduation_year = start_year + 4
            
            rows.append([
                generate_uuid(),
                user_id,
                random.choice(DEGREES),
                random.choice(INSTITUTIONS),
                random.choice(MAJORS),
                start_year,
                graduation_year,
                generate_timestamp(random.randint(0, 365)),
                generate_timestamp(random.randint(0, 30))
            ])
    
    write_csv('candidate_education.csv', [
        'id', 'candidate_id', 'degree', 'institution', 'major', 'start_year',
        'graduation_year', 'created_at', 'updated_at'
    ], rows)

def generate_candidate_portfolio_projects(candidate_user_ids=None):
    """Generate portfolio projects"""
    rows = []
    
    project_titles = [
        "E-commerce Platform", "Task Management App", "Social Media Dashboard",
        "Weather App", "Recipe Finder", "Budget Tracker", "Blog Platform",
        "Chat Application", "Music Player", "Fitness Tracker"
    ]
    
    for user_id in (candidate_user_ids or []):
        num_projects = random.randint(2, 4)
        
        for i in range(num_projects):
            title = random.choice(project_titles)
            rows.append([
                generate_uuid(),
                user_id,
                title,
                f"Built a {title.lower()} using modern web technologies...",
                f"https://github.com/user{random.randint(1, 1000)}/{title.lower().replace(' ', '-')}",
                generate_timestamp(random.randint(0, 180)),
                generate_timestamp(random.randint(0, 30))
            ])
    
    write_csv('candidate_portfolio_projects.csv', [
        'id', 'candidate_id', 'title', 'description', 'url', 'created_at', 'updated_at'
    ], rows)

def generate_applications(job_ids=None, candidate_profile_ids=None):
    """Generate job applications"""
    rows = []
    
    statuses = ['pending', 'reviewing', 'interview', 'accepted', 'rejected']
    status_weights = [0.4, 0.2, 0.15, 0.15, 0.1]  # More pending applications
    
    if not job_ids or not candidate_profile_ids:
        print("⚠️  Warning: Cannot generate applications - missing job_ids or candidate_profile_ids")
        return
    
    if len(job_ids) == 0:
        print("⚠️  Warning: No jobs available to create applications for")
        return
    
    # Each candidate applies to 2-5 random jobs
    for candidate_id in candidate_profile_ids:
        num_applications = random.randint(2, 5)
        # Ensure we don't try to sample more jobs than available
        num_applications = min(num_applications, len(job_ids))
        applied_jobs = random.sample(job_ids, num_applications)
        
        for job_id in applied_jobs:
            status = random.choices(statuses, weights=status_weights)[0]
            cover_letter = f"Dear Hiring Manager, I am excited to apply for this position..." if random.random() > 0.3 else ''
            feedback = f"Application reviewed. Status: {status}" if status != 'pending' else ''
            
            rows.append([
                generate_uuid(),
                job_id,
                candidate_id,
                status,
                cover_letter,
                feedback,
                generate_timestamp(random.randint(0, 60)),
                generate_timestamp(random.randint(0, 30))
            ])
    
    write_csv('applications.csv', [
        'id', 'job_id', 'candidate_id', 'status', 'cover_letter', 'feedback',
        'applied_at', 'updated_at'
    ], rows)
    
    # Validate that all job_ids in applications exist in the jobs list
    unique_job_ids_in_apps = set(row[1] for row in rows)
    missing_jobs = unique_job_ids_in_apps - set(job_ids)
    if missing_jobs:
        print(f"⚠️  WARNING: {len(missing_jobs)} job IDs in applications don't exist in jobs list!")
    else:
        print(f"✅ Validation: All {len(unique_job_ids_in_apps)} job references are valid")

def generate_notifications(profile_ids=None, job_ids=None, application_ids=None):
    """Generate notifications"""
    rows = []
    
    notification_types = ['application_update', 'job_posted', 'interview_scheduled', 'message']
    
    if not profile_ids:
        return
    
    for i in range(50):
        user_id = random.choice(profile_ids)
        notif_type = random.choice(notification_types)
        
        if notif_type == 'application_update' and application_ids:
            related_id = random.choice(application_ids) if application_ids else ''
            message = "Your application status has been updated"
        elif notif_type == 'job_posted' and job_ids:
            related_id = random.choice(job_ids) if job_ids else ''
            message = "A new job matching your profile has been posted"
        elif notif_type == 'interview_scheduled':
            related_id = random.choice(application_ids) if application_ids else ''
            message = "Your interview has been scheduled for tomorrow at 2 PM"
        else:
            related_id = ''
            message = "You have a new message"
        
        rows.append([
            generate_uuid(),
            user_id,
            message,
            notif_type,
            related_id,
            random.choice(['true', 'false']),
            generate_timestamp(random.randint(0, 30))
        ])
    
    write_csv('notifications.csv', [
        'id', 'user_id', 'message', 'type', 'related_id', 'is_read', 'created_at'
    ], rows)

def generate_user_roles(profile_ids=None):
    """Generate user roles"""
    rows = []
    
    if not profile_ids:
        return
    
    for i, profile_id in enumerate(profile_ids):
        role = 'candidate' if i < 15 else 'recruiter'
        rows.append([
            generate_uuid(),
            profile_id,  # Note: This should reference auth.users(id), but for CSV we use profile_id
            role,
            generate_timestamp(random.randint(0, 365))
        ])
    
    write_csv('user_roles.csv', [
        'id', 'user_id', 'role', 'created_at'
    ], rows)

def main():
    print("🚀 Generating sample CSV data for Supabase...\n")
    
    # Generate in dependency order
    profile_ids = generate_profiles(20)
    company_ids = generate_companies(10)
    job_ids = generate_jobs(30, profile_ids, company_ids)
    candidate_user_ids = generate_candidate_profiles(profile_ids)
    generate_candidate_experiences(candidate_user_ids)
    generate_candidate_education(candidate_user_ids)
    generate_candidate_portfolio_projects(candidate_user_ids)
    
    # Get application IDs for notifications
    application_ids = []
    # We'll generate applications and capture IDs
    generate_applications(job_ids, candidate_user_ids)
    # For notifications, we'll use generated IDs (in real scenario, get from DB)
    
    generate_notifications(profile_ids, job_ids, [])
    generate_user_roles(profile_ids)
    
    print("\n✅ All CSV files generated successfully!")
    print("\n⚠️  CRITICAL: profiles.csv requires auth users to be created first!")
    print("   The profiles table references auth.users(id), so you must create")
    print("   auth users before importing profiles.csv")
    print("\n📋 Import Steps:")
    print("\n   STEP 1: Create Auth Users (choose one method):")
    print("   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("   Method A - Using Python script (Recommended):")
    print("     1. Install: pip install supabase")
    print("     2. Set env vars:")
    print("        export SUPABASE_URL='your-project-url'")
    print("        export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'")
    print("     3. Run: python create_auth_users.py")
    print("")
    print("   Method B - Manual SQL (Advanced):")
    print("     1. See create_auth_users.sql for SQL template")
    print("     2. Run in Supabase SQL Editor with admin access")
    print("")
    print("   STEP 2: Import CSV files in this EXACT ORDER:")
    print("   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("   1. profiles.csv          ⚠️  Requires auth users created first!")
    print("   2. companies.csv")
    print("   3. jobs.csv              ⚠️  MUST be imported before applications.csv")
    print("   4. candidate_profiles.csv")
    print("   5. candidate_experiences.csv")
    print("   6. candidate_education.csv")
    print("   7. candidate_portfolio_projects.csv")
    print("   8. applications.csv      ⚠️  Requires jobs.csv to be imported first!")
    print("   9. notifications.csv")
    print("   10. user_roles.csv")
    print("\n⚠️  IMPORTANT NOTES:")
    print("   - profiles.csv CANNOT be imported without auth users existing first")
    print("   - jobs.csv MUST be imported before applications.csv")
    print("   - profiles.csv MUST be imported before candidate_profiles.csv")
    print("   - If you get foreign key errors, check the import order above")
    print("\n💡 Tip: Import one file at a time in Supabase Table Editor")
    print("💡 Default password for sample users: SamplePassword123!")

if __name__ == "__main__":
    main()

