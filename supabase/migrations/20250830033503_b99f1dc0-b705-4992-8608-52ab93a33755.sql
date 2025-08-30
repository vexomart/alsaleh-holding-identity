-- إنشاء باقي الدوال المطلوبة للنظام

-- 1. إنشاء الدوال المفقودة في الجدول الأساسي
CREATE TABLE IF NOT EXISTS public.auth_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_lower TEXT NOT NULL,
  result TEXT NOT NULL, -- 'success', 'invalid', 'db_error', 'duplicate'
  error_code TEXT,
  error_constraint TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء الفهارس
CREATE INDEX IF NOT EXISTS idx_auth_logs_email_lower ON public.auth_logs(email_lower);
CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON public.auth_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_logs_result ON public.auth_logs(result);

-- تحديث جدول ash_users للتأكد من الحقول المطلوبة
ALTER TABLE public.ash_users 
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- إنشاء فهرس فريد للبريد الإلكتروني المطبع
CREATE UNIQUE INDEX IF NOT EXISTS idx_ash_users_email_lower ON public.ash_users(email_lower);

-- دالة تسجيل محاولات المصادقة
CREATE OR REPLACE FUNCTION public.log_auth_attempt(
  p_email_lower TEXT,
  p_result TEXT,
  p_error_code TEXT DEFAULT NULL,
  p_error_constraint TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) 
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.auth_logs (
    email_lower,
    result,
    error_code,
    error_constraint,
    ip_address,
    user_agent
  ) VALUES (
    p_email_lower,
    p_result,
    p_error_code,
    p_error_constraint,
    CASE WHEN p_ip_address IS NOT NULL THEN p_ip_address::INET ELSE NULL END,
    p_user_agent
  );
END;
$$;

-- دالة تطبيع البريد الإلكتروني
CREATE OR REPLACE FUNCTION public.normalize_email(email_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN LOWER(TRIM(email_input));
END;
$$;

-- دالة تطبيع الأرقام (العربية إلى الإنجليزية)
CREATE OR REPLACE FUNCTION public.normalize_digits(text_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN translate(text_input, '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹', '01234567890123456789');
END;
$$;

-- دالة التحقق من كلمة المرور
CREATE OR REPLACE FUNCTION public.verify_password(password_text TEXT, stored_hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  salt TEXT;
  hash_part TEXT;
  calculated_hash TEXT;
BEGIN
  -- استخراج salt و hash من النص المخزن
  salt := split_part(stored_hash, ':', 1);
  hash_part := split_part(stored_hash, ':', 2);
  
  -- حساب hash للكلمة المدخلة
  calculated_hash := encode(
    digest(password_text || salt, 'sha256'), 
    'hex'
  );
  
  -- مقارنة النتيجة
  RETURN calculated_hash = hash_part;
END;
$$;

-- دالة التحقق من OTP محسّنة
CREATE OR REPLACE FUNCTION public.verify_otp_code(
  p_email TEXT,
  p_code TEXT,
  p_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  normalized_email TEXT;
  normalized_code TEXT;
  otp_record RECORD;
  user_id_var UUID;
BEGIN
  -- تطبيع البيانات
  normalized_email := public.normalize_email(p_email);
  normalized_code := public.normalize_digits(p_code);
  
  -- البحث عن OTP صالح
  SELECT id, user_id, code, normalized_code, expires_at
  INTO otp_record
  FROM public.ash_email_otps
  WHERE email_lower = normalized_email
    AND type = p_type
    AND consumed = false
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- التحقق من وجود OTP
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- التحقق من الكود (يدعم الأرقام العربية والإنجليزية)
  IF otp_record.code != normalized_code AND otp_record.normalized_code != normalized_code THEN
    RETURN false;
  END IF;
  
  -- تسجيل استهلاك OTP
  UPDATE public.ash_email_otps
  SET consumed = true
  WHERE id = otp_record.id;
  
  -- تحديث حالة المستخدم عند التحقق من التسجيل
  IF p_type = 'register' THEN
    UPDATE public.ash_users
    SET status = 'active',
        verified_at = now()
    WHERE id = otp_record.user_id;
  END IF;
  
  RETURN true;
END;
$$;

-- إنشاء RLS policies
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all auth logs
DROP POLICY IF EXISTS "Admins can view auth logs" ON public.auth_logs;
CREATE POLICY "Admins can view auth logs" ON public.auth_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ash_users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- System can insert auth logs
DROP POLICY IF EXISTS "System can insert auth logs" ON public.auth_logs;
CREATE POLICY "System can insert auth logs" ON public.auth_logs
  FOR INSERT WITH CHECK (true);

-- دالة للحصول على إحصائيات تسجيل الدخول (للأدمن)
CREATE OR REPLACE FUNCTION public.get_auth_statistics(
  p_limit INTEGER DEFAULT 100
)
RETURNS TABLE(
  email_lower TEXT,
  total_attempts BIGINT,
  success_count BIGINT,
  failure_count BIGINT,
  last_attempt TIMESTAMP WITH TIME ZONE,
  last_success TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- التحقق من صلاحيات الأدمن
  IF NOT EXISTS (
    SELECT 1 FROM public.ash_users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  ) THEN
    RAISE EXCEPTION 'غير مصرح لك بالوصول إلى هذه البيانات';
  END IF;
  
  RETURN QUERY
  SELECT 
    al.email_lower,
    COUNT(*) as total_attempts,
    COUNT(*) FILTER (WHERE al.result = 'success') as success_count,
    COUNT(*) FILTER (WHERE al.result != 'success') as failure_count,
    MAX(al.created_at) as last_attempt,
    MAX(al.created_at) FILTER (WHERE al.result = 'success') as last_success
  FROM public.auth_logs al
  WHERE al.created_at > now() - INTERVAL '7 days'
  GROUP BY al.email_lower
  ORDER BY MAX(al.created_at) DESC
  LIMIT p_limit;
END;
$$;