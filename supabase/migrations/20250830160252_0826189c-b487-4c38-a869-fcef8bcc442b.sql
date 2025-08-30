-- حذف الدوال الموجودة لتجنب التضارب
DROP FUNCTION IF EXISTS public.simple_authenticate_user_enhanced(text,text);
DROP FUNCTION IF EXISTS public.verify_otp_code_enhanced(text,text,text);
DROP FUNCTION IF EXISTS public.log_auth_attempt(text,text,text,text,text,text);
DROP FUNCTION IF EXISTS public.check_sensitive_operation_limit(uuid,text);
DROP FUNCTION IF EXISTS public.enhanced_rate_limit_check(text,text,integer,integer);

-- إنشاء الدوال من جديد بالتوقيعات الصحيحة
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

-- دالة تسجيل محاولات المصادقة
CREATE OR REPLACE FUNCTION public.log_auth_attempt(
  p_email_lower text,
  p_result text,
  p_error_code text DEFAULT NULL,
  p_error_constraint text DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO security_audit_logs (
    event_type,
    action,
    risk_level,
    metadata
  ) VALUES (
    'auth_attempt',
    p_result,
    CASE 
      WHEN p_result = 'success' THEN 'low'
      WHEN p_result = 'invalid' THEN 'medium'
      ELSE 'high'
    END,
    jsonb_build_object(
      'email_lower', p_email_lower,
      'result', p_result,
      'error_code', p_error_code,
      'error_constraint', p_error_constraint,
      'ip_address', p_ip_address,
      'user_agent', p_user_agent,
      'timestamp', NOW()
    )
  );
END;
$$;

-- دالة التحقق من حدود العمليات الحساسة
CREATE OR REPLACE FUNCTION public.check_sensitive_operation_limit(
  p_user_id uuid,
  p_operation_type text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM security_audit_logs
  WHERE user_id = p_user_id
    AND action LIKE '%' || p_operation_type || '%'
    AND created_at > NOW() - INTERVAL '1 hour';
  
  RETURN v_count < 10;
END;
$$;

-- دالة التحقق من معدل الطلبات المحسن
CREATE OR REPLACE FUNCTION public.enhanced_rate_limit_check(
  p_identifier text,
  p_action_type text,
  p_limit integer DEFAULT 5,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_count integer;
  v_window_start timestamp with time zone;
BEGIN
  v_window_start := NOW() - (p_window_minutes || ' minutes')::interval;
  
  SELECT COUNT(*)
  INTO v_count
  FROM security_audit_logs
  WHERE metadata->>'identifier' = p_identifier
    AND action = p_action_type
    AND created_at >= v_window_start;
  
  INSERT INTO security_audit_logs (
    event_type,
    action,
    risk_level,
    metadata
  ) VALUES (
    'rate_limit_check',
    p_action_type,
    'low',
    jsonb_build_object(
      'identifier', p_identifier,
      'count', v_count + 1,
      'limit', p_limit,
      'window_minutes', p_window_minutes
    )
  );
  
  RETURN v_count < p_limit;
END;
$$;