-- إصلاح تحذير search_path للدالة
CREATE OR REPLACE FUNCTION update_wallet_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;