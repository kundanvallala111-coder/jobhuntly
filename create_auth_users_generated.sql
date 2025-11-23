-- SQL script to create auth users for sample data
-- Generated from profiles.csv
-- Run this in Supabase SQL Editor

-- IMPORTANT: This must be run as a Supabase admin
-- Password for all users: SamplePassword123!

-- User 1
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    'a8a807dc-e7d1-42c9-9f27-531cc67de39a'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user1@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 1", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    'a8a807dc-e7d1-42c9-9f27-531cc67de39a'::uuid,
    jsonb_build_object('sub', 'a8a807dc-e7d1-42c9-9f27-531cc67de39a'::text, 'email', 'user1@example.com'),
    'email',
    'user1@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = 'a8a807dc-e7d1-42c9-9f27-531cc67de39a'::uuid AND provider = 'email'
);

-- User 2
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '01c13383-95a7-4c77-bc3e-70f0b3ad91e3'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user2@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 2", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '01c13383-95a7-4c77-bc3e-70f0b3ad91e3'::uuid,
    jsonb_build_object('sub', '01c13383-95a7-4c77-bc3e-70f0b3ad91e3'::text, 'email', 'user2@example.com'),
    'email',
    'user2@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '01c13383-95a7-4c77-bc3e-70f0b3ad91e3'::uuid AND provider = 'email'
);

-- User 3
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '73225328-b886-481d-8ff9-d71103847fc2'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user3@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 3", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '73225328-b886-481d-8ff9-d71103847fc2'::uuid,
    jsonb_build_object('sub', '73225328-b886-481d-8ff9-d71103847fc2'::text, 'email', 'user3@example.com'),
    'email',
    'user3@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '73225328-b886-481d-8ff9-d71103847fc2'::uuid AND provider = 'email'
);

-- User 4
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '5df485b2-f60f-49bb-ae71-eb89ec71cbfa'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user4@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 4", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '5df485b2-f60f-49bb-ae71-eb89ec71cbfa'::uuid,
    jsonb_build_object('sub', '5df485b2-f60f-49bb-ae71-eb89ec71cbfa'::text, 'email', 'user4@example.com'),
    'email',
    'user4@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '5df485b2-f60f-49bb-ae71-eb89ec71cbfa'::uuid AND provider = 'email'
);

-- User 5
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '74f7edd6-6a84-4ccc-ac26-e7e1b042831b'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user5@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 5", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '74f7edd6-6a84-4ccc-ac26-e7e1b042831b'::uuid,
    jsonb_build_object('sub', '74f7edd6-6a84-4ccc-ac26-e7e1b042831b'::text, 'email', 'user5@example.com'),
    'email',
    'user5@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '74f7edd6-6a84-4ccc-ac26-e7e1b042831b'::uuid AND provider = 'email'
);

-- User 6
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    'e4ac0baa-63df-4e8d-89e8-5e93774bb1b2'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user6@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 6", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    'e4ac0baa-63df-4e8d-89e8-5e93774bb1b2'::uuid,
    jsonb_build_object('sub', 'e4ac0baa-63df-4e8d-89e8-5e93774bb1b2'::text, 'email', 'user6@example.com'),
    'email',
    'user6@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = 'e4ac0baa-63df-4e8d-89e8-5e93774bb1b2'::uuid AND provider = 'email'
);

-- User 7
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '27597932-83cb-4a4a-b445-b12d8acff9dd'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user7@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 7", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '27597932-83cb-4a4a-b445-b12d8acff9dd'::uuid,
    jsonb_build_object('sub', '27597932-83cb-4a4a-b445-b12d8acff9dd'::text, 'email', 'user7@example.com'),
    'email',
    'user7@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '27597932-83cb-4a4a-b445-b12d8acff9dd'::uuid AND provider = 'email'
);

-- User 8
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '54a462f9-3925-49a0-b65f-1ff73f44bf8d'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user8@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 8", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '54a462f9-3925-49a0-b65f-1ff73f44bf8d'::uuid,
    jsonb_build_object('sub', '54a462f9-3925-49a0-b65f-1ff73f44bf8d'::text, 'email', 'user8@example.com'),
    'email',
    'user8@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '54a462f9-3925-49a0-b65f-1ff73f44bf8d'::uuid AND provider = 'email'
);

-- User 9
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    'e122e604-4437-448d-a0de-f50434d94a93'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user9@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 9", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    'e122e604-4437-448d-a0de-f50434d94a93'::uuid,
    jsonb_build_object('sub', 'e122e604-4437-448d-a0de-f50434d94a93'::text, 'email', 'user9@example.com'),
    'email',
    'user9@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = 'e122e604-4437-448d-a0de-f50434d94a93'::uuid AND provider = 'email'
);

-- User 10
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '9d934cde-22f4-4f01-851f-d68318b4c289'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user10@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 10", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '9d934cde-22f4-4f01-851f-d68318b4c289'::uuid,
    jsonb_build_object('sub', '9d934cde-22f4-4f01-851f-d68318b4c289'::text, 'email', 'user10@example.com'),
    'email',
    'user10@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '9d934cde-22f4-4f01-851f-d68318b4c289'::uuid AND provider = 'email'
);

