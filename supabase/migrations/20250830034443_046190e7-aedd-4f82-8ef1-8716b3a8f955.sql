-- Complete the diagnostic system with updated functions

-- 1. دالة التشخيص الشاملة (مبسطة)
CREATE OR REPLACE FUNCTION public.auth_diagnostic_check(
  p_email TEXT,
  p_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  normalized_email TEXT;
  user_record RECORD;
  diagnostic_data JSONB;
  password_valid BOOLEAN;
  hash_algorithm TEXT;
  timestamp_now TIMESTAMP WITH TIME ZONE;
BEGIN
  timestamp_now := now();
  normalized_email := normalize_email_enhanced(p_email);
  
  -- البحث عن المستخدم
  SELECT id, email_lower, status, role, password_hash, password_salt, 
         password_hash_version, created_at, verified_at, email_verified_at
  INTO user_record
  FROM ash_users
  WHERE email_lower = normalized_email;
  
  -- تشخيص خوارزمية hash
  IF user_record.password_hash IS NOT NULL THEN
    IF length(user_record.password_hash) = 64 THEN
      hash_algorithm := 'sha256';
    ELSIF user_record.password_hash LIKE '$2%' THEN
      hash_algorithm := 'bcrypt';
    ELSE
      hash_algorithm := 'unknown';
    END IF;
  ELSE
    hash_algorithm := 'none';
  END IF;
  
  -- اختبار كلمة المرور
  password_valid := FALSE;
  IF user_record.password_hash IS NOT NULL THEN
    password_valid := verify_password_enhanced(
      p_password, 
      user_record.password_hash, 
      user_record.password_salt,
      COALESCE(user_record.password_hash_version, 'sha256_v1')
    );
  END IF;
  
  -- تجميع بيانات التشخيص
  diagnostic_data := jsonb_build_object(
    'email_input_raw', p_email,
    'email_normalized', normalized_email,
    'user_row_found', user_record.id IS NOT NULL,
    'user_status', COALESCE(user_record.status, 'null'),
    'user_role', COALESCE(user_record.role, 'null'),
    'password_hash_present', user_record.password_hash IS NOT NULL,
    'password_salt_present', user_record.password_salt IS NOT NULL,
    'hash_algorithm_detected', hash_algorithm,
    'hash_version', COALESCE(user_record.password_hash_version, 'unknown'),
    'password_match', password_valid,
    'email_verified_at', user_record.email_verified_at,
    'account_created_at', user_record.created_at,
    'clock_server_time', timestamp_now,
    'diagnostic_timestamp', timestamp_now
  );
  
  RETURN diagnostic_data;
END;
$$;

-- 2. دالة تحديث OTP verification لتفعيل الحساب
CREATE OR REPLACE FUNCTION public.verify_otp_code_enhanced(
  p_email TEXT,
  p_code TEXT,
  p_type TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  normalized_email TEXT;
  normalized_code TEXT;
  otp_record RECORD;
  verification_result JSONB;
BEGIN
  normalized_email := normalize_email_enhanced(p_email);
  normalized_code := normalize_digits(p_code);
  
  SELECT id, user_id, code, normalized_code, expires_at, type
  INTO otp_record
  FROM ash_email_otps
  WHERE email_lower = normalized_email
    AND type = p_type
    AND consumed = false
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'رمز التحقق غير صحيح أو منتهي الصلاحية',
      'error_code', 'E_INVALID_OTP'
    );
  END IF;
  
  IF otp_record.code != normalized_code AND otp_record.normalized_code != normalized_code THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'رمز التحقق غير صحيح',
      'error_code', 'E_WRONG_OTP'
    );
  END IF;
  
  UPDATE ash_email_otps
  SET consumed = true,
      consumed_at = now()
  WHERE id = otp_record.id;
  
  IF p_type IN ('register', 'login') THEN
    UPDATE ash_users
    SET status = 'active',
        verified_at = now(),
        email_verified_at = now()
    WHERE id = otp_record.user_id;
  END IF;
  
  verification_result := jsonb_build_object(
    'success', true,
    'message', 'تم التحقق بنجاح',
    'user_id', otp_record.user_id,
    'verification_type', p_type,
    'verified_at', now()
  );
  
  RETURN verification_result;
END;
$$;