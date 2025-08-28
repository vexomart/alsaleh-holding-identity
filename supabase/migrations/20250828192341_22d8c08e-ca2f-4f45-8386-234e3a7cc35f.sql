-- إصلاح نظام أرقام الفواتير لتجنب التكرار
-- إزالة الفهرس القديم إذا كان موجود
DROP INDEX IF EXISTS idx_invoices_invoice_number_unique;

-- إنشاء فهرس فريد جديد لضمان عدم تكرار أرقام الفواتير
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_invoice_number_unique 
ON public.invoices(invoice_number);

-- تحديث دالة إنشاء أرقام الفواتير لتكون عشوائية وفريدة
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
      SELECT 1 FROM public.invoices 
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

-- تحديث دالة set_invoice_number لاستخدام الدالة الجديدة
CREATE OR REPLACE FUNCTION public.set_random_invoice_number()
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

-- إزالة المشغل القديم إذا كان موجود
DROP TRIGGER IF EXISTS trigger_set_invoice_number ON public.invoices;

-- إنشاء مشغل جديد للفواتير
CREATE TRIGGER trigger_set_random_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_random_invoice_number();

-- تحديث أرقام الفواتير الموجودة والمكررة
DO $$
DECLARE
  duplicate_invoice RECORD;
  new_number TEXT;
BEGIN
  -- البحث عن الفواتير المكررة وتحديثها
  FOR duplicate_invoice IN 
    SELECT id, invoice_number, ROW_NUMBER() OVER (PARTITION BY invoice_number ORDER BY created_at) as rn
    FROM public.invoices
    WHERE invoice_number IN (
      SELECT invoice_number 
      FROM public.invoices 
      GROUP BY invoice_number 
      HAVING COUNT(*) > 1
    )
  LOOP
    -- إذا لم تكن هذه أول فاتورة بنفس الرقم، قم بتغيير رقمها
    IF duplicate_invoice.rn > 1 THEN
      new_number := public.generate_random_invoice_number();
      
      UPDATE public.invoices 
      SET invoice_number = new_number
      WHERE id = duplicate_invoice.id;
      
      RAISE NOTICE 'Updated duplicate invoice % to new number %', duplicate_invoice.id, new_number;
    END IF;
  END LOOP;
END $$;

-- إنشاء دالة مساعدة للحصول على رقم فاتورة فريد من الواجهة الأمامية
CREATE OR REPLACE FUNCTION public.get_unique_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN public.generate_random_invoice_number();
END;
$$;

-- تحديث أي فاتورة لها رقم فارغ أو NULL
UPDATE public.invoices 
SET invoice_number = public.generate_random_invoice_number()
WHERE invoice_number IS NULL OR invoice_number = '';

-- إضافة فحص للتأكد من أن رقم الفاتورة ليس فارغ
ALTER TABLE public.invoices 
ADD CONSTRAINT check_invoice_number_not_empty 
CHECK (invoice_number IS NOT NULL AND LENGTH(invoice_number) > 0);