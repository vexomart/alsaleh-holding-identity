-- Atomic invoice number generation per year to prevent duplicates
-- 1) Create counters table (idempotent)
CREATE TABLE IF NOT EXISTS public.invoice_counters (
  year INTEGER PRIMARY KEY,
  counter INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Update trigger to maintain updated_at on counters
CREATE OR REPLACE FUNCTION public.update_invoice_counters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_invoice_counters_updated_at'
  ) THEN
    CREATE TRIGGER update_invoice_counters_updated_at
    BEFORE UPDATE ON public.invoice_counters
    FOR EACH ROW EXECUTE FUNCTION public.update_invoice_counters_updated_at();
  END IF;
END $$;

-- 3) Replace generator to use atomic counter per year
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  year_full INTEGER := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;
  year_suffix TEXT := TO_CHAR(CURRENT_DATE, 'YY');
  new_counter INTEGER;
BEGIN
  -- Ensure row exists for the current year
  INSERT INTO public.invoice_counters (year)
  VALUES (year_full)
  ON CONFLICT (year) DO NOTHING;

  -- Atomically increment and return the new counter
  UPDATE public.invoice_counters
  SET counter = counter + 1
  WHERE year = year_full
  RETURNING counter INTO new_counter;

  RETURN 'INV' || year_suffix || LPAD(new_counter::TEXT, 6, '0');
END;
$$;

-- 4) Ensure set_invoice_number function exists (idempotent definition)
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$;

-- 5) Ensure triggers exist on invoices table
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_invoice_number_before_insert'
  ) THEN
    CREATE TRIGGER set_invoice_number_before_insert
    BEFORE INSERT ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.set_invoice_number();
  END IF;
END $$;

-- Updated_at trigger on invoices (if function exists, reuse; else create minimal local one)
CREATE OR REPLACE FUNCTION public._update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_invoices_updated_at'
  ) THEN
    CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public._update_updated_at();
  END IF;
END $$;