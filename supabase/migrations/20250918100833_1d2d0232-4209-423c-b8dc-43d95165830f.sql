-- Add new columns to job_applications table for enhanced functionality
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS application_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- Create index on application_number for fast lookups
CREATE INDEX IF NOT EXISTS idx_job_applications_application_number 
ON public.job_applications(application_number);

-- Create function to generate application numbers
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    app_number TEXT;
    counter INTEGER;
    year_suffix TEXT;
BEGIN
    -- Get current year last 2 digits
    year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    
    -- Get the next counter for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(application_number FROM 5 FOR 6) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.job_applications
    WHERE application_number LIKE 'JOB' || year_suffix || '%';
    
    -- Format as JOB + YY + 6-digit counter
    app_number := 'JOB' || year_suffix || LPAD(counter::TEXT, 6, '0');
    
    RETURN app_number;
END;
$$;

-- Create trigger to auto-generate application numbers
CREATE OR REPLACE FUNCTION public.set_application_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.application_number IS NULL OR NEW.application_number = '' THEN
        NEW.application_number := public.generate_application_number();
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS set_application_number_trigger ON public.job_applications;
CREATE TRIGGER set_application_number_trigger
    BEFORE INSERT ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.set_application_number();