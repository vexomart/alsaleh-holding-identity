-- حذف trigger الأفلييت المشكل مؤقتاً
DROP TRIGGER IF EXISTS create_affiliate_program_on_signup ON auth.users;

-- حذف الدالة أيضاً
DROP FUNCTION IF EXISTS public.create_affiliate_program();

-- تحسين دالة handle_new_user_profile لتجنب الأخطاء
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- محاولة إنشاء الملف الشخصي مع معالجة الأخطاء
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
    )
    ON CONFLICT (user_id) DO UPDATE SET
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      email = NEW.email,
      is_verified = NEW.email_confirmed_at IS NOT NULL;
      
  EXCEPTION WHEN OTHERS THEN
    -- تسجيل الخطأ في جدول الأمان إذا كان متاحاً
    BEGIN
      INSERT INTO public.security_audit_logs (
        event_type,
        user_id,
        action,
        risk_level,
        metadata
      ) VALUES (
        'profile_creation_error',
        NEW.id,
        'profile_creation_failed',
        'medium',
        jsonb_build_object(
          'error', SQLERRM,
          'user_email', NEW.email,
          'timestamp', now()
        )
      );
    EXCEPTION WHEN OTHERS THEN
      -- إذا فشل حتى تسجيل الخطأ، لا نفعل شيء
      NULL;
    END;
  END;
  
  RETURN NEW;
END;
$$;