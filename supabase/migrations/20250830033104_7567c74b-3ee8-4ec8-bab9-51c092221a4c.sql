-- إصلاح تعارض الدوال وإنشاء النظام المحسّن

-- 1. حذف الدالة الموجودة وإعادة إنشائها
DROP FUNCTION IF EXISTS public.simple_authenticate_user(text, text);

-- 2. إنشاء دالة المصادقة المحسّنة الجديدة
CREATE OR REPLACE FUNCTION public.simple_authenticate_user(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE(
  success BOOLEAN,
  user_id UUID,
  role TEXT,
  status TEXT,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  normalized_email TEXT;
  user_record RECORD;
  password_valid BOOLEAN;
BEGIN
  -- تطبيع البريد الإلكتروني
  normalized_email := public.normalize_email(p_email);
  
  -- البحث عن المستخدم
  SELECT id, email, name, role, status, password_hash, verified_at
  INTO user_record
  FROM public.ash_users
  WHERE email_lower = normalized_email;
  
  -- التحقق من وجود المستخدم
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'not_found'::TEXT, 'البريد الإلكتروني غير مسجل'::TEXT;
    RETURN;
  END IF;
  
  -- التحقق من حالة المستخدم
  IF user_record.status = 'blocked' THEN
    RETURN QUERY SELECT false, user_record.id, user_record.role, 'blocked'::TEXT, 'تم حظر الحساب'::TEXT;
    RETURN;
  END IF;
  
  IF user_record.status = 'inactive' THEN
    RETURN QUERY SELECT false, user_record.id, user_record.role, 'inactive'::TEXT, 'الحساب غير مفعل'::TEXT;
    RETURN;
  END IF;
  
  -- للمستخدمين في حالة pending (لم يتم تفعيلهم بعد)
  IF user_record.status = 'pending' THEN
    RETURN QUERY SELECT false, user_record.id, user_record.role, 'pending'::TEXT, 'يرجى تفعيل حسابك أولاً عبر رمز التحقق المرسل لبريدك الإلكتروني'::TEXT;
    RETURN;
  END IF;
  
  -- التحقق من كلمة المرور
  IF user_record.password_hash LIKE '%:%' THEN
    -- استخدام دالة التحقق الجديدة
    password_valid := public.verify_password(p_password, user_record.password_hash);
  ELSE
    -- تحقق قديم للتوافق (البيانات القديمة)
    password_valid := user_record.password_hash LIKE 'hashed_' || p_password || '%';
  END IF;
  
  IF NOT password_valid THEN
    RETURN QUERY SELECT false, user_record.id, user_record.role, 'wrong_password'::TEXT, 'كلمة المرور غير صحيحة'::TEXT;
    RETURN;
  END IF;
  
  -- نجحت المصادقة
  RETURN QUERY SELECT true, user_record.id, user_record.role, user_record.status, 'تم تسجيل الدخول بنجاح'::TEXT;
  RETURN;
END;
$$;