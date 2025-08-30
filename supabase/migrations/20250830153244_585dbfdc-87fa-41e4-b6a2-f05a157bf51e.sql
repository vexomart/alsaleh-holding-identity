-- تفعيل RLS على جدول password_reset_tokens
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان
CREATE POLICY "allow_service_role_and_users_insert" ON public.password_reset_tokens
FOR INSERT 
WITH CHECK (
  ((auth.jwt() ->> 'role') = 'service_role') OR 
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

CREATE POLICY "allow_service_role_access" ON public.password_reset_tokens
FOR ALL 
USING (((auth.jwt() ->> 'role') = 'service_role'));

CREATE POLICY "users_can_view_own_tokens" ON public.password_reset_tokens
FOR SELECT 
USING (user_id = auth.uid() AND auth.uid() IS NOT NULL);

-- إضافة مؤشر للأمان
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_used ON public.password_reset_tokens(used);

-- تحديث دالة التنظيف لتستخدم search_path بشكل صحيح
CREATE OR REPLACE FUNCTION public.cleanup_expired_reset_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.password_reset_tokens 
  WHERE expires_at < NOW() OR used = TRUE;
END;
$$;