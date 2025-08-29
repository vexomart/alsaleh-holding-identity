-- إصلاح تحذيرات الأمان عبر تحديد search_path للدوال
CREATE OR REPLACE FUNCTION public.update_email_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;