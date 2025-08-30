-- Enhanced Authentication Diagnostic and Fix System - Part 1
-- تحسينات شاملة لنظام المصادقة مع نظام تشخيص متقدم

-- 1. إضافة أعمدة جديدة للتتبع المحسن
ALTER TABLE public.ash_users 
ADD COLUMN IF NOT EXISTS password_hash_version TEXT DEFAULT 'sha256_v1',
ADD COLUMN IF NOT EXISTS password_salt TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- 2. تحسين الفهارس للأداء
CREATE INDEX IF NOT EXISTS idx_ash_users_status_role ON public.ash_users(status, role);
CREATE INDEX IF NOT EXISTS idx_ash_users_email_verified ON public.ash_users(email_verified_at) WHERE email_verified_at IS NOT NULL;

-- 3. دالة تطبيع البريد الإلكتروني محسّنة
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

-- 4. دالة إنشاء hash آمن موحد
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