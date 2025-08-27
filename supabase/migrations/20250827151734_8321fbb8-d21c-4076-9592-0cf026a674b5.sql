-- إضافة حقول العميل و updated_at إلى جدول wallet_transactions
ALTER TABLE public.wallet_transactions 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- إضافة trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_wallet_transactions_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER wallet_transactions_updated_at
BEFORE UPDATE ON public.wallet_transactions
FOR EACH ROW
EXECUTE FUNCTION update_wallet_transactions_updated_at();

-- تحديث البيانات الموجودة بمعلومات العميل
UPDATE public.wallet_transactions 
SET 
  customer_name = COALESCE(customer_name, 'عميل محفظة - ' || reference_id),
  customer_email = COALESCE(customer_email, user_id::text),
  updated_at = now()
WHERE customer_name IS NULL OR customer_email IS NULL;