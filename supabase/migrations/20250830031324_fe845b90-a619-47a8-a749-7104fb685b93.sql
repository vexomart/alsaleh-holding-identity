-- إصلاح نموذج البيانات وإضافة email_lower للحماية من التكرار
-- تحديث جدول ash_users مع إضافة email_lower
ALTER TABLE public.ash_users ADD COLUMN IF NOT EXISTS email_lower TEXT;

-- إنشاء فهرس فريد على email_lower
CREATE UNIQUE INDEX IF NOT EXISTS idx_ash_users_email_lower 
ON public.ash_users (email_lower);

-- تحديث البيانات الموجودة لإضافة email_lower
UPDATE public.ash_users 
SET email_lower = LOWER(TRIM(email)) 
WHERE email_lower IS NULL OR email_lower = '';

-- جعل email_lower غير قابل للـ null
ALTER TABLE public.ash_users ALTER COLUMN email_lower SET NOT NULL;

-- إنشاء جدول سجلات التشخيص للأدمن
CREATE TABLE IF NOT EXISTS public.auth_diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_lower TEXT NOT NULL,
  result TEXT NOT NULL, -- 'success', 'duplicate', 'invalid', 'db_error'
  error_code TEXT,
  error_constraint TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس للتشخيص
CREATE INDEX IF NOT EXISTS idx_auth_diagnostics_created_at 
ON public.auth_diagnostics (created_at DESC);

-- إنشاء RLS policies للتشخيص
ALTER TABLE public.auth_diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only superadmin can view auth diagnostics"
ON public.auth_diagnostics FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.ash_users 
    WHERE id = auth.uid() 
    AND role = 'superadmin'
  )
);

-- دالة التحقق من البريد الإلكتروني
CREATE OR REPLACE FUNCTION public.normalize_email(email_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  IF email_input IS NULL OR email_input = '' THEN
    RETURN NULL;
  END IF;
  
  -- تطبيع البريد: trim + lowercase
  RETURN LOWER(TRIM(email_input));
END;
$$;

-- دالة التحقق من تطبيع الأرقام
CREATE OR REPLACE FUNCTION public.normalize_digits(text_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result TEXT := text_input;
BEGIN
  IF result IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- تحويل الأرقام العربية إلى إنجليزية
  result := REPLACE(result, '٠', '0');
  result := REPLACE(result, '١', '1');
  result := REPLACE(result, '٢', '2');
  result := REPLACE(result, '٣', '3');
  result := REPLACE(result, '٤', '4');
  result := REPLACE(result, '٥', '5');
  result := REPLACE(result, '٦', '6');
  result := REPLACE(result, '٧', '7');
  result := REPLACE(result, '٨', '8');
  result := REPLACE(result, '٩', '9');
  
  RETURN result;
END;
$$;

-- دالة تسجيل محاولات التشخيص
CREATE OR REPLACE FUNCTION public.log_auth_attempt(
  p_email_lower TEXT,
  p_result TEXT,
  p_error_code TEXT DEFAULT NULL,
  p_error_constraint TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.auth_diagnostics (
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
    p_ip_address,
    p_user_agent
  );
  
  -- إبقاء آخر 1000 سجل فقط لتجنب امتلاء الجدول
  DELETE FROM public.auth_diagnostics 
  WHERE id NOT IN (
    SELECT id FROM public.auth_diagnostics 
    ORDER BY created_at DESC 
    LIMIT 1000
  );
END;
$$;

-- دالة التحقق من قوة كلمة المرور
CREATE OR REPLACE FUNCTION public.validate_password(password_input TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result JSONB;
BEGIN
  result := jsonb_build_object('valid', true, 'message', '');
  
  -- التحقق من الطول
  IF LENGTH(password_input) < 8 THEN
    result := jsonb_build_object(
      'valid', false, 
      'message', 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل'
    );
    RETURN result;
  END IF;
  
  -- التحقق من وجود رقم
  IF password_input !~ '[0-9]' THEN
    result := jsonb_build_object(
      'valid', false, 
      'message', 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل'
    );
    RETURN result;
  END IF;
  
  -- التحقق من وجود حرف
  IF password_input !~ '[a-zA-Z]' THEN
    result := jsonb_build_object(
      'valid', false, 
      'message', 'يجب أن تحتوي كلمة المرور على حرف واحد على الأقل'
    );
    RETURN result;
  END IF;
  
  RETURN result;
END;
$$;

-- دالة التحقق من صحة البريد الإلكتروني
CREATE OR REPLACE FUNCTION public.validate_email(email_input TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result JSONB;
  normalized_email TEXT;
BEGIN
  result := jsonb_build_object('valid', true, 'message', '', 'normalized', '');
  
  IF email_input IS NULL OR email_input = '' THEN
    result := jsonb_build_object(
      'valid', false, 
      'message', 'البريد الإلكتروني مطلوب'
    );
    RETURN result;
  END IF;
  
  normalized_email := normalize_email(email_input);
  
  -- التحقق من تنسيق البريد الإلكتروني
  IF normalized_email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
    result := jsonb_build_object(
      'valid', false, 
      'message', 'تنسيق البريد الإلكتروني غير صحيح'
    );
    RETURN result;
  END IF;
  
  result := jsonb_build_object(
    'valid', true, 
    'message', '', 
    'normalized', normalized_email
  );
  
  RETURN result;
END;
$$;