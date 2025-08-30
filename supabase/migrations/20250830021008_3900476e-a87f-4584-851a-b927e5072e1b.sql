-- أولاً، حذف القيد الموجود على activity_type
ALTER TABLE public.user_activity_logs DROP CONSTRAINT IF EXISTS user_activity_logs_activity_type_check;

-- إضافة قيد جديد يسمح بالقيم المطلوبة
ALTER TABLE public.user_activity_logs 
ADD CONSTRAINT user_activity_logs_activity_type_check 
CHECK (activity_type IN (
  'login', 'logout', 'page_view', 'profile_update', 'settings_change', 
  'status_change', 'view_profile', 'admin_action', 'data_access', 
  'password_change', 'email_change', 'api_call', 'search', 'export'
));

-- التحقق من المستخدمين الموجودين في جدول المصادقة
-- وإضافة بيانات نشاط باستخدام user_id الصحيح من auth.users
WITH auth_users AS (
  SELECT id FROM auth.users LIMIT 3
)
INSERT INTO public.user_activity_logs (user_id, activity_type, description, created_at)
SELECT 
  id,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 1 THEN 'login'
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 2 THEN 'page_view'
    ELSE 'admin_action'
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 1 THEN 'تسجيل دخول'
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 2 THEN 'عرض الصفحة'
    ELSE 'نشاط إداري'
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 1 THEN NOW() - INTERVAL '2 minutes'
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 2 THEN NOW() - INTERVAL '15 minutes'
    ELSE NOW() - INTERVAL '30 seconds'
  END
FROM auth_users;