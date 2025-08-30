-- إنشاء جدول المستخدمين الجديد فقط
CREATE TABLE IF NOT EXISTS public.auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_lower TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('client', 'admin', 'superadmin')) DEFAULT 'client',
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'blocked', 'inactive')) DEFAULT 'pending',
  password_algo TEXT NOT NULL CHECK (password_algo IN ('bcrypt_v1', 'argon2id_v1', 'sha256_v1')) DEFAULT 'bcrypt_v1',
  password_salt_b64 TEXT NOT NULL,
  password_hash_b64 TEXT NOT NULL,
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- فهرس فريد للبريد
CREATE UNIQUE INDEX IF NOT EXISTS idx_auth_users_email_lower ON public.auth_users(email_lower);

-- تفعيل RLS
ALTER TABLE public.auth_users ENABLE ROW LEVEL SECURITY;

-- دوال المساعدة
CREATE OR REPLACE FUNCTION public.normalize_email(email_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN TRIM(LOWER(email_input));
END;
$$;

CREATE OR REPLACE FUNCTION public.normalize_digits(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN TRANSLATE(input_text, '٠١٢٣٤٥٦٧٨٩', '0123456789');
END;
$$;