-- Enhanced Authentication Diagnostic and Fix System (Fixed)
-- تحسينات شاملة لنظام المصادقة مع نظام تشخيص متقدم

-- 1. إضافة الأعمدة المطلوبة
ALTER TABLE public.ash_users 
ADD COLUMN IF NOT EXISTS password_hash_version TEXT DEFAULT 'sha256_v1';

ALTER TABLE public.ash_users 
ADD COLUMN IF NOT EXISTS password_salt TEXT DEFAULT NULL;

ALTER TABLE public.ash_users 
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- 2. إضافة consumed_at للتتبع
ALTER TABLE public.ash_email_otps 
ADD COLUMN IF NOT EXISTS consumed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- 3. تحسين الفهارس
CREATE INDEX IF NOT EXISTS idx_ash_users_status_role ON public.ash_users(status, role);
CREATE INDEX IF NOT EXISTS idx_ash_users_email_verified ON public.ash_users(email_verified_at) WHERE email_verified_at IS NOT NULL;

-- 4. دالة تطبيع البريد الإلكتروني محسّنة
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

-- 5. دالة إنشاء hash آمن موحد
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
  IF password_text IS NULL OR length(password_text) = 0 THEN
    RAISE EXCEPTION 'كلمة المرور لا يمكن أن تكون فارغة';
  END IF;
  
  salt_bytes := gen_random_bytes(32);
  salt_text := encode(salt_bytes, 'base64');
  
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

-- 6. دالة التحقق من كلمة المرور محسّنة
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
  IF password_text IS NULL OR stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  IF hash_version = 'sha256_v1' AND stored_salt IS NOT NULL THEN
    calculated_hash := encode(
      digest(stored_salt || password_text, 'sha256'),
      'hex'
    );
  ELSE
    calculated_hash := encode(
      digest(password_text, 'sha256'),
      'hex'
    );
  END IF;
  
  RETURN calculated_hash = stored_hash;
END;
$$;

-- 7. دالة مصادقة موحدة محسّنة
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
  normalized_email := normalize_email_enhanced(p_email);
  
  IF normalized_email IS NULL THEN
    RETURN QUERY SELECT 
      FALSE, NULL::UUID, NULL::TEXT, 'invalid_email'::TEXT, NULL::TEXT, 
      'تنسيق البريد الإلكتروني غير صحيح'::TEXT, 'E_INVALID_EMAIL'::TEXT;
    RETURN;
  END IF;
  
  SELECT id, email_lower, status, role, password_hash, password_salt, password_hash_version
  INTO user_record
  FROM ash_users
  WHERE email_lower = normalized_email;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      FALSE, NULL::UUID, normalized_email, 'not_found'::TEXT, NULL::TEXT,
      'لا يوجد حساب لهذا البريد'::TEXT, 'E_USER_NOT_FOUND'::TEXT;
    RETURN;
  END IF;
  
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
  
  RETURN QUERY SELECT 
    TRUE, user_record.id, normalized_email, user_record.status, user_record.role,
    'تم التحقق بنجاح'::TEXT, 'SUCCESS'::TEXT;
END;
$$;