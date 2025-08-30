-- إنشاء دالة authenticate_user المحسّنة
CREATE OR REPLACE FUNCTION public.authenticate_user(
  p_email text,
  p_password text
)
RETURNS TABLE(
  success boolean,
  message text,
  user_id uuid,
  status text,
  user_data jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_record RECORD;
  v_normalized_email text;
BEGIN
  -- تطبيع البريد الإلكتروني
  v_normalized_email := normalize_email(p_email);
  
  -- البحث عن المستخدم
  SELECT * INTO v_user_record
  FROM ash_users
  WHERE email_lower = v_normalized_email;
  
  -- التحقق من وجود المستخدم
  IF v_user_record IS NULL THEN
    RETURN QUERY SELECT false, 'بيانات تسجيل الدخول غير صحيحة', null::uuid, 'not_found', null::jsonb;
    RETURN;
  END IF;
  
  -- التحقق من كلمة المرور
  IF NOT verify_ash_password(p_password, v_user_record.password_hash) THEN
    RETURN QUERY SELECT false, 'بيانات تسجيل الدخول غير صحيحة', null::uuid, 'invalid_password', null::jsonb;
    RETURN;
  END IF;
  
  -- التحقق من حالة الحساب
  IF v_user_record.status = 'blocked' THEN
    RETURN QUERY SELECT false, 'تم حظر حسابك. يرجى التواصل مع الإدارة', v_user_record.id, 'blocked', null::jsonb;
    RETURN;
  END IF;
  
  IF v_user_record.status = 'pending' THEN
    RETURN QUERY SELECT false, 'الرجاء تفعيل بريدك الإلكتروني قبل تسجيل الدخول', v_user_record.id, 'not_verified', null::jsonb;
    RETURN;
  END IF;
  
  -- تحديث وقت آخر دخول
  UPDATE ash_users 
  SET last_login_at = NOW(), updated_at = NOW()
  WHERE id = v_user_record.id;
  
  -- إرجاع نجاح المصادقة
  RETURN QUERY SELECT 
    true, 
    'تم تسجيل الدخول بنجاح', 
    v_user_record.id, 
    v_user_record.status,
    jsonb_build_object(
      'id', v_user_record.id,
      'name', v_user_record.name,
      'email', v_user_record.email,
      'role', v_user_record.role,
      'status', v_user_record.status,
      'kyc_status', v_user_record.kyc_status
    );
END;
$$;

-- إنشاء دالة verify_ash_password إذا لم تكن موجودة
CREATE OR REPLACE FUNCTION public.verify_ash_password(
  plain_password text,
  hashed_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- استخدام bcrypt للتحقق من كلمة المرور
  RETURN hashed_password = crypt(plain_password, hashed_password);
END;
$$;

-- إنشاء دالة normalize_email إذا لم تكن موجودة
CREATE OR REPLACE FUNCTION public.normalize_email(email_input text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN TRIM(LOWER(email_input));
END;
$$;