-- User 11
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    'b76e52cf-a4c4-413e-b57c-975c9b1011a2'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user11@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 11", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    'b76e52cf-a4c4-413e-b57c-975c9b1011a2'::uuid,
    jsonb_build_object('sub', 'b76e52cf-a4c4-413e-b57c-975c9b1011a2'::text, 'email', 'user11@example.com'),
    'email',
    'user11@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = 'b76e52cf-a4c4-413e-b57c-975c9b1011a2'::uuid AND provider = 'email'
);

-- User 12
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '8e1e7635-3442-4b85-b782-05df4bfb3fd6'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user12@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 12", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '8e1e7635-3442-4b85-b782-05df4bfb3fd6'::uuid,
    jsonb_build_object('sub', '8e1e7635-3442-4b85-b782-05df4bfb3fd6'::text, 'email', 'user12@example.com'),
    'email',
    'user12@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '8e1e7635-3442-4b85-b782-05df4bfb3fd6'::uuid AND provider = 'email'
);

-- User 13
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    'd14223a1-9ac0-4c50-bf81-eac65e92d429'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user13@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 13", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    'd14223a1-9ac0-4c50-bf81-eac65e92d429'::uuid,
    jsonb_build_object('sub', 'd14223a1-9ac0-4c50-bf81-eac65e92d429'::text, 'email', 'user13@example.com'),
    'email',
    'user13@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = 'd14223a1-9ac0-4c50-bf81-eac65e92d429'::uuid AND provider = 'email'
);

-- User 14
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    'f98d8b7d-7a5c-472c-9a13-e01cb7f12935'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user14@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 14", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    'f98d8b7d-7a5c-472c-9a13-e01cb7f12935'::uuid,
    jsonb_build_object('sub', 'f98d8b7d-7a5c-472c-9a13-e01cb7f12935'::text, 'email', 'user14@example.com'),
    'email',
    'user14@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = 'f98d8b7d-7a5c-472c-9a13-e01cb7f12935'::uuid AND provider = 'email'
);

-- User 15
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '495473d1-c42c-48af-b20b-784990bb9553'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user15@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 15", "role": "candidate"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '495473d1-c42c-48af-b20b-784990bb9553'::uuid,
    jsonb_build_object('sub', '495473d1-c42c-48af-b20b-784990bb9553'::text, 'email', 'user15@example.com'),
    'email',
    'user15@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '495473d1-c42c-48af-b20b-784990bb9553'::uuid AND provider = 'email'
);

-- User 16
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    'f0570eff-7a26-45c7-848e-fd41bea44cf3'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user16@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 16", "role": "recruiter"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    'f0570eff-7a26-45c7-848e-fd41bea44cf3'::uuid,
    jsonb_build_object('sub', 'f0570eff-7a26-45c7-848e-fd41bea44cf3'::text, 'email', 'user16@example.com'),
    'email',
    'user16@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = 'f0570eff-7a26-45c7-848e-fd41bea44cf3'::uuid AND provider = 'email'
);

-- User 17
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '4bb1f45e-792a-42e8-b98d-784e282f403c'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user17@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 17", "role": "recruiter"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '4bb1f45e-792a-42e8-b98d-784e282f403c'::uuid,
    jsonb_build_object('sub', '4bb1f45e-792a-42e8-b98d-784e282f403c'::text, 'email', 'user17@example.com'),
    'email',
    'user17@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '4bb1f45e-792a-42e8-b98d-784e282f403c'::uuid AND provider = 'email'
);

-- User 18
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    'acb3c641-8332-4474-af34-6bb239091962'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user18@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 18", "role": "recruiter"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    'acb3c641-8332-4474-af34-6bb239091962'::uuid,
    jsonb_build_object('sub', 'acb3c641-8332-4474-af34-6bb239091962'::text, 'email', 'user18@example.com'),
    'email',
    'user18@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = 'acb3c641-8332-4474-af34-6bb239091962'::uuid AND provider = 'email'
);

-- User 19
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '07a9a77c-9684-459b-8818-c734ed927dc1'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user19@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 19", "role": "recruiter"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '07a9a77c-9684-459b-8818-c734ed927dc1'::uuid,
    jsonb_build_object('sub', '07a9a77c-9684-459b-8818-c734ed927dc1'::text, 'email', 'user19@example.com'),
    'email',
    'user19@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '07a9a77c-9684-459b-8818-c734ed927dc1'::uuid AND provider = 'email'
);

-- User 20
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    '36613a4d-4609-4fdf-b0c5-f70e27ea1bdf'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user20@example.com',
    crypt('SamplePassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "User 20", "role": "recruiter"}'::jsonb,
    'authenticated',
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '36613a4d-4609-4fdf-b0c5-f70e27ea1bdf'::uuid,
    jsonb_build_object('sub', '36613a4d-4609-4fdf-b0c5-f70e27ea1bdf'::text, 'email', 'user20@example.com'),
    'email',
    'user20@example.com',
    now(),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = '36613a4d-4609-4fdf-b0c5-f70e27ea1bdf'::uuid AND provider = 'email'
);
