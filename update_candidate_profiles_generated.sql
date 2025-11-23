-- SQL script to UPDATE existing candidate_profiles
-- Profiles are auto-created by trigger, so we UPDATE instead of INSERT

UPDATE public.candidate_profiles
SET
    skills = '{Machine Learning,Git,Cassandra,Linux,Microservices,Bash,Terraform,Remix,Ethical Hacking,GitLab CI,CSS,MySQL}'::text[],
    experience_years = 14,
    resume_url = 'https://example.com/resumes/a8a807dc-e7d1-42c9-9f27-531cc67de39a.pdf',
    bio = 'Experienced professional with 4 years in the industry...',
    education = 'Bachelor of Science in Network Engineering in Mathematics',
    "current_role" = 'Product Manager',
    current_company = 'Meta',
    industry = 'E-commerce',
    preferred_job_titles = '{Frontend Developer,Full Stack Developer,UX Designer}'::text[],
    preferred_employment_type = 'full-time',
    expected_salary_range = '$161k - $264k',
    notice_period = '1 month',
    open_to_relocation = true,
    remote_preference = 'remote',
    linkedin_url = 'https://linkedin.com/in/user871',
    github_url = 'https://github.com/user627',
    website_url = 'https://user143.dev',
    updated_at = now()
WHERE user_id = 'a8a807dc-e7d1-42c9-9f27-531cc67de39a'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{Deep Learning,MongoDB,Scala,PowerShell,R,Linux,Firebase,ASP.NET}'::text[],
    experience_years = 12,
    resume_url = 'https://example.com/resumes/01c13383-95a7-4c77-bc3e-70f0b3ad91e3.pdf',
    bio = 'Experienced professional with 4 years in the industry...',
    education = 'Associate Degree in Software Engineering',
    "current_role" = 'DevOps Engineer',
    current_company = 'Uber',
    industry = 'Finance',
    preferred_job_titles = '{DevOps Engineer,UX Designer}'::text[],
    preferred_employment_type = 'full-time',
    expected_salary_range = '$139k - $288k',
    notice_period = '1 month',
    open_to_relocation = true,
    remote_preference = 'hybrid',
    linkedin_url = 'https://linkedin.com/in/user324',
    github_url = 'https://github.com/user856',
    website_url = 'https://user193.dev',
    updated_at = now()
WHERE user_id = '01c13383-95a7-4c77-bc3e-70f0b3ad91e3'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{PostgreSQL,Computer Vision,REST API,SASS,Blockchain}'::text[],
    experience_years = 7,
    resume_url = 'https://example.com/resumes/73225328-b886-481d-8ff9-d71103847fc2.pdf',
    bio = 'Experienced professional with 12 years in the industry...',
    education = 'Master of Science in Artificial Intelligence in Mathematics',
    "current_role" = 'Security Architect',
    current_company = 'IBM',
    industry = 'Healthcare',
    preferred_job_titles = '{DevOps Engineer}'::text[],
    preferred_employment_type = 'contract',
    expected_salary_range = '$179k - $240k',
    notice_period = '1 month',
    open_to_relocation = false,
    remote_preference = 'onsite',
    linkedin_url = 'https://linkedin.com/in/user394',
    github_url = 'https://github.com/user296',
    website_url = 'https://user648.dev',
    updated_at = now()
WHERE user_id = '73225328-b886-481d-8ff9-d71103847fc2'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{Blockchain,PostgreSQL,Azure,Cybersecurity,Firebase,Android Development,DynamoDB,Xamarin,Flutter}'::text[],
    experience_years = 8,
    resume_url = 'https://example.com/resumes/5df485b2-f60f-49bb-ae71-eb89ec71cbfa.pdf',
    bio = 'Experienced professional with 8 years in the industry...',
    education = 'Master of Science in Data Science in Software Engineering',
    "current_role" = 'Web3 Developer',
    current_company = 'Meta',
    industry = 'Technology',
    preferred_job_titles = '{Frontend Developer,DevOps Engineer}'::text[],
    preferred_employment_type = 'part-time',
    expected_salary_range = '$112k - $279k',
    notice_period = 'Immediate',
    open_to_relocation = false,
    remote_preference = 'remote',
    linkedin_url = 'https://linkedin.com/in/user917',
    github_url = 'https://github.com/user603',
    website_url = 'https://user29.dev',
    updated_at = now()
