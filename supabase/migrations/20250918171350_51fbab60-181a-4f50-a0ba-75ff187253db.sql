-- Create an atomic counter for job application numbers to avoid duplicates
-- 1) Counter table
CREATE TABLE IF NOT EXISTS public.application_counters (
  year INTEGER PRIMARY KEY,
  counter INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION public.update_application_counters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_application_counters_updated_at'
  ) THEN
    CREATE TRIGGER trg_application_counters_updated_at
    BEFORE UPDATE ON public.application_counters
    FOR EACH ROW EXECUTE FUNCTION public.update_application_counters_updated_at();
  END IF;
END $$;

-- 3) Replace generator to use atomic UPSERT on the counter table
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  year_full INTEGER := EXTRACT(YEAR FROM CURRENT_DATE)::int;
  year_suffix TEXT := TO_CHAR(CURRENT_DATE, 'YY');
  next_counter INTEGER;
  app_number TEXT;
BEGIN
  -- Atomically increment or create the yearly counter
  WITH upsert AS (
    INSERT INTO public.application_counters (year, counter)
    VALUES (year_full, 1)
    ON CONFLICT (year)
    DO UPDATE SET counter = public.application_counters.counter + 1
    RETURNING counter
  )
  SELECT counter INTO next_counter FROM upsert;

  -- Format: JOB + YY + 6-digit counter
  app_number := 'JOB' || year_suffix || LPAD(next_counter::TEXT, 6, '0');
  RETURN app_number;
END;
$$;

-- keep existing triggers like public.set_application_number() untouched