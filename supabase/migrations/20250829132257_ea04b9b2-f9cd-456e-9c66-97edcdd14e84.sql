-- إصلاح trigger الذي يسبب المشكلة
-- حذف الـ trigger المعطل وإعادة إنشاؤه بشكل صحيح

DROP FUNCTION IF EXISTS notify_wallet_changes() CASCADE;

-- إنشاء function محدث للإشعارات الفورية
CREATE OR REPLACE FUNCTION notify_wallet_changes()
RETURNS trigger AS $$
BEGIN
  -- إرسال إشعار للمحافظ فقط
  IF TG_TABLE_NAME = 'customer_wallets' THEN
    PERFORM pg_notify('wallet_update', json_build_object(
      'user_id', COALESCE(NEW.user_id, OLD.user_id),
      'balance', COALESCE(NEW.balance, OLD.balance),
      'action', TG_OP
    )::text);
  END IF;
  
  -- إرسال إشعار للمعاملات
  IF TG_TABLE_NAME = 'wallet_transactions' THEN
    PERFORM pg_notify('transaction_update', json_build_object(
      'user_id', COALESCE(NEW.user_id, OLD.user_id),
      'transaction_id', COALESCE(NEW.id, OLD.id),
      'action', TG_OP
    )::text);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- إضافة trigger للمحافظ
DROP TRIGGER IF EXISTS wallet_changes_trigger ON customer_wallets;
CREATE TRIGGER wallet_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON customer_wallets
  FOR EACH ROW EXECUTE FUNCTION notify_wallet_changes();

-- إضافة trigger للمعاملات
DROP TRIGGER IF EXISTS transaction_changes_trigger ON wallet_transactions;
CREATE TRIGGER transaction_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON wallet_transactions
  FOR EACH ROW EXECUTE FUNCTION notify_wallet_changes();

-- إضافة RLS policy للـ service role
CREATE POLICY "Service role can manage wallet transactions" 
ON wallet_transactions 
FOR ALL 
USING (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
)
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);