WHERE user_id = '5df485b2-f60f-49bb-ae71-eb89ec71cbfa'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{Ruby on Rails,Computer Vision,C#,Kotlin,Agile}'::text[],
    experience_years = 7,
    resume_url = 'https://example.com/resumes/74f7edd6-6a84-4ccc-ac26-e7e1b042831b.pdf',
    bio = 'Experienced professional with 5 years in the industry...',
    education = 'Master of Science in Computer Engineering in Mathematics',
    "current_role" = 'Backend Developer',
    current_company = 'Uber',
    industry = 'Healthcare',
    preferred_job_titles = '{DevOps Engineer,Product Manager,Senior Software Engineer}'::text[],
    preferred_employment_type = 'contract',
    expected_salary_range = '$140k - $262k',
    notice_period = '1 month',
    open_to_relocation = false,
    remote_preference = 'hybrid',
    linkedin_url = 'https://linkedin.com/in/user27',
    github_url = 'https://github.com/user59',
    website_url = 'https://user92.dev',
    updated_at = now()
WHERE user_id = '74f7edd6-6a84-4ccc-ac26-e7e1b042831b'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{Data Science,MongoDB,Machine Learning,Perl,Python,Computer Vision,ASP.NET,Natural Language Processing,Svelte}'::text[],
    experience_years = 8,
    resume_url = 'https://example.com/resumes/e4ac0baa-63df-4e8d-89e8-5e93774bb1b2.pdf',
    bio = 'Experienced professional with 8 years in the industry...',
    education = 'Bachelor of Science in Software Engineering in Computer Science',
    "current_role" = 'Quantum Computing Engineer',
    current_company = 'Cisco',
    industry = 'Finance',
    preferred_job_titles = '{Senior Software Engineer}'::text[],
    preferred_employment_type = 'contract',
    expected_salary_range = '$92k - $220k',
    notice_period = '2 weeks',
    open_to_relocation = true,
    remote_preference = 'onsite',
    linkedin_url = 'https://linkedin.com/in/user247',
    github_url = 'https://github.com/user11',
    website_url = 'https://user854.dev',
    updated_at = now()
WHERE user_id = 'e4ac0baa-63df-4e8d-89e8-5e93774bb1b2'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{Cassandra,Scrum,System Design,PostgreSQL,ASP.NET,Android Development,Machine Learning}'::text[],
    experience_years = 7,
    resume_url = 'https://example.com/resumes/27597932-83cb-4a4a-b445-b12d8acff9dd.pdf',
    bio = 'Experienced professional with 12 years in the industry...',
    education = 'Bachelor of Science in Data Science in Software Engineering',
    "current_role" = 'AI Engineer',
    current_company = 'Airbnb',
    industry = 'Healthcare',
    preferred_job_titles = '{Machine Learning Engineer}'::text[],
    preferred_employment_type = 'part-time',
    expected_salary_range = '$91k - $202k',
    notice_period = '2 weeks',
    open_to_relocation = true,
    remote_preference = 'onsite',
    linkedin_url = 'https://linkedin.com/in/user643',
    github_url = 'https://github.com/user687',
    website_url = 'https://user874.dev',
    updated_at = now()
WHERE user_id = '27597932-83cb-4a4a-b445-b12d8acff9dd'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{DevOps,TypeScript,TensorFlow,PHP,C#,Elasticsearch}'::text[],
    experience_years = 13,
    resume_url = 'https://example.com/resumes/54a462f9-3925-49a0-b65f-1ff73f44bf8d.pdf',
    bio = 'Experienced professional with 8 years in the industry...',
    education = 'Bachelor of Science in Artificial Intelligence in Physics',
    "current_role" = 'Platform Engineer',
    current_company = 'Tesla',
    industry = 'E-commerce',
    preferred_job_titles = '{Backend Developer}'::text[],
    preferred_employment_type = 'full-time',
    expected_salary_range = '$93k - $204k',
    notice_period = '1 month',
    open_to_relocation = true,
    remote_preference = 'onsite',
    linkedin_url = 'https://linkedin.com/in/user760',
    github_url = 'https://github.com/user918',
    website_url = 'https://user517.dev',
    updated_at = now()
WHERE user_id = '54a462f9-3925-49a0-b65f-1ff73f44bf8d'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{Express,Angular,Web3,ASP.NET,GitLab CI,Cassandra,GCP,Scala,REST API,Linux}'::text[],
    experience_years = 3,
    resume_url = 'https://example.com/resumes/e122e604-4437-448d-a0de-f50434d94a93.pdf',
    bio = 'Experienced professional with 11 years in the industry...',
    education = 'Doctor of Philosophy in Data Science',
    "current_role" = 'Product Manager',
    current_company = 'Stripe',
    industry = 'Healthcare',
    preferred_job_titles = '{Full Stack Developer}'::text[],
    preferred_employment_type = 'part-time',
    expected_salary_range = '$90k - $259k',
    notice_period = '1 month',
    open_to_relocation = true,
    remote_preference = 'onsite',
    linkedin_url = 'https://linkedin.com/in/user864',
    github_url = 'https://github.com/user219',
    website_url = 'https://user964.dev',
    updated_at = now()
WHERE user_id = 'e122e604-4437-448d-a0de-f50434d94a93'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{MATLAB,Redis,SASS,PostgreSQL,MySQL,Next.js,Solidity,Penetration Testing,Ethical Hacking}'::text[],
    experience_years = 3,
    resume_url = 'https://example.com/resumes/9d934cde-22f4-4f01-851f-d68318b4c289.pdf',
    bio = 'Experienced professional with 14 years in the industry...',
    education = 'Master of Science in Information Technology in Information Systems',
    "current_role" = 'Cloud Architect',
    current_company = 'VMware',
    industry = 'Technology',
    preferred_job_titles = '{Full Stack Developer}'::text[],
    preferred_employment_type = 'contract',
    expected_salary_range = '$140k - $221k',
    notice_period = 'Immediate',
    open_to_relocation = true,
    remote_preference = 'hybrid',
    linkedin_url = 'https://linkedin.com/in/user941',
    github_url = 'https://github.com/user71',
    website_url = 'https://user786.dev',
    updated_at = now()
WHERE user_id = '9d934cde-22f4-4f01-851f-d68318b4c289'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{Blockchain,Ansible,MySQL,Mobile Development,Machine Learning,React Native,Computer Vision,Natural Language Processing}'::text[],
    experience_years = 14,
    resume_url = 'https://example.com/resumes/b76e52cf-a4c4-413e-b57c-975c9b1011a2.pdf',
    bio = 'Experienced professional with 5 years in the industry...',
    education = 'Bachelor of Science in Data Science in Mathematics',
    "current_role" = 'Embedded Systems Engineer',
    current_company = 'Adobe',
    industry = 'Technology',
    preferred_job_titles = '{UX Designer}'::text[],
    preferred_employment_type = 'full-time',
    expected_salary_range = '$155k - $270k',
    notice_period = '1 month',
    open_to_relocation = true,
    remote_preference = 'hybrid',
    linkedin_url = 'https://linkedin.com/in/user748',
    github_url = 'https://github.com/user683',
    website_url = 'https://user141.dev',
    updated_at = now()
WHERE user_id = 'b76e52cf-a4c4-413e-b57c-975c9b1011a2'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{Vite,FastAPI,Swift,TensorFlow,Kubernetes}'::text[],
    experience_years = 5,
    resume_url = 'https://example.com/resumes/8e1e7635-3442-4b85-b782-05df4bfb3fd6.pdf',
    bio = 'Experienced professional with 10 years in the industry...',
    education = 'Bachelor of Science in Artificial Intelligence in Computer Science',
    "current_role" = 'Quantum Computing Engineer',
    current_company = 'Intel',
    industry = 'Healthcare',
    preferred_job_titles = '{DevOps Engineer,Senior Software Engineer}'::text[],
    preferred_employment_type = 'full-time',
    expected_salary_range = '$175k - $238k',
    notice_period = 'Immediate',
    open_to_relocation = false,
    remote_preference = 'remote',
    linkedin_url = 'https://linkedin.com/in/user994',
    github_url = 'https://github.com/user98',
    website_url = 'https://user495.dev',
    updated_at = now()
WHERE user_id = '8e1e7635-3442-4b85-b782-05df4bfb3fd6'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{TypeScript,Solidity,Vite,PostgreSQL,SASS,Go,Vue.js,PowerShell,Bash}'::text[],
    experience_years = 7,
    resume_url = 'https://example.com/resumes/d14223a1-9ac0-4c50-bf81-eac65e92d429.pdf',
    bio = 'Experienced professional with 8 years in the industry...',
    education = 'Bachelor of Science in Information Technology in Electrical Engineering',
    "current_role" = 'AI Engineer',
    current_company = 'Google',
    industry = 'Technology',
    preferred_job_titles = '{UX Designer,Full Stack Developer,Software Engineer}'::text[],
    preferred_employment_type = 'contract',
    expected_salary_range = '$151k - $282k',
    notice_period = '2 weeks',
    open_to_relocation = true,
    remote_preference = 'remote',
    linkedin_url = 'https://linkedin.com/in/user67',
    github_url = 'https://github.com/user933',
    website_url = 'https://user486.dev',
    updated_at = now()
WHERE user_id = 'd14223a1-9ac0-4c50-bf81-eac65e92d429'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{Docker,Kotlin,Perl,REST API,R,PostgreSQL,CSS,DevOps,Flask,Rust}'::text[],
    experience_years = 5,
    resume_url = 'https://example.com/resumes/f98d8b7d-7a5c-472c-9a13-e01cb7f12935.pdf',
    bio = 'Experienced professional with 13 years in the industry...',
    education = 'Master of Science in Data Science in Physics',
    "current_role" = 'Technical Lead',
    current_company = 'VMware',
    industry = 'Finance',
    preferred_job_titles = '{Frontend Developer}'::text[],
    preferred_employment_type = 'part-time',
    expected_salary_range = '$84k - $246k',
    notice_period = '1 month',
    open_to_relocation = false,
    remote_preference = 'hybrid',
    linkedin_url = 'https://linkedin.com/in/user940',
    github_url = 'https://github.com/user184',
    website_url = 'https://user628.dev',
    updated_at = now()
WHERE user_id = 'f98d8b7d-7a5c-472c-9a13-e01cb7f12935'::uuid;

UPDATE public.candidate_profiles
SET
    skills = '{C#,Smart Contracts,Ethical Hacking,Docker,Android Development,Nuxt.js,Scrum}'::text[],
    experience_years = 2,
    resume_url = 'https://example.com/resumes/495473d1-c42c-48af-b20b-784990bb9553.pdf',
    bio = 'Experienced professional with 5 years in the industry...',
    education = 'Master of Science in Information Systems in Software Engineering',
    "current_role" = 'Security Engineer',
    current_company = 'Intel',
    industry = 'E-commerce',
    preferred_job_titles = '{Machine Learning Engineer}'::text[],
    preferred_employment_type = 'part-time',
    expected_salary_range = '$159k - $249k',
    notice_period = 'Immediate',
    open_to_relocation = false,
    remote_preference = 'hybrid',
    linkedin_url = 'https://linkedin.com/in/user792',
    github_url = 'https://github.com/user124',
    website_url = 'https://user850.dev',
    updated_at = now()
WHERE user_id = '495473d1-c42c-48af-b20b-784990bb9553'::uuid;
