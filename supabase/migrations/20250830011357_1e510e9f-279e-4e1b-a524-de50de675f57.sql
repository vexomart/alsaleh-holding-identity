-- إصلاح مشاكل الأمان في الدوال
SET search_path = public;

-- تحديث دالة handle_new_user_profile
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    user_id,
    full_name,
    email,
    is_verified
  ) VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    NEW.email_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$;

-- تحديث دالة confirm_user_after_verification
CREATE OR REPLACE FUNCTION public.confirm_user_after_verification(
  user_email TEXT
) RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = 'public'
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- البحث عن المستخدم
  SELECT * INTO user_record 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_record.id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- تحديث حالة التأكيد في profiles
  UPDATE public.profiles 
  SET is_verified = TRUE,
      updated_at = NOW()
  WHERE email = user_email;
  
  -- تحديث user_roles إذا لم يكن موجوداً
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_record.id, 'user'::app_role)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$;