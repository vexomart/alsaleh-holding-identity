-- إصلاح نظام أرقام الفواتير العشوائية الفريدة
-- إزالة المشغلات القديمة
DROP TRIGGER IF EXISTS trigger_set_invoice_number ON public.invoices;
DROP TRIGGER IF EXISTS trigger_set_random_invoice_number ON public.invoices;

-- إزالة الفهرس القديم
DROP INDEX IF EXISTS idx_invoices_invoice_number_unique;

-- إنشاء فهرس فريد جديد
CREATE UNIQUE INDEX idx_invoices_invoice_number_unique 
ON public.invoices(invoice_number);

-- دالة إنشاء أرقام فواتير عشوائية فريدة
CREATE OR REPLACE FUNCTION public.generate_random_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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

-- دالة المشغل للفواتير الجديدة
CREATE OR REPLACE FUNCTION public.auto_set_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_random_invoice_number();
  END IF;
  RETURN NEW;
END;
$$;

-- إنشاء المشغل الجديد
CREATE TRIGGER auto_invoice_number_trigger
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_set_invoice_number();

-- تحديث الفواتير المكررة الموجودة
WITH duplicate_invoices AS (
  SELECT id, invoice_number, 
         ROW_NUMBER() OVER (PARTITION BY invoice_number ORDER BY created_at) as rn
  FROM public.invoices
  WHERE invoice_number IN (
    SELECT invoice_number 
    FROM public.invoices 
    GROUP BY invoice_number 
    HAVING COUNT(*) > 1
  )
)
UPDATE public.invoices 
SET invoice_number = public.generate_random_invoice_number()
WHERE id IN (
  SELECT id FROM duplicate_invoices WHERE rn > 1
);

-- إضافة قيد للتأكد من أن رقم الفاتورة غير فارغ
ALTER TABLE public.invoices 
DROP CONSTRAINT IF EXISTS check_invoice_number_not_empty;

ALTER TABLE public.invoices 
ADD CONSTRAINT check_invoice_number_not_empty 
CHECK (invoice_number IS NOT NULL AND LENGTH(trim(invoice_number)) > 0);

-- تحديث أي فاتورة بها رقم فارغ
UPDATE public.invoices 
SET invoice_number = public.generate_random_invoice_number()
WHERE invoice_number IS NULL OR trim(invoice_number) = '';

-- دالة مساعدة للواجهة الأمامية
CREATE OR REPLACE FUNCTION public.get_new_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN public.generate_random_invoice_number();
END;
$$;