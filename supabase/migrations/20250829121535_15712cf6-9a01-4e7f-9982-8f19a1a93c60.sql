-- تفعيل Realtime للجداول المطلوبة
ALTER TABLE customer_wallets REPLICA IDENTITY FULL;
ALTER TABLE wallet_transactions REPLICA IDENTITY FULL;

-- إضافة الجداول إلى publication
ALTER PUBLICATION supabase_realtime ADD TABLE customer_wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE wallet_transactions;

-- إنشاء trigger لإرسال إشعارات فورية
CREATE OR REPLACE FUNCTION notify_wallet_changes()
RETURNS trigger AS $$
BEGIN
  -- إرسال إشعار فوري عند تغيير المحفظة
  PERFORM pg_notify('wallet_update', json_build_object(
    'user_id', COALESCE(NEW.user_id, OLD.user_id),
    'balance', COALESCE(NEW.balance, OLD.balance),
    'action', TG_OP
  )::text);
  
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