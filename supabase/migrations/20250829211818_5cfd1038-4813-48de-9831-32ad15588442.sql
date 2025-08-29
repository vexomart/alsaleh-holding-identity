-- حذف جميع المعاملات التجريبية المتبقية
DELETE FROM public.wallet_transactions 
WHERE user_id = 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- إعادة تأكيد تصفير الرصيد
UPDATE public.customer_wallets 
SET balance = 0.00, updated_at = NOW() 
WHERE user_id = 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- تسجيل العملية النهائية
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  risk_level,
  metadata
) VALUES (
  'data_cleanup_complete',
  'a60a2612-4ff4-441c-8dff-4444b29c8802',
  'cleanup_all_test_transactions',
  'low',
  jsonb_build_object(
    'description', 'تم حذف جميع المعاملات التجريبية وتصفير النظام',
    'timestamp', NOW(),
    'action_type', 'final_cleanup'
  )
);