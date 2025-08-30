-- التحقق من القيود الموجودة على activity_type ثم إضافة القيم المطلوبة
-- أولاً، حذف القيد الموجود إذا كان مقيداً جداً
ALTER TABLE public.user_activity_logs DROP CONSTRAINT IF EXISTS user_activity_logs_activity_type_check;

-- إضافة قيد جديد يسمح بالقيم التي نحتاجها
ALTER TABLE public.user_activity_logs 
ADD CONSTRAINT user_activity_logs_activity_type_check 
CHECK (activity_type IN (
  'login', 'logout', 'page_view', 'profile_update', 'settings_change', 
  'status_change', 'view_profile', 'admin_action', 'data_access', 
  'password_change', 'email_change', 'api_call', 'search', 'export'
));

-- الآن إضافة بيانات النشاط التجريبية
INSERT INTO public.user_activity_logs (user_id, activity_type, description, created_at) VALUES
  -- نشاط لعلي الشهري (متصل حالياً)
  ('716579da-4978-4cf1-9880-e993a8cd14a4', 'login', 'تسجيل دخول', NOW() - INTERVAL '2 minutes'),
  ('716579da-4978-4cf1-9880-e993a8cd14a4', 'page_view', 'عرض لوحة التحكم', NOW() - INTERVAL '1 minute'),
  
  -- نشاط لمستخدم آخر (آخر ظهور قبل 15 دقيقة)
  ('97d4d268-8b1f-423b-b251-c222d385b613', 'login', 'تسجيل دخول', NOW() - INTERVAL '20 minutes'),
  ('97d4d268-8b1f-423b-b251-c222d385b613', 'logout', 'تسجيل خروج', NOW() - INTERVAL '15 minutes'),
  
  -- نشاط للأدمين (متصل حالياً)
  ('827ae400-d657-4c7b-b82a-b58669a28cfd', 'login', 'تسجيل دخول', NOW() - INTERVAL '30 seconds'),
  ('827ae400-d657-4c7b-b82a-b58669a28cfd', 'admin_action', 'عرض قائمة العملاء', NOW() - INTERVAL '10 seconds');

-- إنشاء trigger للتحديث التلقائي
CREATE OR REPLACE FUNCTION public.log_user_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- تسجيل نشاط عند تسجيل الدخول
  IF TG_OP = 'UPDATE' AND OLD.last_login_at IS DISTINCT FROM NEW.last_login_at THEN
    INSERT INTO public.user_activity_logs (
      user_id,
      activity_type,
      description,
      created_at
    ) VALUES (
      NEW.id,
      'login',
      'تسجيل دخول المستخدم',
      NOW()
    );
  END IF;
  
  -- تسجيل نشاط عند تحديث الحالة
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.user_activity_logs (
      user_id,
      activity_type,
      description,
      created_at
    ) VALUES (
      NEW.id,
      'status_change',
      'تغيير حالة المستخدم إلى ' || NEW.status,
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- ربط الـ trigger
DROP TRIGGER IF EXISTS ash_users_activity_trigger ON public.ash_users;
CREATE TRIGGER ash_users_activity_trigger
    AFTER UPDATE ON public.ash_users
    FOR EACH ROW
    EXECUTE FUNCTION public.log_user_activity();