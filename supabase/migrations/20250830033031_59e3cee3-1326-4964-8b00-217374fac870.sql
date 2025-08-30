-- =========================================================================================
-- إصلاح نهائي لنظام تسجيل الدخول: إنشاء جدول auth_logs ودوال المصادقة المحسّنة
-- =========================================================================================

-- 1. إنشاء جدول سجل التشخيص
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

-- 2. تحديث جدول ash_users للتأكد من الحقول المطلوبة
ALTER TABLE public.ash_users 
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- إنشاء فهرس فريد للبريد الإلكتروني المطبع
CREATE UNIQUE INDEX IF NOT EXISTS idx_ash_users_email_lower ON public.ash_users(email_lower);

-- 3. دالة تسجيل محاولات المصادقة
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

-- 4. دالة تطبيع البريد الإلكتروني
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

-- 5. دالة تطبيع الأرقام (العربية إلى الإنجليزية)
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

-- 6. دالة إنشاء hash آمن لكلمة المرور
CREATE OR REPLACE FUNCTION public.create_secure_password_hash(password_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  salt TEXT;
  password_hash TEXT;
BEGIN
  -- إنشاء salt عشوائي
  salt := encode(gen_random_bytes(16), 'hex');
  
  -- تشفير كلمة المرور مع salt باستخدام SHA-256
  password_hash := encode(
    digest(password_text || salt, 'sha256'), 
    'hex'
  );
  
  -- إرجاع النتيجة بصيغة salt:hash
  RETURN salt || ':' || password_hash;
END;
$$;

-- 7. دالة التحقق من كلمة المرور
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

-- 8. دالة المصادقة البسيطة المحسّنة
CREATE OR REPLACE FUNCTION public.simple_authenticate_user(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE(
  success BOOLEAN,
  user_id UUID,
  role TEXT,
  status TEXT,
  message TEXT
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
  normalized_email := public.normalize_email(p_email);
  
  -- البحث عن المستخدم
  SELECT id, email, name, role, status, password_hash, verified_at
  INTO user_record
  FROM public.ash_users
  WHERE email_lower = normalized_email;
  
  -- التحقق من وجود المستخدم
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'not_found'::TEXT, 'البريد الإلكتروني غير مسجل'::TEXT;
    RETURN;
  END IF;
  
  -- التحقق من حالة المستخدم
  IF user_record.status = 'blocked' THEN
    RETURN QUERY SELECT false, user_record.id, user_record.role, 'blocked'::TEXT, 'تم حظر الحساب'::TEXT;
    RETURN;
  END IF;
  
  IF user_record.status = 'inactive' THEN
    RETURN QUERY SELECT false, user_record.id, user_record.role, 'inactive'::TEXT, 'الحساب غير مفعل'::TEXT;
    RETURN;
  END IF;
  
  -- التحقق من كلمة المرور
  IF user_record.password_hash LIKE '%:%' THEN
    -- استخدام دالة التحقق الجديدة
    password_valid := public.verify_password(p_password, user_record.password_hash);
  ELSE
    -- تحقق قديم للتوافق (سيتم إزالته لاحقاً)
    password_valid := user_record.password_hash = ('hashed_' || p_password || '_' || extract(epoch from (SELECT created_at FROM public.ash_users WHERE id = user_record.id))::text);
  END IF;
  
  IF NOT password_valid THEN
    RETURN QUERY SELECT false, user_record.id, user_record.role, 'wrong_password'::TEXT, 'كلمة المرور غير صحيحة'::TEXT;
    RETURN;
  END IF;
  
  -- نجحت المصادقة
  RETURN QUERY SELECT true, user_record.id, user_record.role, user_record.status, 'تم تسجيل الدخول بنجاح'::TEXT;
  RETURN;
END;
$$;

-- 9. دالة التحقق من OTP محسّنة
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

-- 10. تحديث دالة إنشاء OTP
CREATE OR REPLACE FUNCTION public.create_otp_code(
  p_user_id UUID,
  p_email TEXT,
  p_type TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  otp_code TEXT;
  normalized_email TEXT;
  normalized_code TEXT;
BEGIN
  -- توليد رمز 6 أرقام عشوائي
  otp_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  normalized_email := public.normalize_email(p_email);
  normalized_code := public.normalize_digits(otp_code);
  
  -- حذف الرموز القديمة للمستخدم والنوع
  DELETE FROM public.ash_email_otps 
  WHERE email_lower = normalized_email 
    AND type = p_type 
    AND (consumed = true OR expires_at < now());
  
  -- إدراج الرمز الجديد
  INSERT INTO public.ash_email_otps (
    user_id, 
    email_lower, 
    code, 
    normalized_code,
    type, 
    expires_at
  ) VALUES (
    p_user_id,
    normalized_email,
    otp_code,
    normalized_code,
    p_type,
    now() + INTERVAL '10 minutes'
  );
  
  RETURN otp_code;
END;
$$;

-- 11. إنشاء RLS policies
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all auth logs
CREATE POLICY "Admins can view auth logs" ON public.auth_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ash_users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- System can insert auth logs
CREATE POLICY "System can insert auth logs" ON public.auth_logs
  FOR INSERT WITH CHECK (true);

-- 12. دالة للحصول على إحصائيات تسجيل الدخول (للأدمن)
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