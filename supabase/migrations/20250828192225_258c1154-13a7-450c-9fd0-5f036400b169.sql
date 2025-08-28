-- إصلاح التحذير الأمني: تثبيت search_path في جميع الدوال
-- تحديث دالة إنشاء أرقام الفواتير العشوائية
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
  max_attempts INTEGER := 100;
BEGIN
  -- الحصول على آخر رقمين من السنة الحالية
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  LOOP
    attempts := attempts + 1;
    
    -- إنشاء رقم عشوائي من 6 أرقام
    random_number := floor(random() * 900000 + 100000)::integer;
    
    -- تكوين رقم الفاتورة: INV + سنة + رقم عشوائي
    invoice_num := 'INV' || year_suffix || random_number::text;
    
    -- التحقق من عدم وجود الرقم مسبقاً
    IF NOT EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoice_number = invoice_num
    ) THEN
      RETURN invoice_num;
    END IF;
    
    -- إذا تم الوصول للحد الأقصى من المحاولات، استخدم timestamp
    IF attempts >= max_attempts THEN
      invoice_num := 'INV' || year_suffix || EXTRACT(EPOCH FROM NOW())::bigint::text;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN invoice_num;
END;
$$;

-- تحديث دالة المشغل (trigger function)
CREATE OR REPLACE FUNCTION public.set_random_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_random_invoice_number();
  END IF;
  RETURN NEW;
END;
$$;

-- تحديث الدالة المساعدة
CREATE OR REPLACE FUNCTION public.get_unique_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN generate_random_invoice_number();
END;
$$;