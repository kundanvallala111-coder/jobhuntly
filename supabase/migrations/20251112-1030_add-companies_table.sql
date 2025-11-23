-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  location TEXT,
  industry TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add company_id to jobs table
ALTER TABLE public.jobs 
ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Add company_id to profiles (to link recruiters to companies)
ALTER TABLE public.profiles 
ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Enable RLS for companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Companies RLS Policies
CREATE POLICY "Anyone can view companies"
  ON public.companies FOR SELECT
  USING (true);

CREATE POLICY "Recruiters can insert companies"
  ON public.companies FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'recruiter') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Company members can update their company"
  ON public.companies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.company_id = companies.id 
      AND profiles.id = auth.uid()
    )
  );

-- Update trigger for updated_at
CREATE TRIGGER set_updated_at_companies
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();