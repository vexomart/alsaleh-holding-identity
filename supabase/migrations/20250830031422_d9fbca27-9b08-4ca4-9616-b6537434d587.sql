-- إصلاح آخر دالة بدون search_path
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