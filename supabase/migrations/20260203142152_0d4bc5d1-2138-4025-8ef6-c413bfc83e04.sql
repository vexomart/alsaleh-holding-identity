-- Create job_applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number TEXT UNIQUE DEFAULT 'JOB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  city TEXT,
  experience TEXT,
  education TEXT,
  cover_letter TEXT,
  cv_url TEXT,
  cv_file_name TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert job applications (public form)
CREATE POLICY "Anyone can submit job applications"
ON public.job_applications FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Only admins can view applications
CREATE POLICY "Admins can view job applications"
ON public.job_applications FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Policy: Only admins can update applications
CREATE POLICY "Admins can update job applications"
ON public.job_applications FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique application number
CREATE OR REPLACE FUNCTION public.generate_job_application_number()
RETURNS TRIGGER AS $$
DECLARE
  new_number TEXT;
  counter INTEGER := 1;
BEGIN
  LOOP
    new_number := 'JOB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.job_applications WHERE application_number = new_number);
    counter := counter + 1;
  END LOOP;
  NEW.application_number := new_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-generate application number
CREATE TRIGGER set_job_application_number
  BEFORE INSERT ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_job_application_number();