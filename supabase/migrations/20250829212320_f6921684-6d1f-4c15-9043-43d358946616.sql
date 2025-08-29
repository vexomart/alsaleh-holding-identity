-- إنشاء نوع البيانات للأدوار الإدارية المتقدمة
DO $$ BEGIN
    CREATE TYPE public.admin_role AS ENUM ('superadmin', 'admin', 'editor', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- إنشاء جدول سجل التدقيق للوصول المرفوض
CREATE TABLE IF NOT EXISTS public.unauthorized_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_role TEXT,
    attempted_path TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    blocked_reason TEXT DEFAULT 'insufficient_privileges',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id TEXT,
    additional_metadata JSONB DEFAULT '{}'::jsonb
);

-- تمكين RLS على الجدول الجديد
ALTER TABLE public.unauthorized_access_logs ENABLE ROW LEVEL SECURITY;

-- سياسة للسماح للإداريين بقراءة السجلات
CREATE POLICY "Admins can view unauthorized access logs" 
ON public.unauthorized_access_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- سياسة للسماح لأي شخص بإدراج سجلات (للتسجيل التلقائي)
CREATE POLICY "Allow logging unauthorized access attempts" 
ON public.unauthorized_access_logs 
FOR INSERT 
WITH CHECK (true);

-- إنشاء دالة للتحقق من الأدوار الإدارية المتقدمة
CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id uuid, _required_role admin_role DEFAULT 'admin')
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    user_role_value app_role;
BEGIN
    -- الحصول على دور المستخدم من جدول user_roles
    SELECT role INTO user_role_value 
    FROM public.user_roles 
    WHERE user_id = _user_id;
    
    -- إذا لم يكن للمستخدم دور، أرجع false
    IF user_role_value IS NULL THEN
        RETURN false;
    END IF;
    
    -- التحقق من الأدوار المسموحة حسب المتطلب
    CASE _required_role
        WHEN 'superadmin' THEN
            RETURN user_role_value = 'admin'; -- في النظام الحالي admin هو أعلى دور
        WHEN 'admin' THEN
            RETURN user_role_value = 'admin';
        WHEN 'editor' THEN
            RETURN user_role_value IN ('admin'); -- الإداريون يمكنهم التحرير
        WHEN 'viewer' THEN
            RETURN user_role_value IN ('admin'); -- الإداريون يمكنهم القراءة
        ELSE
            RETURN false;
    END CASE;
END;
$$;

-- دالة لتسجيل محاولات الوصول المرفوضة
CREATE OR REPLACE FUNCTION public.log_unauthorized_access(
    _attempted_path text,
    _user_id uuid DEFAULT auth.uid(),
    _blocked_reason text DEFAULT 'insufficient_privileges',
    _ip_address inet DEFAULT inet_client_addr(),
    _user_agent text DEFAULT NULL,
    _additional_data jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    _user_role text;
    _session_id text;
BEGIN
    -- الحصول على دور المستخدم
    SELECT role::text INTO _user_role 
    FROM public.user_roles 
    WHERE user_id = _user_id;
    
    -- إنشاء معرف جلسة مؤقت
    _session_id := encode(gen_random_bytes(16), 'hex');
    
    -- تسجيل محاولة الوصول المرفوضة
    INSERT INTO public.unauthorized_access_logs (
        user_id,
        user_role,
        attempted_path,
        ip_address,
        user_agent,
        blocked_reason,
        session_id,
        additional_metadata
    ) VALUES (
        _user_id,
        COALESCE(_user_role, 'unauthenticated'),
        _attempted_path,
        _ip_address,
        _user_agent,
        _blocked_reason,
        _session_id,
        _additional_data || jsonb_build_object(
            'timestamp', extract(epoch from now()),
            'detected_at', now()::text
        )
    );
    
    -- تسجيل أيضاً في سجل الأمان العام
    INSERT INTO public.security_audit_logs (
        event_type,
        user_id,
        action,
        risk_level,
        metadata
    ) VALUES (
        'unauthorized_admin_access',
        _user_id,
        'blocked_admin_access_attempt',
        'high',
        jsonb_build_object(
            'attempted_path', _attempted_path,
            'user_role', COALESCE(_user_role, 'unauthenticated'),
            'blocked_reason', _blocked_reason,
            'ip_address', _ip_address::text,
            'user_agent', _user_agent,
            'session_id', _session_id
        )
    );
END;
$$;