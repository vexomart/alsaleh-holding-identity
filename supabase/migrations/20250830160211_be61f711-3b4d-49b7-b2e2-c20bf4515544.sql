-- حذف وإعادة إنشاء الدوال المطلوبة للمصادقة

-- حذف الدالة الموجودة لتجنب تضارب الأسماء
DROP FUNCTION IF EXISTS public.normalize_digits(text);

-- إعادة إنشاء الدوال الأساسية
CREATE OR REPLACE FUNCTION public.normalize_email(email_input text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN LOWER(TRIM(email_input));
END;
$$;

-- دالة تطبيع الأرقام العربية
CREATE OR REPLACE FUNCTION public.normalize_digits(input_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN TRANSLATE(input_text, '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹', '01234567890123456789');
END;
$$;

-- دالة المصادقة المحسنة
CREATE OR REPLACE FUNCTION public.simple_authenticate_user_enhanced(
  p_email text,
  p_password text
)
RETURNS TABLE(
  success boolean,
  user_id uuid,
  status text,
  message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user RECORD;
  v_normalized_email text;
  v_password_hash text;
  v_salt text;
BEGIN
  v_normalized_email := normalize_email(p_email);
  
  SELECT *
  INTO v_user
  FROM ash_users
  WHERE email_lower = v_normalized_email;
  
  IF v_user.id IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid, 'not_found'::text, 'المستخدم غير موجود'::text;
    RETURN;
  END IF;
  
  IF v_user.status = 'blocked' THEN
    RETURN QUERY SELECT false, v_user.id, 'blocked'::text, 'تم حظر حسابك'::text;
    RETURN;
  END IF;
  
  IF v_user.status = 'inactive' THEN
    RETURN QUERY SELECT false, v_user.id, 'inactive'::text, 'حسابك غير مفعل'::text;
    RETURN;
  END IF;
  
  v_salt := COALESCE(v_user.password_salt, '');
  v_password_hash := encode(digest(p_password || v_salt, 'sha256'), 'hex');
  
  IF v_user.password_hash != v_password_hash THEN
    RETURN QUERY SELECT false, v_user.id, 'wrong_password'::text, 'كلمة المرور غير صحيحة'::text;
    RETURN;
  END IF;
  
  RETURN QUERY SELECT true, v_user.id, v_user.status, 'تم تسجيل الدخول بنجاح'::text;
END;
$$;

-- دالة التحقق من OTP
CREATE OR REPLACE FUNCTION public.verify_otp_code_enhanced(
  p_email text,
  p_code text,
  p_type text DEFAULT 'login'
)
RETURNS TABLE(
  success boolean,
  user_id uuid,
  message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_normalized_email text;
  v_normalized_code text;
  v_otp RECORD;
BEGIN
  v_normalized_email := normalize_email(p_email);
  v_normalized_code := normalize_digits(p_code);
  
  SELECT *
  INTO v_otp
  FROM ash_email_otps
  WHERE email_lower = v_normalized_email
    AND type = p_type
    AND consumed = false
    AND expires_at > NOW()
    AND (code = p_code OR normalized_code = v_normalized_code)
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_otp.id IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid, 'رمز التحقق غير صحيح أو منتهي الصلاحية'::text;
    RETURN;
  END IF;
  
  UPDATE ash_email_otps
  SET consumed = true, consumed_at = NOW()
  WHERE id = v_otp.id;
  
  IF p_type = 'register' THEN
    UPDATE ash_users
    SET status = 'active', verified_at = NOW(), email_verified_at = NOW()
    WHERE id = v_otp.user_id;
  ELSE
    UPDATE ash_users
    SET last_login_at = NOW()
    WHERE id = v_otp.user_id;
  END IF;
  
  RETURN QUERY SELECT true, v_otp.user_id, 'تم التحقق بنجاح'::text;
END;
$$;