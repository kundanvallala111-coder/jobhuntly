-- Create enum for user roles
CREATE TYPE app_role AS ENUM ('candidate', 'recruiter', 'admin');

-- Create enum for application status
CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'interview', 'accepted', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'candidate',
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create candidate_profiles table for candidate-specific data
CREATE TABLE public.candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER,
  resume_url TEXT,
  bio TEXT,
  education TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table (security best practice - separate from profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL, -- full-time, part-time, contract, remote
  salary_range TEXT,
  required_skills TEXT[] DEFAULT '{}',
  posted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, closed, draft
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  cover_letter TEXT,
  feedback TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- application_update, job_posted, interview_scheduled
  related_id UUID, -- can reference job_id or application_id
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Candidate Profiles RLS Policies
CREATE POLICY "Anyone can view candidate profiles"
  ON public.candidate_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own candidate profile"
  ON public.candidate_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own candidate profile"
  ON public.candidate_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Roles RLS Policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Jobs RLS Policies
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (status = 'active' OR posted_by = auth.uid());

CREATE POLICY "Recruiters can insert jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'recruiter') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Recruiters can update their own jobs"
  ON public.jobs FOR UPDATE
  USING (posted_by = auth.uid());

CREATE POLICY "Recruiters can delete their own jobs"
  ON public.jobs FOR DELETE
  USING (posted_by = auth.uid());

-- Applications RLS Policies
CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT
  USING (
    candidate_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = applications.job_id 
      AND jobs.posted_by = auth.uid()
    )
  );

CREATE POLICY "Candidates can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (candidate_id = auth.uid() AND public.has_role(auth.uid(), 'candidate'));

CREATE POLICY "Candidates can update their own applications"
  ON public.applications FOR UPDATE
  USING (candidate_id = auth.uid());

CREATE POLICY "Recruiters can update applications for their jobs"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = applications.job_id 
      AND jobs.posted_by = auth.uid()
    )
  );

-- Notifications RLS Policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'candidate')
  );
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'candidate')
  );
  
  -- If candidate, create candidate profile
  IF COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'candidate') = 'candidate' THEN
    INSERT INTO public.candidate_profiles (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_candidate_profiles
  BEFORE UPDATE ON public.candidate_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_jobs
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_applications
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();