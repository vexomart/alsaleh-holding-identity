-- إصلاح تحذير search_path للدالة
CREATE OR REPLACE FUNCTION set_account_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    IF NEW.account_number IS NULL THEN
        NEW.account_number := generate_account_number();
    END IF;
    RETURN NEW;
END;
$$;