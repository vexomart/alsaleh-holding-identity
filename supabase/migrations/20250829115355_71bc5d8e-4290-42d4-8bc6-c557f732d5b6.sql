-- إصلاح مشكلة trigger الذي يحاول الوصول لحقل status غير موجود
-- إعادة إنشاء الـ trigger المسؤول عن تحديث المحافظ

-- حذف الـ triggers الموجودة التي قد تسبب مشكلة
DROP TRIGGER IF EXISTS enhanced_payment_security_wallet_trigger ON customer_wallets;
DROP TRIGGER IF EXISTS wallet_balance_update_trigger ON customer_wallets;
DROP TRIGGER IF EXISTS update_wallet_updated_at ON customer_wallets;

-- إنشاء trigger بسيط للتحديث التلقائي لـ updated_at فقط
CREATE OR REPLACE FUNCTION update_wallet_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إضافة trigger للتحديث التلقائي للتاريخ
CREATE TRIGGER update_customer_wallets_updated_at
  BEFORE UPDATE ON customer_wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_updated_at();

-- التأكد من أن جدول customer_wallets لا يحتوي على حقل status
-- (في حال كان موجود، سنحذفه)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customer_wallets' 
    AND column_name = 'status'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.customer_wallets DROP COLUMN status;
  END IF;
END $$;