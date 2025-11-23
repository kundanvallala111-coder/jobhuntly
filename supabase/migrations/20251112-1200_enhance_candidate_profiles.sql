-- Add professional snapshot fields to candidate_profiles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'candidate_profiles' 
                 AND column_name = 'current_role') THEN
    ALTER TABLE public.candidate_profiles ADD COLUMN "current_role" TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'candidate_profiles' 
                 AND column_name = 'current_company') THEN
    ALTER TABLE public.candidate_profiles ADD COLUMN current_company TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'candidate_profiles' 
                 AND column_name = 'industry') THEN
    ALTER TABLE public.candidate_profiles ADD COLUMN industry TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'candidate_profiles' 
                 AND column_name = 'preferred_job_titles') THEN
    ALTER TABLE public.candidate_profiles ADD COLUMN preferred_job_titles TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'candidate_profiles' 
                 AND column_name = 'preferred_employment_type') THEN
    ALTER TABLE public.candidate_profiles ADD COLUMN preferred_employment_type TEXT; -- full-time, part-time, internship, remote
  END IF;
  
  -- Add career preferences
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'candidate_profiles' 
                 AND column_name = 'expected_salary_range') THEN
    ALTER TABLE public.candidate_profiles ADD COLUMN expected_salary_range TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'candidate_profiles' 
                 AND column_name = 'notice_period') THEN
    ALTER TABLE public.candidate_profiles ADD COLUMN notice_period TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'candidate_profiles' 
                 AND column_name = 'open_to_relocation') THEN
    ALTER TABLE public.candidate_profiles ADD COLUMN open_to_relocation BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'candidate_profiles' 
                 AND column_name = 'remote_preference') THEN
    ALTER TABLE public.candidate_profiles ADD COLUMN remote_preference TEXT; -- onsite, hybrid, remote
  END IF;
  
  -- Add portfolio links
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'candidate_profiles' 
                 AND column_name = 'linkedin_url') THEN
    ALTER TABLE public.candidate_profiles ADD COLUMN linkedin_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'candidate_profiles' 
                 AND column_name = 'github_url') THEN
    ALTER TABLE public.candidate_profiles ADD COLUMN github_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'candidate_profiles' 
                 AND column_name = 'website_url') THEN
    ALTER TABLE public.candidate_profiles ADD COLUMN website_url TEXT;
  END IF;
END $$;

-- Create experiences table for structured work experience
CREATE TABLE IF NOT EXISTS public.candidate_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(user_id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE, -- NULL means current position
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create education table for structured education entries
CREATE TABLE IF NOT EXISTS public.candidate_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(user_id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  major TEXT,
  start_year INTEGER,
  graduation_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create portfolio projects table
CREATE TABLE IF NOT EXISTS public.candidate_portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.candidate_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_portfolio_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for experiences
CREATE POLICY "Users can view all experiences"
  ON public.candidate_experiences FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own experiences"
  ON public.candidate_experiences FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.candidate_profiles
      WHERE candidate_profiles.user_id = candidate_experiences.candidate_id
      AND candidate_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for education
CREATE POLICY "Users can view all education"
  ON public.candidate_education FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own education"
  ON public.candidate_education FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.candidate_profiles
      WHERE candidate_profiles.user_id = candidate_education.candidate_id
      AND candidate_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for portfolio projects
CREATE POLICY "Users can view all portfolio projects"
  ON public.candidate_portfolio_projects FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own portfolio projects"
  ON public.candidate_portfolio_projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.candidate_profiles
      WHERE candidate_profiles.user_id = candidate_portfolio_projects.candidate_id
      AND candidate_profiles.user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_experiences
  BEFORE UPDATE ON public.candidate_experiences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_education
  BEFORE UPDATE ON public.candidate_education
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_portfolio_projects
  BEFORE UPDATE ON public.candidate_portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();