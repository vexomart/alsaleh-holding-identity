-- إصلاح تحذير الأمان للدالة
DROP FUNCTION IF EXISTS public.update_payment_methods_updated_at();

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