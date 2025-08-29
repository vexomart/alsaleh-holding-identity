-- إصلاح مشكلة الأمان: تحديد search_path للـ function
CREATE OR REPLACE FUNCTION update_wallet_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;