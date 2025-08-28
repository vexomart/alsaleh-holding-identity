-- إصلاح مشاكل نظام الفواتير

-- حذف الفهارس المكررة إن وجدت
DROP INDEX IF EXISTS invoices_invoice_number_key;
DROP INDEX IF EXISTS idx_invoices_invoice_number;

-- إنشاء فهرس فريد جديد لأرقام الفواتير
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_invoice_number_unique 
ON public.invoices(invoice_number) 
WHERE invoice_number IS NOT NULL AND invoice_number != '';

-- التأكد من عدم وجود فواتير مكررة
WITH duplicate_invoices AS (
  SELECT invoice_number, COUNT(*) as count
  FROM public.invoices 
  WHERE invoice_number IS NOT NULL AND invoice_number != ''
  GROUP BY invoice_number 
  HAVING COUNT(*) > 1
)
UPDATE public.invoices 
SET invoice_number = invoice_number || '-' || id::text
WHERE invoice_number IN (SELECT invoice_number FROM duplicate_invoices)
AND id NOT IN (
  SELECT MIN(id) 
  FROM public.invoices 
  WHERE invoice_number IN (SELECT invoice_number FROM duplicate_invoices)
  GROUP BY invoice_number
);

-- تحديث trigger لإنشاء رقم الفاتورة
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_invoice_number();
    
    -- التأكد من عدم وجود رقم مكرر
    WHILE EXISTS(SELECT 1 FROM public.invoices WHERE invoice_number = NEW.invoice_number AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
      NEW.invoice_number := public.generate_invoice_number();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

-- التأكد من وجود trigger
DROP TRIGGER IF EXISTS set_invoice_number_trigger ON public.invoices;
CREATE TRIGGER set_invoice_number_trigger
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_invoice_number();

-- تحديث دالة إنشاء رقم الفاتورة لتجنب التكرار
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  year_full INTEGER := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;
  year_suffix TEXT := TO_CHAR(CURRENT_DATE, 'YY');
  new_counter INTEGER;
  invoice_number TEXT;
  max_attempts INTEGER := 10;
  attempt_count INTEGER := 0;
BEGIN
  -- التأكد من وجود سجل للسنة الحالية
  INSERT INTO public.invoice_counters (year, counter)
  VALUES (year_full, 0)
  ON CONFLICT (year) DO NOTHING;

  LOOP
    -- زيادة العداد والحصول على القيمة الجديدة
    UPDATE public.invoice_counters
    SET counter = counter + 1
    WHERE year = year_full
    RETURNING counter INTO new_counter;

    -- إنشاء رقم الفاتورة
    invoice_number := 'INV' || year_suffix || LPAD(new_counter::TEXT, 6, '0');
    
    -- التحقق من عدم وجود رقم مكرر
    IF NOT EXISTS(SELECT 1 FROM public.invoices WHERE invoice_number = invoice_number) THEN
      RETURN invoice_number;
    END IF;
    
    -- منع حلقة لا نهائية
    attempt_count := attempt_count + 1;
    IF attempt_count >= max_attempts THEN
      -- إضافة طابع زمني لضمان الفرادة
      invoice_number := 'INV' || year_suffix || LPAD(new_counter::TEXT, 6, '0') || '-' || EXTRACT(EPOCH FROM now())::bigint::text;
      RETURN invoice_number;
    END IF;
  END LOOP;
END;
$$;