-- إصلاح مشكلة الأمان: تحديد search_path للدوال
ALTER FUNCTION notify_wallet_changes() SET search_path = public;

-- تحديث المعاملات الموجودة التي لديها wallet_id فارغ
UPDATE wallet_transactions 
SET wallet_id = (
  SELECT id 
  FROM customer_wallets 
  WHERE customer_wallets.user_id = wallet_transactions.user_id 
  LIMIT 1
)
WHERE wallet_id IS NULL;

-- تحديث رصيد محفظة محمد الشهري
UPDATE customer_wallets 
SET balance = 9580.00,
    updated_at = now()
WHERE user_id = 'b3c46f41-c384-429a-92aa-14f11bb12f93';

-- إضافة معاملة إيداع حديثة لمحمد الشهري تعكس الرصيد الحالي
INSERT INTO wallet_transactions (
  user_id,
  wallet_id,
  transaction_type,
  amount,
  balance_before,
  balance_after,
  description,
  status,
  payment_method,
  payment_reference,
  reference_id,
  customer_name,
  customer_email,
  customer_phone,
  metadata
) VALUES (
  'b3c46f41-c384-429a-92aa-14f11bb12f93',
  (SELECT id FROM customer_wallets WHERE user_id = 'b3c46f41-c384-429a-92aa-14f11bb12f93'),
  'deposit',
  1050.00,
  8530.00,
  9580.00,
  'إيداع أرباح',
  'completed',
  'admin_deposit',
  'ADMIN_' || extract(epoch from now())::text,
  'ADMIN_DEP_' || extract(epoch from now())::text,
  'محمد الشهري',
  'fekrah4you@gmail.com',
  '0502463367',
  jsonb_build_object(
    'admin_deposit', true,
    'admin_notes', 'إيداع أرباح',
    'processed_at', now(),
    'processed_by', 'admin'
  )
);