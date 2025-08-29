-- حذف جميع البيانات الوهمية من قاعدة البيانات

-- حذف معاملات المحافظ الوهمية
DELETE FROM public.wallet_transactions 
WHERE user_id != 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- حذف المحافظ الوهمية (عدا محفظة الأدمين الحقيقي)
DELETE FROM public.customer_wallets 
WHERE user_id != 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- حذف الملفات الشخصية الوهمية (عدا الأدمين الحقيقي)
DELETE FROM public.profiles 
WHERE user_id != 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- حذف العقود الوهمية (إن وُجدت)
DELETE FROM public.contracts 
WHERE user_id != 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- حذف الفواتير الوهمية (إن وُجدت)
DELETE FROM public.invoices 
WHERE user_id != 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- حذف معاملات الدفع الوهمية (إن وُجدت)
DELETE FROM public.payment_transactions 
WHERE user_id != 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- حذف التذاكر الوهمية (إن وُجدت)
DELETE FROM public.tickets 
WHERE user_id != 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- حذف الاشتراكات الوهمية (إن وُجدت)
DELETE FROM public.subscriptions 
WHERE user_id != 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- حذف أدوار المستخدمين الوهمية (عدا الأدمين الحقيقي)
DELETE FROM public.user_roles 
WHERE user_id != 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- تنظيف سجلات المراجعة القديمة والوهمية
DELETE FROM public.security_audit_logs 
WHERE user_id != 'a60a2612-4ff4-441c-8dff-4444b29c8802' 
  AND created_at < NOW() - INTERVAL '7 days';

-- تنظيف سجلات النشاط الوهمية
DELETE FROM public.user_activity_logs 
WHERE user_id != 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- حذف العملاء الوهميين (إن وُجدوا)
DELETE FROM public.clients 
WHERE created_by != 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- تنظيف أي إيميلات وهمية من جدول الإيميلات
DELETE FROM public.email_queue 
WHERE to_email NOT LIKE '%alialshehriholding.com';

-- إعادة تعيين المعاملات للمستخدم الحقيقي لتصفير الرصيد إذا رغب في ذلك
UPDATE public.customer_wallets 
SET balance = 0.00, updated_at = NOW() 
WHERE user_id = 'a60a2612-4ff4-441c-8dff-4444b29c8802';

-- حذف أي معاملات للمحفظة الحقيقية إذا كانت تجريبية
DELETE FROM public.wallet_transactions 
WHERE user_id = 'a60a2612-4ff4-441c-8dff-4444b29c8802' 
  AND description LIKE '%تجريب%';

-- تسجيل العملية في سجل الأمان
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  risk_level,
  metadata
) VALUES (
  'data_cleanup',
  'a60a2612-4ff4-441c-8dff-4444b29c8802',
  'cleanup_dummy_data',
  'medium',
  jsonb_build_object(
    'description', 'تم حذف جميع البيانات الوهمية من النظام',
    'timestamp', NOW(),
    'action_type', 'system_maintenance'
  )
);