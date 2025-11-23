-- SQL script to UPSERT jobs from jobs.csv
-- This will UPDATE existing records or INSERT new ones
-- Run this in Supabase SQL Editor

INSERT INTO jobs (
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
    '7fbb70c7-0f50-4dd5-8d33-6373e2ac9e37'::uuid,
    'Senior Software Engineer',
    'Join our team as a senior software engineer. We are looking for an experienced professional...',
    'Chicago, IL',
    'full-time',
    '$85,000 - $135,000',
    '{Java,Cybersecurity,Express,TensorFlow,Kubernetes,Perl,Ruby,Git}'::text[],
    '36613a4d-4609-4fdf-b0c5-f70e27ea1bdf'::uuid,
    NULL::uuid,
    'Apple',
    'draft',
    '2025-08-16 00:44:22+00'::timestamptz,
    '2025-10-25 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '2b6b2c59-a0cb-4b97-9e84-a6fb9705557a'::uuid,
    'Embedded Systems Engineer',
    'Join our team as a embedded systems engineer. We are looking for an experienced professional...',
    'New York, NY',
    'part-time',
    '$93,000 - $129,000',
    '{Penetration Testing,Firebase,React Native,GCP}'::text[],
    'acb3c641-8332-4474-af34-6bb239091962'::uuid,
    NULL::uuid,
    'Tesla',
    'draft',
    '2025-08-19 00:44:22+00'::timestamptz,
    '2025-10-31 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '19ac4624-3660-41dc-9c3e-6040df4b2dc3'::uuid,
    'Blockchain Developer',
    'Join our team as a blockchain developer. We are looking for an experienced professional...',
    'Redmond, WA',
    'full-time',
    '$131,000 - $202,000',
    '{CI/CD,GraphQL,Data Science,Agile,Natural Language Processing,Git,Azure,DevOps}'::text[],
    '36613a4d-4609-4fdf-b0c5-f70e27ea1bdf'::uuid,
    NULL::uuid,
    'Airbnb',
    'draft',
    '2025-10-31 00:44:22+00'::timestamptz,
    '2025-11-12 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '9cf07c9f-bf0c-4c5b-80d7-8345309ca4b8'::uuid,
    'Cloud Architect',
    'Join our team as a cloud architect. We are looking for an experienced professional...',
    'Remote',
    'contract',
    '$147,000 - $180,000',
    '{Neo4j,PyTorch,Deep Learning,Ruby on Rails}'::text[],
    'f0570eff-7a26-45c7-848e-fd41bea44cf3'::uuid,
    NULL::uuid,
    'Stripe',
    'active',
    '2025-08-20 00:44:22+00'::timestamptz,
    '2025-10-31 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '90821e55-8834-49ea-98f6-6c7f30a69227'::uuid,
    'MLOps Engineer',
    'Join our team as a mlops engineer. We are looking for an experienced professional...',
    'Boston, MA',
    'contract',
    '$83,000 - $128,000',
    '{DevOps,Webpack,Ruby on Rails,Node.js}'::text[],
    'acb3c641-8332-4474-af34-6bb239091962'::uuid,
    NULL::uuid,
    'Stripe',
    'active',
    '2025-09-02 00:44:22+00'::timestamptz,
    '2025-11-09 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '7df334b7-4096-4b11-8969-cb57a05e8827'::uuid,
    'Unreal Engine Developer',
    'Join our team as a unreal engine developer. We are looking for an experienced professional...',
    'Redmond, WA',
    'contract',
    '$136,000 - $189,000',
    '{SASS,Scrum,Azure,Ruby}'::text[],
    'acb3c641-8332-4474-af34-6bb239091962'::uuid,
    NULL::uuid,
    'Amazon',
    'active',
    '2025-10-01 00:44:22+00'::timestamptz,
    '2025-10-24 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    'ba02fee5-b9df-483d-8f7e-3f508e0daa3b'::uuid,
    'Web3 Developer',
    'Join our team as a web3 developer. We are looking for an experienced professional...',
    'Redmond, WA',
    'remote',
    '$121,000 - $168,000',
    '{SASS,Mobile Development,Kotlin,React Native,Ruby on Rails,GitHub Actions,Scala}'::text[],
    '36613a4d-4609-4fdf-b0c5-f70e27ea1bdf'::uuid,
    NULL::uuid,
    'Amazon',
    'draft',
    '2025-08-21 00:44:22+00'::timestamptz,
    '2025-11-13 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '1a800fca-6487-47a4-927c-ebf7b764ae67'::uuid,
    'UI Designer',
    'Join our team as a ui designer. We are looking for an experienced professional...',
    'New York, NY',
    'full-time',
    '$146,000 - $181,000',
    '{PostgreSQL,Tailwind CSS,React Native}'::text[],
    '07a9a77c-9684-459b-8818-c734ed927dc1'::uuid,
    NULL::uuid,
    'Stripe',
    'active',
    '2025-09-19 00:44:22+00'::timestamptz,
    '2025-10-28 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '91bad064-4ee6-4147-a14d-e309f74fe419'::uuid,
    'Product Manager',
    'Join our team as a product manager. We are looking for an experienced professional...',
    'Remote',
    'full-time',
    '$116,000 - $179,000',
    '{Solidity,Cassandra,Ionic,Spring Boot,Docker,Microservices,GCP,Node.js}'::text[],
    'acb3c641-8332-4474-af34-6bb239091962'::uuid,
    NULL::uuid,
    'Apple',
    'active',
    '2025-09-09 00:44:22+00'::timestamptz,
    '2025-10-29 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    'e06a9baa-d930-4012-9aaf-09397ca50487'::uuid,
    'Product Manager',
    'Join our team as a product manager. We are looking for an experienced professional...',
    'Redmond, WA',
    'full-time',
    '$108,000 - $148,000',
    '{Computer Vision,Flask,Ruby on Rails}'::text[],
    '4bb1f45e-792a-42e8-b98d-784e282f403c'::uuid,
    NULL::uuid,
    'Microsoft',
    'closed',
    '2025-11-08 00:44:22+00'::timestamptz,
    '2025-10-26 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '9e4ce0d9-1182-47d7-8dd1-fdaa98ce2b46'::uuid,
    'Security Architect',
    'Join our team as a security architect. We are looking for an experienced professional...',
    'Mountain View, CA',
    'part-time',
    '$138,000 - $196,000',
    '{Deep Learning,Gatsby,Flask,Bash,Penetration Testing}'::text[],
    'f0570eff-7a26-45c7-848e-fd41bea44cf3'::uuid,
    NULL::uuid,
    'Netflix',
    'closed',
    '2025-08-24 00:44:22+00'::timestamptz,
    '2025-10-21 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    'b5ec9f39-5bdd-4ddf-93cd-8939ce1f54f6'::uuid,
    'UX Designer',
    'Join our team as a ux designer. We are looking for an experienced professional...',
    'Seattle, WA',
    'remote',
    '$91,000 - $123,000',
    '{Webpack,Machine Learning,Kubernetes,Go,DynamoDB,PHP,PowerShell,Linux}'::text[],
    '36613a4d-4609-4fdf-b0c5-f70e27ea1bdf'::uuid,
    NULL::uuid,
    'Airbnb',
    'active',
    '2025-08-20 00:44:22+00'::timestamptz,
    '2025-11-02 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '591a0875-5c75-40aa-8352-d4420506237a'::uuid,
    'Game Developer',
    'Join our team as a game developer. We are looking for an experienced professional...',
    'Los Angeles, CA',
    'contract',
    '$128,000 - $179,000',
    '{Machine Learning,Terraform,Data Science}'::text[],
    '07a9a77c-9684-459b-8818-c734ed927dc1'::uuid,
    NULL::uuid,
    'Google',
    'active',
    '2025-09-30 00:44:22+00'::timestamptz,
    '2025-10-25 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '2c3c1300-18e0-4117-916c-81cdae59faf1'::uuid,
    'Security Engineer',
    'Join our team as a security engineer. We are looking for an experienced professional...',
    'New York, NY',
    'contract',
    '$105,000 - $179,000',
    '{Go,Scrum,GitHub Actions,GCP,JavaScript,R,Redis}'::text[],
    'f0570eff-7a26-45c7-848e-fd41bea44cf3'::uuid,
    NULL::uuid,
    'Stripe',
    'active',
    '2025-09-22 00:44:22+00'::timestamptz,
    '2025-11-05 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '988afff0-c68b-4bbb-bd85-81115d43267d'::uuid,
    'Blockchain Developer',
    'Join our team as a blockchain developer. We are looking for an experienced professional...',
    'New York, NY',
    'full-time',
    '$95,000 - $128,000',
    '{Machine Learning,Scala,Bash,PostgreSQL,iOS Development}'::text[],
    'acb3c641-8332-4474-af34-6bb239091962'::uuid,
    NULL::uuid,
    'Microsoft',
    'active',
    '2025-11-02 00:44:22+00'::timestamptz,
    '2025-10-21 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '4cb14299-ba09-4e3c-ac91-b829907db2b4'::uuid,
    'Full Stack Developer',
    'Join our team as a full stack developer. We are looking for an experienced professional...',
    'Chicago, IL',
    'remote',
    '$148,000 - $228,000',
    '{C#,Deep Learning,GitHub Actions,Flutter,JavaScript,React Native,Elasticsearch,AWS}'::text[],
    '36613a4d-4609-4fdf-b0c5-f70e27ea1bdf'::uuid,
    NULL::uuid,
    'Tesla',
    'active',
    '2025-09-29 00:44:22+00'::timestamptz,
    '2025-11-13 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '1b6f65df-8623-4139-9e0b-fb1052d8edf0'::uuid,
    'Game Developer',
    'Join our team as a game developer. We are looking for an experienced professional...',
    'Redmond, WA',
    'part-time',
    '$119,000 - $160,000',
    '{Flask,Python,Swift,Go,Ruby}'::text[],
    'acb3c641-8332-4474-af34-6bb239091962'::uuid,
    NULL::uuid,
    'Uber',
    'closed',
    '2025-10-07 00:44:22+00'::timestamptz,
    '2025-10-27 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '2ca96274-ed63-463d-afbe-e37e91bcbd92'::uuid,
    'NLP Engineer',
    'Join our team as a nlp engineer. We are looking for an experienced professional...',
    'Los Angeles, CA',
    'part-time',
    '$124,000 - $173,000',
    '{Jenkins,HTML,Svelte}'::text[],
    '36613a4d-4609-4fdf-b0c5-f70e27ea1bdf'::uuid,
    NULL::uuid,
    'Stripe',
    'draft',
    '2025-08-30 00:44:22+00'::timestamptz,
    '2025-10-18 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '5a914fdf-613a-4867-b762-6a463b88e01b'::uuid,
    'MLOps Engineer',
    'Join our team as a mlops engineer. We are looking for an experienced professional...',
    'Los Angeles, CA',
    'part-time',
    '$93,000 - $134,000',
    '{Neo4j,Mobile Development,Ethical Hacking,FastAPI,Spring Boot,ASP.NET,PostgreSQL,Flutter}'::text[],
    'f0570eff-7a26-45c7-848e-fd41bea44cf3'::uuid,
    NULL::uuid,
    'Apple',
    'active',
    '2025-10-28 00:44:22+00'::timestamptz,
    '2025-10-30 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '5a3ca30b-a79e-46db-9f8e-2c0667850397'::uuid,
    'Infrastructure Engineer',
    'Join our team as a infrastructure engineer. We are looking for an experienced professional...',
    'Boston, MA',
    'full-time',
    '$84,000 - $125,000',
    '{Deep Learning,Cassandra,PHP,TensorFlow,Svelte,SolidJS}'::text[],
    '07a9a77c-9684-459b-8818-c734ed927dc1'::uuid,
    NULL::uuid,
    'Netflix',
    'active',
    '2025-10-25 00:44:22+00'::timestamptz,
    '2025-10-29 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    'd9256368-7562-41de-87d0-d7fe68cd7c15'::uuid,
    'Machine Learning Engineer',
    'Join our team as a machine learning engineer. We are looking for an experienced professional...',
    'Seattle, WA',
    'full-time',
    '$147,000 - $208,000',
    '{SASS,Git,Vite,JavaScript,Express,Neo4j,Cassandra}'::text[],
    'f0570eff-7a26-45c7-848e-fd41bea44cf3'::uuid,
    NULL::uuid,
    'Stripe',
    'active',
    '2025-11-09 00:44:22+00'::timestamptz,
    '2025-10-30 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '4b04a960-9b06-41b8-b893-85f7c1b9e49b'::uuid,
    'Blockchain Developer',
    'Join our team as a blockchain developer. We are looking for an experienced professional...',
    'Los Angeles, CA',
    'full-time',
    '$109,000 - $172,000',
    '{Xamarin,GitHub Actions,Machine Learning,Deep Learning,SolidJS,AWS,GraphQL}'::text[],
    '4bb1f45e-792a-42e8-b98d-784e282f403c'::uuid,
    NULL::uuid,
    'Amazon',
    'active',
    '2025-11-11 00:44:22+00'::timestamptz,
    '2025-10-17 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '673f5e6c-2b45-447c-9fe6-746e9f701ffa'::uuid,
    'Robotics Engineer',
    'Join our team as a robotics engineer. We are looking for an experienced professional...',
    'Boston, MA',
    'remote',
    '$97,000 - $139,000',
    '{Ruby on Rails,Next.js,Cybersecurity,Neo4j,SolidJS}'::text[],
    '4bb1f45e-792a-42e8-b98d-784e282f403c'::uuid,
    NULL::uuid,
    'Microsoft',
    'draft',
    '2025-10-23 00:44:22+00'::timestamptz,
    '2025-10-22 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    'a24bc901-e1c1-4d9b-90de-31315b0d2f0f'::uuid,
    'Web3 Developer',
    'Join our team as a web3 developer. We are looking for an experienced professional...',
    'San Francisco, CA',
    'contract',
    '$148,000 - $189,000',
    '{Smart Contracts,Microservices,REST API}'::text[],
    'acb3c641-8332-4474-af34-6bb239091962'::uuid,
    NULL::uuid,
    'Stripe',
    'active',
    '2025-10-31 00:44:22+00'::timestamptz,
    '2025-11-04 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '5d484a3f-2ac6-41be-b271-69107081b427'::uuid,
    'Platform Engineer',
    'Join our team as a platform engineer. We are looking for an experienced professional...',
    'Chicago, IL',
    'contract',
    '$138,000 - $179,000',
    '{Agile,Ruby,Spring Boot}'::text[],
    '4bb1f45e-792a-42e8-b98d-784e282f403c'::uuid,
    NULL::uuid,
    'Amazon',
    'closed',
    '2025-08-23 00:44:22+00'::timestamptz,
    '2025-11-14 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    'd2e0e670-bcbf-4985-9876-eda459e5893a'::uuid,
    'MLOps Engineer',
    'Join our team as a mlops engineer. We are looking for an experienced professional...',
    'Chicago, IL',
    'contract',
    '$147,000 - $203,000',
    '{Vite,Elasticsearch,Git,Django,AWS,Kubernetes,Penetration Testing,Gatsby}'::text[],
    '4bb1f45e-792a-42e8-b98d-784e282f403c'::uuid,
    NULL::uuid,
    'Amazon',
    'active',
    '2025-08-21 00:44:22+00'::timestamptz,
    '2025-10-28 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '4cf39251-512a-4175-ae9c-f18969698b02'::uuid,
    'AI Engineer',
    'Join our team as a ai engineer. We are looking for an experienced professional...',
    'Austin, TX',
    'full-time',
    '$108,000 - $165,000',
    '{Kubernetes,Solidity,Elasticsearch,Flask,JavaScript}'::text[],
    '4bb1f45e-792a-42e8-b98d-784e282f403c'::uuid,
    NULL::uuid,
    'Apple',
    'active',
    '2025-10-05 00:44:22+00'::timestamptz,
    '2025-10-29 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '6cceee5d-eaab-426b-8049-1b2a52170a2a'::uuid,
    'QA Engineer',
    'Join our team as a qa engineer. We are looking for an experienced professional...',
    'Redmond, WA',
    'full-time',
    '$138,000 - $212,000',
    '{Terraform,Redis,Web3,Azure,Express,Kubernetes,JavaScript,Vite}'::text[],
    'f0570eff-7a26-45c7-848e-fd41bea44cf3'::uuid,
    NULL::uuid,
    'Netflix',
    'draft',
    '2025-10-12 00:44:22+00'::timestamptz,
    '2025-10-18 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '320887f5-9110-4c48-91ba-e4b79b470582'::uuid,
    'iOS Developer',
    'Join our team as a ios developer. We are looking for an experienced professional...',
    'Chicago, IL',
    'remote',
    '$139,000 - $200,000',
    '{Node.js,Angular,Solidity}'::text[],
    '4bb1f45e-792a-42e8-b98d-784e282f403c'::uuid,
    NULL::uuid,
    'Google',
    'closed',
    '2025-09-02 00:44:22+00'::timestamptz,
    '2025-10-18 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;

INSERT INTO jobs (
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
    '4604d378-e5af-45e0-b9e1-a1fcb6d552e7'::uuid,
    'Android Developer',
    'Join our team as a android developer. We are looking for an experienced professional...',
    'Seattle, WA',
    'remote',
    '$147,000 - $212,000',
    '{React Native,Bash,Elasticsearch,PyTorch}'::text[],
    '07a9a77c-9684-459b-8818-c734ed927dc1'::uuid,
    NULL::uuid,
    'Google',
    'active',
    '2025-10-11 00:44:22+00'::timestamptz,
    '2025-11-10 00:44:22+00'::timestamptz
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
    updated_at = EXCLUDED.updated_at;
