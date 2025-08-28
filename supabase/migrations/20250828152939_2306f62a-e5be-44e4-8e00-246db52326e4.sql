-- حذف الـ trigger أولاً
DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON public.payment_methods;

-- حذف الدالة
DROP FUNCTION IF EXISTS public.update_payment_methods_updated_at() CASCADE;

-- إعادة إنشاء الدالة مع إعدادات الأمان الصحيحة
CREATE OR REPLACE FUNCTION public.update_payment_methods_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- إعادة إنشاء الـ trigger
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_payment_methods_updated_at();