-- إنشاء جداول نظام المصادقة الجديد (إصلاح الخطأ)

-- جدول المستخدمين الجديد
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

-- جدول رموز OTP
CREATE TABLE IF NOT EXISTS public.auth_email_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.auth_users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  code_normalized TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0 AND attempts <= 10),
  consumed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- جدول سجلات المصادقة
CREATE TABLE IF NOT EXISTS public.auth_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.auth_users(id) ON DELETE SET NULL,
  email_lower TEXT,
  ip_address INET,
  user_agent TEXT,
  realm TEXT NOT NULL CHECK (realm IN ('client', 'admin')),
  action TEXT NOT NULL CHECK (action IN ('login', 'signup', 'verify_otp', 'reset', 'logout')),
  result TEXT NOT NULL CHECK (result IN ('success', 'fail')),
  error_code TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- جدول جلسات المصادقة
CREATE TABLE IF NOT EXISTS public.auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.auth_users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  realm TEXT NOT NULL CHECK (realm IN ('client', 'admin')),
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_auth_users_email_lower ON public.auth_users(email_lower);
CREATE INDEX IF NOT EXISTS idx_auth_users_role_status ON public.auth_users(role, status);
CREATE INDEX IF NOT EXISTS idx_auth_email_otps_user_expires ON public.auth_email_otps(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_auth_email_otps_code_normalized ON public.auth_email_otps(code_normalized);
CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON public.auth_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_logs_realm_result ON public.auth_logs(realm, result);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_realm ON public.auth_sessions(user_id, realm);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON public.auth_sessions(session_token);

-- تفعيل RLS على الجداول
ALTER TABLE public.auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_email_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_sessions ENABLE ROW LEVEL SECURITY;