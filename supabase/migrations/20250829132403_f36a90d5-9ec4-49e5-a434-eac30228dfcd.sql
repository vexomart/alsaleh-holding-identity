-- حذف جميع الـ triggers المعطلة وإعادة البناء من جديد
DROP FUNCTION IF EXISTS update_wallet_balance() CASCADE;
DROP FUNCTION IF EXISTS create_user_wallet() CASCADE;

-- إنشاء function بسيط لتحديث أوقات التعديل
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- إضافة trigger لتحديث updated_at للمحافظ
DROP TRIGGER IF EXISTS update_customer_wallets_updated_at ON customer_wallets;
CREATE TRIGGER update_customer_wallets_updated_at
  BEFORE UPDATE ON customer_wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إضافة trigger لتحديث updated_at للمعاملات
DROP TRIGGER IF EXISTS update_wallet_transactions_updated_at ON wallet_transactions;
CREATE TRIGGER update_wallet_transactions_updated_at
  BEFORE UPDATE ON wallet_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();