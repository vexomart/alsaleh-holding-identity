-- إصلاح التحذير الأمني: Function Search Path Mutable
-- تحديث دالة generate_random_invoice_number لإصلاح search_path
CREATE OR REPLACE FUNCTION public.generate_random_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  year_suffix TEXT;
  random_number INTEGER;
  invoice_num TEXT;
  attempts INTEGER := 0;
  max_attempts INTEGER := 50;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  LOOP
    attempts := attempts + 1;
    
    -- إنشاء رقم عشوائي من 6 أرقام
    random_number := floor(random() * 900000 + 100000)::integer;
    
    -- رقم الفاتورة: INV + سنة + رقم عشوائي
    invoice_num := 'INV' || year_suffix || random_number::text;
    
    -- التحقق من عدم وجود الرقم
    IF NOT EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoice_number = invoice_num
    ) THEN
      RETURN invoice_num;
    END IF;
    
    -- إذا فشلت المحاولات، استخدم timestamp فريد
    IF attempts >= max_attempts THEN
      invoice_num := 'INV' || year_suffix || 'T' || EXTRACT(EPOCH FROM NOW())::bigint::text;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN invoice_num;
END;
$$;

-- تحديث دالة auto_set_invoice_number لإصلاح search_path
CREATE OR REPLACE FUNCTION public.auto_set_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_random_invoice_number();
  END IF;
  RETURN NEW;
END;
$$;

-- تحديث دالة get_new_invoice_number لإصلاح search_path
CREATE OR REPLACE FUNCTION public.get_new_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN public.generate_random_invoice_number();
END;
$$;