-- إصلاح search_path في جميع الدوال الأمنية المطلوبة
-- تحديث دالة generate_invoice_number الأصلية
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  year_full INTEGER := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;
  year_suffix TEXT := TO_CHAR(CURRENT_DATE, 'YY');
  new_counter INTEGER;
BEGIN
  -- Ensure row exists for the current year
  INSERT INTO invoice_counters (year)
  VALUES (year_full)
  ON CONFLICT (year) DO NOTHING;

  -- Atomically increment and return the new counter
  UPDATE invoice_counters
  SET counter = counter + 1
  WHERE year = year_full
  RETURNING counter INTO new_counter;

  RETURN 'INV' || year_suffix || LPAD(new_counter::TEXT, 6, '0');
END;
$$;

-- تحديث دالة set_invoice_number الأصلية
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$;

-- تحديث باقي الدوال الأمنية المهمة
CREATE OR REPLACE FUNCTION public.update_invoice_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_invoice_counters_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- التأكد من أن الدوال الجديدة تعمل بشكل صحيح
-- اختبار إنشاء رقم فاتورة عشوائي
DO $$
DECLARE
  test_number TEXT;
BEGIN
  test_number := generate_random_invoice_number();
  RAISE NOTICE 'Generated random invoice number: %', test_number;
END $$;