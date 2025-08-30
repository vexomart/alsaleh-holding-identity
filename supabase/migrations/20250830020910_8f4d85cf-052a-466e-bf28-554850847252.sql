-- إنشاء trigger لتسجيل أنشطة المستخدمين تلقائياً
CREATE OR REPLACE FUNCTION public.log_user_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- تسجيل نشاط المستخدم عند التحديث
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

-- ربط الـ trigger بجدول ash_users
DROP TRIGGER IF EXISTS ash_users_activity_trigger ON public.ash_users;
CREATE TRIGGER ash_users_activity_trigger
    AFTER UPDATE ON public.ash_users
    FOR EACH ROW
    EXECUTE FUNCTION public.log_user_activity();

-- إضافة بيانات نشاط تجريبية واقعية للمستخدمين الموجودين
INSERT INTO public.user_activity_logs (user_id, activity_type, description, created_at) VALUES
  -- نشاط لعلي الشهري
  ('716579da-4978-4cf1-9880-e993a8cd14a4', 'login', 'تسجيل دخول', NOW() - INTERVAL '2 minutes'),
  ('716579da-4978-4cf1-9880-e993a8cd14a4', 'view_profile', 'عرض الملف الشخصي', NOW() - INTERVAL '5 minutes'),
  
  -- نشاط لمستخدم آخر
  ('97d4d268-8b1f-423b-b251-c222d385b613', 'login', 'تسجيل دخول', NOW() - INTERVAL '15 minutes'),
  ('97d4d268-8b1f-423b-b251-c222d385b613', 'logout', 'تسجيل خروج', NOW() - INTERVAL '20 minutes'),
  
  -- نشاط للأدمين
  ('827ae400-d657-4c7b-b82a-b58669a28cfd', 'login', 'تسجيل دخول', NOW() - INTERVAL '1 minute'),
  ('827ae400-d657-4c7b-b82a-b58669a28cfd', 'admin_action', 'عمل إداري', NOW() - INTERVAL '3 minutes');

-- إنشاء دالة لتحديث آخر نشاط للمستخدم
CREATE OR REPLACE FUNCTION public.update_user_last_activity(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_activity_logs (
    user_id,
    activity_type,
    description,
    created_at
  ) VALUES (
    user_id_param,
    'page_view',
    'نشاط في الصفحة',
    NOW()
  );
END;
$$;