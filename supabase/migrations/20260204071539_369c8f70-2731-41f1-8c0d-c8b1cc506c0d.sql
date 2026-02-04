-- جدول الأجهزة الموثوقة
CREATE TABLE IF NOT EXISTS public.trusted_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    device_name TEXT,
    device_type TEXT, -- 'mobile', 'desktop', 'tablet'
    browser TEXT,
    os TEXT,
    ip_address INET,
    location TEXT,
    is_trusted BOOLEAN DEFAULT false,
    is_current BOOLEAN DEFAULT false,
    last_used_at TIMESTAMPTZ DEFAULT now(),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    tenant_id UUID REFERENCES public.tenants(id),
    UNIQUE(user_id, device_fingerprint)
);

-- جدول رموز التحقق من الأجهزة
CREATE TABLE IF NOT EXISTS public.device_verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- جدول سجل نشاط الحساب
CREATE TABLE IF NOT EXISTS public.account_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'login', 'logout', 'password_change', 'device_added', 'device_removed', '2fa_enabled', '2fa_disabled'
    device_fingerprint TEXT,
    ip_address INET,
    user_agent TEXT,
    location TEXT,
    metadata JSONB,
    risk_level TEXT DEFAULT 'low', -- 'low', 'medium', 'high'
    created_at TIMESTAMPTZ DEFAULT now(),
    tenant_id UUID REFERENCES public.tenants(id)
);

-- جدول إعدادات 2FA
CREATE TABLE IF NOT EXISTS public.two_factor_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    is_enabled BOOLEAN DEFAULT false,
    method TEXT DEFAULT 'email', -- 'email', 'sms', 'authenticator'
    backup_codes TEXT[],
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.two_factor_settings ENABLE ROW LEVEL SECURITY;

-- سياسات trusted_devices
CREATE POLICY "Users can view their own devices"
ON public.trusted_devices FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devices"
ON public.trusted_devices FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices"
ON public.trusted_devices FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices"
ON public.trusted_devices FOR DELETE
USING (auth.uid() = user_id);

-- سياسات device_verification_codes
CREATE POLICY "Users can view their own verification codes"
ON public.device_verification_codes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verification codes"
ON public.device_verification_codes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification codes"
ON public.device_verification_codes FOR UPDATE
USING (auth.uid() = user_id);

-- سياسات account_activity_log
CREATE POLICY "Users can view their own activity"
ON public.account_activity_log FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
ON public.account_activity_log FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- سياسات two_factor_settings
CREATE POLICY "Users can view their own 2FA settings"
ON public.two_factor_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 2FA settings"
ON public.two_factor_settings FOR ALL
USING (auth.uid() = user_id);

-- فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_trusted_devices_user_id ON public.trusted_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_fingerprint ON public.trusted_devices(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_account_activity_user_id ON public.account_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_account_activity_created ON public.account_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_device_codes_user ON public.device_verification_codes(user_id, device_fingerprint);

-- دالة لإنشاء رمز تحقق للجهاز
CREATE OR REPLACE FUNCTION generate_device_verification_code(
    p_user_id UUID,
    p_device_fingerprint TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_code TEXT;
BEGIN
    -- توليد رمز من 6 أرقام
    v_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- حذف الرموز القديمة
    DELETE FROM device_verification_codes 
    WHERE user_id = p_user_id AND device_fingerprint = p_device_fingerprint;
    
    -- إدراج الرمز الجديد (صالح لـ 10 دقائق)
    INSERT INTO device_verification_codes (user_id, device_fingerprint, code, expires_at)
    VALUES (p_user_id, p_device_fingerprint, v_code, NOW() + INTERVAL '10 minutes');
    
    RETURN v_code;
END;
$$;

-- دالة للتحقق من الرمز
CREATE OR REPLACE FUNCTION verify_device_code(
    p_user_id UUID,
    p_device_fingerprint TEXT,
    p_code TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_valid BOOLEAN := FALSE;
BEGIN
    -- التحقق من الرمز
    UPDATE device_verification_codes
    SET used = TRUE, used_at = NOW()
    WHERE user_id = p_user_id 
      AND device_fingerprint = p_device_fingerprint 
      AND code = p_code
      AND used = FALSE
      AND expires_at > NOW()
    RETURNING TRUE INTO v_valid;
    
    IF v_valid THEN
        -- تسجيل الجهاز كموثوق
        UPDATE trusted_devices
        SET is_trusted = TRUE, verified_at = NOW()
        WHERE user_id = p_user_id AND device_fingerprint = p_device_fingerprint;
    END IF;
    
    RETURN COALESCE(v_valid, FALSE);
END;
$$;