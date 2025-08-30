-- إنشاء جدول تسجيل محاولات المصادقة
CREATE TABLE IF NOT EXISTS public.auth_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    email_lower TEXT NOT NULL,
    action TEXT NOT NULL, -- login, signup, verify_otp, password_reset
    status TEXT NOT NULL, -- success, failed, error
    error_code TEXT, -- E_WRONG_PASSWORD, E_DOUBLE_HASH, E_SALT_OR_TRUNC, E_WRONG_REALM
    probe_result JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS للوحة auth_logs
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

-- إزالة السياسات الموجودة أولاً
DROP POLICY IF EXISTS "Admins can view all auth logs" ON public.auth_logs;
DROP POLICY IF EXISTS "System can insert auth logs" ON public.auth_logs;

-- إعادة إنشاء السياسات
CREATE POLICY "Admins can view all auth logs" ON public.auth_logs
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.ash_users 
        WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
);

CREATE POLICY "System can insert auth logs" ON public.auth_logs
FOR INSERT WITH CHECK (true);

-- دالة تسجيل محاولات المصادقة
CREATE OR REPLACE FUNCTION public.log_auth_attempt(
    email_lower_param TEXT,
    action_param TEXT,
    status_param TEXT,
    error_code_param TEXT DEFAULT NULL,
    probe_result_param JSONB DEFAULT '{}',
    user_id_param UUID DEFAULT NULL,
    metadata_param JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    INSERT INTO public.auth_logs (
        user_id, email_lower, action, status, error_code, probe_result, metadata
    ) VALUES (
        user_id_param, email_lower_param, action_param, status_param, 
        error_code_param, probe_result_param, metadata_param
    );
END;
$$;