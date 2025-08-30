-- إصلاح مشكلة الأمان: تعيين search_path للدوال الآمنة
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

-- إنشاء دالة لإضافة المزيد من أنشطة العملاء لتحديث البيانات كل فترة
CREATE OR REPLACE FUNCTION public.simulate_user_activities()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_rec RECORD;
  activity_types TEXT[] := ARRAY['page_view', 'login', 'logout', 'profile_update'];
  random_activity TEXT;
BEGIN
  -- إضافة أنشطة عشوائية للمستخدمين الحاليين
  FOR user_rec IN SELECT id FROM auth.users LIMIT 5 LOOP
    random_activity := activity_types[1 + floor(random() * array_length(activity_types, 1))];
    
    INSERT INTO public.user_activity_logs (
      user_id,
      activity_type,
      description,
      created_at
    ) VALUES (
      user_rec.id,
      random_activity,
      'نشاط تلقائي',
      NOW() - INTERVAL '1 minute' * floor(random() * 120)
    );
  END LOOP;
END;
$$;