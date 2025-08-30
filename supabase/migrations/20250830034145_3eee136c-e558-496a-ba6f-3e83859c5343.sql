-- Enhanced Authentication Diagnostic and Fix System
-- تحسينات شاملة لنظام المصادقة مع نظام تشخيص متقدم

-- 1. إضافة عمود password_hash_version للتتبع
ALTER TABLE public.ash_users 
ADD COLUMN IF NOT EXISTS password_hash_version TEXT DEFAULT 'sha256_v1';

-- 2. إضافة عمود password_salt للتحكم في salt منفصل
ALTER TABLE public.ash_users 
ADD COLUMN IF NOT EXISTS password_salt TEXT DEFAULT NULL;

-- 3. إضافة email_verified_at للتتبع
ALTER TABLE public.ash_users 
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- 4. تحسين الفهارس للأداء
CREATE INDEX IF NOT EXISTS idx_ash_users_status_role ON public.ash_users(status, role);
CREATE INDEX IF NOT EXISTS idx_ash_users_email_verified ON public.ash_users(email_verified_at) WHERE email_verified_at IS NOT NULL;

-- 5. دالة تطبيع البريد الإلكتروني محسّنة
CREATE OR REPLACE FUNCTION public.normalize_email_enhanced(email_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF email_input IS NULL OR length(trim(email_input)) = 0 THEN
    RETURN NULL;
  END IF;
  RETURN lower(trim(email_input));
END;
$$;

-- 6. دالة إنشاء hash آمن موحد
CREATE OR REPLACE FUNCTION public.create_secure_password_hash_v2(password_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  salt_bytes BYTEA;
  salt_text TEXT;
  password_hash TEXT;
BEGIN
  -- التحقق من صحة كلمة المرور
  IF password_text IS NULL OR length(password_text) = 0 THEN
    RAISE EXCEPTION 'كلمة المرور لا يمكن أن تكون فارغة';
  END IF;
  
  -- توليد salt عشوائي آمن (32 bytes)
  salt_bytes := gen_random_bytes(32);
  salt_text := encode(salt_bytes, 'base64');
  
  -- إنشاء hash باستخدام SHA-256 مع salt
  password_hash := encode(
    digest(salt_text || password_text, 'sha256'),
    'hex'
  );
  
  RETURN jsonb_build_object(
    'hash', password_hash,
    'salt', salt_text,
    'algorithm', 'sha256_v1',
    'created_at', now()
  );
END;
$$;

-- 7. دالة التحقق من كلمة المرور محسّنة
CREATE OR REPLACE FUNCTION public.verify_password_enhanced(
  password_text TEXT, 
  stored_hash TEXT, 
  stored_salt TEXT DEFAULT NULL,
  hash_version TEXT DEFAULT 'sha256_v1'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  calculated_hash TEXT;
BEGIN
  -- التحقق من صحة المدخلات
  IF password_text IS NULL OR stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- معالجة النسخ المختلفة من hash
  IF hash_version = 'sha256_v1' AND stored_salt IS NOT NULL THEN
    -- النسخة الجديدة مع salt منفصل
    calculated_hash := encode(
      digest(stored_salt || password_text, 'sha256'),
      'hex'
    );
  ELSE
    -- النسخة القديمة (fallback)
    calculated_hash := encode(
      digest(password_text, 'sha256'),
      'hex'
    );
  END IF;
  
  RETURN calculated_hash = stored_hash;
END;
$$;

-- 8. دالة مصادقة موحدة محسّنة
CREATE OR REPLACE FUNCTION public.simple_authenticate_user_enhanced(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE(
  success BOOLEAN,
  user_id UUID,
  email_lower TEXT,
  status TEXT,
  role TEXT,
  message TEXT,
  error_code TEXT
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
  normalized_email := normalize_email_enhanced(p_email);
  
  IF normalized_email IS NULL THEN
    RETURN QUERY SELECT 
      FALSE, NULL::UUID, NULL::TEXT, 'invalid_email'::TEXT, NULL::TEXT, 
      'تنسيق البريد الإلكتروني غير صحيح'::TEXT, 'E_INVALID_EMAIL'::TEXT;
    RETURN;
  END IF;
  
  -- البحث عن المستخدم
  SELECT id, email_lower, status, role, password_hash, password_salt, password_hash_version
  INTO user_record
  FROM ash_users
  WHERE email_lower = normalized_email;
  
  -- التحقق من وجود المستخدم
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      FALSE, NULL::UUID, normalized_email, 'not_found'::TEXT, NULL::TEXT,
      'لا يوجد حساب لهذا البريد'::TEXT, 'E_USER_NOT_FOUND'::TEXT;
    RETURN;
  END IF;
  
  -- التحقق من حالة الحساب
  IF user_record.status = 'blocked' THEN
    RETURN QUERY SELECT 
      FALSE, user_record.id, normalized_email, 'blocked'::TEXT, user_record.role,
      'تم حظر حسابك. يرجى التواصل مع الإدارة'::TEXT, 'E_ACCOUNT_BLOCKED'::TEXT;
    RETURN;
  END IF;
  
  IF user_record.status = 'inactive' THEN
    RETURN QUERY SELECT 
      FALSE, user_record.id, normalized_email, 'inactive'::TEXT, user_record.role,
      'حسابك غير مفعل'::TEXT, 'E_ACCOUNT_INACTIVE'::TEXT;
    RETURN;
  END IF;
  
  IF user_record.status = 'pending' THEN
    RETURN QUERY SELECT 
      FALSE, user_record.id, normalized_email, 'pending'::TEXT, user_record.role,
      'الرجاء تفعيل بريدك قبل تسجيل الدخول'::TEXT, 'E_NOT_ACTIVE'::TEXT;
    RETURN;
  END IF;
  
  -- التحقق من كلمة المرور
  password_valid := verify_password_enhanced(
    p_password, 
    user_record.password_hash, 
    user_record.password_salt,
    COALESCE(user_record.password_hash_version, 'sha256_v1')
  );
  
  IF NOT password_valid THEN
    RETURN QUERY SELECT 
      FALSE, user_record.id, normalized_email, 'wrong_password'::TEXT, user_record.role,
      'بيانات تسجيل الدخول غير صحيحة'::TEXT, 'E_PASSWORD_MISMATCH'::TEXT;
    RETURN;
  END IF;
  
  -- نجح التحقق
  RETURN QUERY SELECT 
    TRUE, user_record.id, normalized_email, user_record.status, user_record.role,
    'تم التحقق بنجاح'::TEXT, 'SUCCESS'::TEXT;
END;
$$;

-- 9. دالة التشخيص الشاملة
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
  auth_result RECORD;
  diagnostic_data JSONB;
  password_valid BOOLEAN;
  hash_algorithm TEXT;
  rls_test BOOLEAN;
  current_time TIMESTAMP WITH TIME ZONE;
BEGIN
  current_time := now();
  normalized_email := normalize_email_enhanced(p_email);
  
  -- البحث عن المستخدم (بدون RLS)
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
  IF user_record.password_hash IS NOT NULL THEN
    password_valid := verify_password_enhanced(
      p_password, 
      user_record.password_hash, 
      user_record.password_salt,
      COALESCE(user_record.password_hash_version, 'sha256_v1')
    );
  ELSE
    password_valid := FALSE;
  END IF;
  
  -- اختبار RLS
  BEGIN
    SELECT success INTO rls_test
    FROM simple_authenticate_user_enhanced(p_email, p_password)
    LIMIT 1;
    rls_test := TRUE;
  EXCEPTION WHEN OTHERS THEN
    rls_test := FALSE;
  END;
  
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
    'RLS_check', rls_test,
    'email_verified_at', user_record.email_verified_at,
    'account_created_at', user_record.created_at,
    'clock_server_time', current_time,
    'diagnostic_timestamp', current_time
  );
  
  -- إضافة نتائج التحقق التفصيلية
  IF user_record.id IS NOT NULL THEN
    SELECT success, message, error_code 
    INTO auth_result
    FROM simple_authenticate_user_enhanced(p_email, p_password)
    LIMIT 1;
    
    diagnostic_data := diagnostic_data || jsonb_build_object(
      'auth_function_result', jsonb_build_object(
        'success', auth_result.success,
        'message', auth_result.message,
        'error_code', auth_result.error_code
      )
    );
  END IF;
  
  RETURN diagnostic_data;
END;
$$;

-- 10. دالة تحديث OTP verification لتفعيل الحساب
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
  user_id_var UUID;
  verification_result JSONB;
BEGIN
  -- تطبيع البيانات
  normalized_email := normalize_email_enhanced(p_email);
  normalized_code := normalize_digits(p_code);
  
  -- البحث عن OTP صالح
  SELECT id, user_id, code, normalized_code, expires_at, type
  INTO otp_record
  FROM ash_email_otps
  WHERE email_lower = normalized_email
    AND type = p_type
    AND consumed = false
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- التحقق من وجود OTP
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'رمز التحقق غير صحيح أو منتهي الصلاحية',
      'error_code', 'E_INVALID_OTP'
    );
  END IF;
  
  -- التحقق من الكود (يدعم الأرقام العربية والإنجليزية)
  IF otp_record.code != normalized_code AND otp_record.normalized_code != normalized_code THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'رمز التحقق غير صحيح',
      'error_code', 'E_WRONG_OTP'
    );
  END IF;
  
  -- تسجيل استهلاك OTP
  UPDATE ash_email_otps
  SET consumed = true,
      consumed_at = now()
  WHERE id = otp_record.id;
  
  -- تحديث حالة المستخدم عند التحقق من التسجيل أو تفعيل البريد
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