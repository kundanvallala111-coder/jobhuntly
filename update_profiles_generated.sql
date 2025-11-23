-- SQL script to UPDATE existing profiles with data from profiles.csv
-- Since profiles are auto-created by trigger, we UPDATE them instead of INSERT
-- Run this in Supabase SQL Editor AFTER creating auth users

UPDATE public.profiles
SET
    full_name = 'User 1',
    email = 'user1@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar1.jpg',
    phone = '+18602805814',
    location = 'Remote',
    company_id = NULL,
    updated_at = now()
WHERE id = 'a8a807dc-e7d1-42c9-9f27-531cc67de39a'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 2',
    email = 'user2@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar2.jpg',
    phone = '+13806646597',
    location = 'Seattle, WA',
    company_id = NULL,
    updated_at = now()
WHERE id = '01c13383-95a7-4c77-bc3e-70f0b3ad91e3'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 3',
    email = 'user3@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar3.jpg',
    phone = '+12864256957',
    location = 'Austin, TX',
    company_id = NULL,
    updated_at = now()
WHERE id = '73225328-b886-481d-8ff9-d71103847fc2'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 4',
    email = 'user4@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar4.jpg',
    phone = '+19749486587',
    location = 'Redmond, WA',
    company_id = NULL,
    updated_at = now()
WHERE id = '5df485b2-f60f-49bb-ae71-eb89ec71cbfa'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 5',
    email = 'user5@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar5.jpg',
    phone = '+14766242501',
    location = 'New York, NY',
    company_id = NULL,
    updated_at = now()
WHERE id = '74f7edd6-6a84-4ccc-ac26-e7e1b042831b'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 6',
    email = 'user6@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar6.jpg',
    phone = '+15314524907',
    location = 'Boston, MA',
    company_id = NULL,
    updated_at = now()
WHERE id = 'e4ac0baa-63df-4e8d-89e8-5e93774bb1b2'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 7',
    email = 'user7@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar7.jpg',
    phone = '+19373617059',
    location = 'Chicago, IL',
    company_id = NULL,
    updated_at = now()
WHERE id = '27597932-83cb-4a4a-b445-b12d8acff9dd'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 8',
    email = 'user8@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar8.jpg',
    phone = '+14938290615',
    location = 'Seattle, WA',
    company_id = NULL,
    updated_at = now()
WHERE id = '54a462f9-3925-49a0-b65f-1ff73f44bf8d'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 9',
    email = 'user9@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar9.jpg',
    phone = '+18876064462',
    location = 'Redmond, WA',
    company_id = NULL,
    updated_at = now()
WHERE id = 'e122e604-4437-448d-a0de-f50434d94a93'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 10',
    email = 'user10@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar10.jpg',
    phone = '+17980196236',
    location = 'Austin, TX',
    company_id = NULL,
    updated_at = now()
WHERE id = '9d934cde-22f4-4f01-851f-d68318b4c289'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 11',
    email = 'user11@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar11.jpg',
    phone = '+19230630974',
    location = 'San Francisco, CA',
    company_id = NULL,
    updated_at = now()
WHERE id = 'b76e52cf-a4c4-413e-b57c-975c9b1011a2'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 12',
    email = 'user12@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar12.jpg',
    phone = '+16810454738',
    location = 'San Francisco, CA',
    company_id = NULL,
    updated_at = now()
WHERE id = '8e1e7635-3442-4b85-b782-05df4bfb3fd6'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 13',
    email = 'user13@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar13.jpg',
    phone = '+17004525017',
    location = 'Austin, TX',
    company_id = NULL,
    updated_at = now()
WHERE id = 'd14223a1-9ac0-4c50-bf81-eac65e92d429'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 14',
    email = 'user14@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar14.jpg',
    phone = '+14168431270',
    location = 'New York, NY',
    company_id = NULL,
    updated_at = now()
WHERE id = 'f98d8b7d-7a5c-472c-9a13-e01cb7f12935'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 15',
    email = 'user15@example.com',
    role = 'candidate'::app_role,
    avatar_url = 'https://example.com/avatar15.jpg',
    phone = '+17679774137',
    location = 'Remote',
    company_id = NULL,
    updated_at = now()
WHERE id = '495473d1-c42c-48af-b20b-784990bb9553'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 16',
    email = 'user16@example.com',
    role = 'recruiter'::app_role,
    avatar_url = 'https://example.com/avatar16.jpg',
    phone = '+17599272248',
    location = 'Los Angeles, CA',
    company_id = NULL,
    updated_at = now()
WHERE id = 'f0570eff-7a26-45c7-848e-fd41bea44cf3'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 17',
    email = 'user17@example.com',
    role = 'recruiter'::app_role,
    avatar_url = 'https://example.com/avatar17.jpg',
    phone = '+17658841551',
    location = 'New York, NY',
    company_id = NULL,
    updated_at = now()
WHERE id = '4bb1f45e-792a-42e8-b98d-784e282f403c'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 18',
    email = 'user18@example.com',
    role = 'recruiter'::app_role,
    avatar_url = 'https://example.com/avatar18.jpg',
    phone = '+13014206312',
    location = 'Mountain View, CA',
    company_id = NULL,
    updated_at = now()
WHERE id = 'acb3c641-8332-4474-af34-6bb239091962'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 19',
    email = 'user19@example.com',
    role = 'recruiter'::app_role,
    avatar_url = 'https://example.com/avatar19.jpg',
    phone = '+18812209826',
    location = 'Mountain View, CA',
    company_id = NULL,
    updated_at = now()
WHERE id = '07a9a77c-9684-459b-8818-c734ed927dc1'::uuid;

UPDATE public.profiles
SET
    full_name = 'User 20',
    email = 'user20@example.com',
    role = 'recruiter'::app_role,
    avatar_url = 'https://example.com/avatar20.jpg',
    phone = '+12509367392',
    location = 'San Francisco, CA',
    company_id = NULL,
    updated_at = now()
WHERE id = '36613a4d-4609-4fdf-b0c5-f70e27ea1bdf'::uuid;
